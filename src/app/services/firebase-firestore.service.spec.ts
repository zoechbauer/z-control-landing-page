import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';

import { FirebaseFirestoreService } from './firebase-firestore.service';
import {
  ALL_REPOS,
  COLLECTION,
  GithubAnalyticsTrafficDocument,
  REPO,
  REPOS,
  TrafficType,
} from '@app/shared/GitHubConstants';
import { FirestoreAdapterService } from './firestore-adapter.service';

describe('FirebaseFirestoreService', () => {
  let service: FirebaseFirestoreService;
  let firestoreSpy: Firestore;
  let adapterSpy: jasmine.SpyObj<FirestoreAdapterService>;

  const collection = COLLECTION.GITHUB_ANALYTICS_TRAFFIC_HISTORY;
  const repo1 = REPOS[0].repo;
  const repo2 = REPOS[1].repo;

  const makeDoc = (
    repo: (typeof REPO)[keyof typeof REPO],
    views: Array<{ timestamp: string; count: number; uniques: number }>,
    clones: Array<{ timestamp: string; count: number; uniques: number }>,
    timestamp = '2026-06-19T16:00:36.488Z',
  ): GithubAnalyticsTrafficDocument => ({
    collection,
    repo,
    timestamp,
    views: {
      count: views.reduce((sum, item) => sum + item.count, 0),
      uniques: views.reduce((sum, item) => sum + item.uniques, 0),
      views,
    },
    clones: {
      count: clones.reduce((sum, item) => sum + item.count, 0),
      uniques: clones.reduce((sum, item) => sum + item.uniques, 0),
      clones,
    },
  });

  const mockAnalyticsData: GithubAnalyticsTrafficDocument[] = [
    makeDoc(
      repo1,
      [
        { uniques: 10, count: 20, timestamp: '2026-06-18T16:00:36.488Z' },
        { uniques: 15, count: 30, timestamp: '2026-06-19T16:00:36.488Z' },
      ],
      [{ uniques: 5, count: 10, timestamp: '2026-06-18T16:00:36.488Z' }],
    ),
    makeDoc(
      repo2,
      [
        { uniques: 20, count: 40, timestamp: '2026-06-18T16:00:36.488Z' },
        { uniques: 30, count: 60, timestamp: '2026-06-19T16:00:36.488Z' },
      ],
      [{ uniques: 10, count: 20, timestamp: '2026-06-18T16:00:36.488Z' }],
    ),
  ];

  beforeEach(() => {
    firestoreSpy = {} as Firestore;
    adapterSpy = jasmine.createSpyObj('FirestoreAdapterService', [
      'getDocSnapshot',
      'connectEmulator',
    ]);
    adapterSpy.getDocSnapshot.and.resolveTo({
      exists: () => true,
      data: () => mockAnalyticsData[0],
    } as any);

    TestBed.configureTestingModule({
      providers: [
        FirebaseFirestoreService,
        { provide: Firestore, useValue: firestoreSpy },
        { provide: FirestoreAdapterService, useValue: adapterSpy },
      ],
    });

    service = TestBed.inject(FirebaseFirestoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAnalyticsData', () => {
    it('should return analytics data for one repo', async () => {
      spyOn<any>(service, 'fetchAnalyticsForRepo').and.resolveTo(
        mockAnalyticsData[0],
      );

      const data = await service.getAnalyticsData(collection, repo1);

      expect(data).toEqual([mockAnalyticsData[0]]);
      expect((service as any).collection).toBe(collection);
      expect((service as any).repo).toBe(repo1);
      expect((service as any).useFirebaseEmulator).toBeFalse();
    });

    it('should return analytics data for all repos', async () => {
      spyOn<any>(service, 'fetchAnalyticsForRepo').and.resolveTo(
        mockAnalyticsData[0],
      );

      const data = await service.getAnalyticsData(collection, ALL_REPOS as any);

      expect(data.length).toBe(REPOS.length);
      expect((service as any).repo).toBe(REPOS[REPOS.length - 1].repo);
    });

    it('should store emulator flag when enabled', async () => {
      spyOn<any>(service, 'fetchAnalyticsForRepo').and.resolveTo(
        mockAnalyticsData[0],
      );

      await service.getAnalyticsData(collection, repo1, true);

      expect((service as any).useFirebaseEmulator).toBeTrue();
    });
  });

  describe('processData', () => {
    it('should process raw analytics data into a merged document', () => {
      const rawData = {
        views: [
          { uniques: 1, count: 2, timestamp: '2026-06-19T00:00:00.000Z' },
          { uniques: 3, count: 4, timestamp: '2026-06-20T00:00:00.000Z' },
        ],
        clones: [
          { uniques: 5, count: 6, timestamp: '2026-06-18T00:00:00.000Z' },
        ],
        timestamp: '2026-06-21T00:00:00.000Z',
      };

      const result = (service as any).processData(rawData);

      expect(result.views.count).toBe(6);
      expect(result.views.uniques).toBe(4);
      expect(result.clones.count).toBe(6);
      expect(result.clones.uniques).toBe(5);
    });

    it('should log and throw an error if error occurs on processData', () => {
      spyOn(console, 'error');
      spyOn<any>(service, 'processStatistics').and.throwError('Test error');
      const rawData = {
        views: null, // This will cause an error in processStatistics
        clones: [],
        timestamp: '2026-06-21T00:00:00.000Z',
      };
      expect(() => (service as any).processData(rawData)).toThrowError();
      expect(console.error).toHaveBeenCalledWith(
        'Error processing analytics data:',
        jasmine.any(Error),
      );
    });
  });

  describe('processStatistics', () => {
    it('should aggregate and sort views descending by timestamp', () => {
      const unsorted = [
        { uniques: 1, count: 2, timestamp: '2026-06-18T00:00:00.000Z' },
        { uniques: 3, count: 4, timestamp: '2026-06-20T00:00:00.000Z' },
        { uniques: 5, count: 6, timestamp: '2026-06-19T00:00:00.000Z' },
      ];

      const result = (service as any).processStatistics(
        TrafficType.VIEWS,
        [...unsorted],
        '2026-06-21T00:00:00.000Z',
      );

      expect(result.views.count).toBe(12);
      expect(result.views.uniques).toBe(9);
    });
  });

  describe('mergeDocuments', () => {
    it('should merge two analytics docs', () => {
      const doc1 = (service as any).processStatistics(
        TrafficType.VIEWS,
        [{ uniques: 1, count: 2, timestamp: '2026-06-18T00:00:00.000Z' }],
        '2026-06-21T00:00:00.000Z',
      );
      const doc2 = (service as any).processStatistics(
        TrafficType.CLONES,
        [{ uniques: 3, count: 4, timestamp: '2026-06-19T00:00:00.000Z' }],
        '2026-06-22T00:00:00.000Z',
      );

      const merged = (service as any).mergeDocuments(doc1, doc2);

      expect(merged.views.count).toBe(2);
      expect(merged.clones.count).toBe(4);
    });
  });

  describe('createRepoWithEmptyStatistics', () => {
    it('should create empty stats document', () => {
      const result = (service as any).createRepoWithEmptyStatistics(repo1);

      expect(result).toEqual({
        collection,
        repo: repo1,
        timestamp: '',
        views: { count: 0, uniques: 0, views: [] },
        clones: { count: 0, uniques: 0, clones: [] },
      });
    });
  });

  describe('fetchAnalyticsForRepo', () => {
    const repo1SnapshotData = mockAnalyticsData[0];

    beforeEach(() => {
      adapterSpy.getDocSnapshot.and.resolveTo({
        exists: () => true,
        data: () => ({
          views: [...repo1SnapshotData.views.views],
          clones: [...repo1SnapshotData.clones.clones],
          timestamp: repo1SnapshotData.timestamp,
        }),
      } as any);

      (service as any).collection = collection;
      (service as any).repo = repo1;
      (service as any).useFirebaseEmulator = false;
    });

    it('should fetch analytics data for a repo', async () => {
      const result = await (service as any).fetchAnalyticsForRepo();

      // Sort views and clones in expected result to match processing logic
      const expected = {
        ...mockAnalyticsData[0],
        timestamp: repo1SnapshotData.timestamp,
        views: {
          ...mockAnalyticsData[0].views,
          views: [...mockAnalyticsData[0].views.views].sort((a, b) =>
            a.timestamp < b.timestamp ? 1 : -1,
          ),
        },
        clones: {
          ...mockAnalyticsData[0].clones,
          clones: [...mockAnalyticsData[0].clones.clones].sort((a, b) =>
            a.timestamp < b.timestamp ? 1 : -1,
          ),
        },
      };

      expect(result).toEqual(expected);
      expect(adapterSpy.getDocSnapshot).toHaveBeenCalledWith(
        COLLECTION.GITHUB_ANALYTICS_TRAFFIC_HISTORY,
        repo1,
      );
    });

    it('should return empty statistics if no data exists', async () => {
      adapterSpy.getDocSnapshot.and.resolveTo({
        exists: () => false,
      } as any);

      (service as any).useFirebaseEmulator = false;

      const result = await (service as any).fetchAnalyticsForRepo();

      expect(result).toEqual({
        collection: COLLECTION.GITHUB_ANALYTICS_TRAFFIC_HISTORY,
        repo: repo1,
        timestamp: '',
        views: { count: 0, uniques: 0, views: [] },
        clones: { count: 0, uniques: 0, clones: [] },
      });
    });

    it('should connect to emulator and log if useFirebaseEmulator is true', async () => {
      spyOn(console, 'log');
      (service as any).useFirebaseEmulator = true;

      await (service as any).fetchAnalyticsForRepo();

      expect(console.log).toHaveBeenCalledWith(
        'Using Firebase Emulator for Firestore',
      );
      expect(adapterSpy.connectEmulator).toHaveBeenCalledWith(
        'localhost',
        8080,
      );
    });

    it('should normalize traffic document shape when collection is GITHUB_ANALYTICS_TRAFFIC', async () => {
      adapterSpy.getDocSnapshot.and.resolveTo({
        exists: () => true,
        data: () => ({
          views: {
            views: [
              { uniques: 10, count: 20, timestamp: '2026-06-18T16:00:36.488Z' },
              { uniques: 15, count: 30, timestamp: '2026-06-19T16:00:36.488Z' },
            ],
          },
          clones: {
            clones: [
              { uniques: 5, count: 10, timestamp: '2026-06-18T16:00:36.488Z' },
            ],
          },
          timestamp: '2026-06-19T16:00:36.488Z',
        }),
      } as any);

      (service as any).collection = COLLECTION.GITHUB_ANALYTICS_TRAFFIC;
      (service as any).repo = repo1;
      (service as any).useFirebaseEmulator = false;

      const result = await (service as any).fetchAnalyticsForRepo();

      expect(result).toEqual({
        collection: COLLECTION.GITHUB_ANALYTICS_TRAFFIC,
        repo: repo1,
        timestamp: '2026-06-19T16:00:36.488Z',
        views: {
          count: 50,
          uniques: 25,
          views: [
            { uniques: 15, count: 30, timestamp: '2026-06-19T16:00:36.488Z' },
            { uniques: 10, count: 20, timestamp: '2026-06-18T16:00:36.488Z' },
          ],
        },
        clones: {
          count: 10,
          uniques: 5,
          clones: [
            { uniques: 5, count: 10, timestamp: '2026-06-18T16:00:36.488Z' },
          ],
        },
      });
    });
  });
});
