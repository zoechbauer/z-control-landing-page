import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular/standalone';
import { TranslateService } from '@ngx-translate/core';

import { FirebaseFirestoreGithubService } from 'src/app/services/firebase-firestore-github.service';
import { FirebaseAnalyticsService } from '@app/services/firebase-analytics.service';
import {
  COLLECTION,
  GithubAnalyticsTrafficDocument,
  REPO,
  REPOS,
} from 'src/app/shared/github.constants';
import { UtilsService } from '@app/services/utils.service';
import { GithubAnalyticsDetailsComponent } from '@ui/components/github-analytics-details/github-analytics-details.component';
import { createTranslateServiceMock } from '@testing/translate-service.mock';

// Mock FirebaseFirestoreService to avoid real Firebase calls
class MockFirebaseFirestoreGithubService {
  getAnalyticsData(
    collection?: any,
    repo?: any,
    useFirebaseEmulator?: boolean,
  ): Promise<GithubAnalyticsTrafficDocument[]> {
    // Return an empty array to match the expected type
    return Promise.resolve([]);
  }
}

class MockFirebaseAnalyticsService {
  init(): void {}
  logEvent(name: string, params?: { [key: string]: any }): void {}
  enableCollection(allow: boolean): void {}
  enabled$ = { subscribe: () => {} }; // Stub for observable
}

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
    [{ uniques: 10, count: 20, timestamp: '2026-06-08T16:00:36.488Z' }],
  ),
];

describe('GithubAnalyticsDetailsComponent', () => {
  let component: GithubAnalyticsDetailsComponent;
  let fixture: ComponentFixture<GithubAnalyticsDetailsComponent>;
  let firebaseFirestoreGithubService: FirebaseFirestoreGithubService;
  let firebaseAnalyticsService: FirebaseAnalyticsService;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let utilsServiceSpy: jasmine.SpyObj<any>;
  let timestampBackup: string;

  beforeEach(waitForAsync(() => {
    modalControllerSpy = jasmine.createSpyObj('ModalController', ['dismiss']);

    utilsServiceSpy = jasmine.createSpyObj('UtilsService', [
      'isSmallScreen',
      'isPortrait',
      'openMarkdownDoc',
      'addLeadingBlanks',
    ]);

    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), GithubAnalyticsDetailsComponent],
      providers: [
        { provide: TranslateService, useValue: createTranslateServiceMock() },
        {
          provide: FirebaseFirestoreGithubService,
          useClass: MockFirebaseFirestoreGithubService,
        },
        {
          provide: FirebaseAnalyticsService,
          useClass: MockFirebaseAnalyticsService,
        },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: UtilsService, useValue: utilsServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GithubAnalyticsDetailsComponent);
    component = fixture.componentInstance;
    firebaseFirestoreGithubService = TestBed.inject(FirebaseFirestoreGithubService);
    firebaseAnalyticsService = TestBed.inject(FirebaseAnalyticsService);

    component.item = mockAnalyticsData[0];
    component.analyticsData = mockAnalyticsData;
    component.githubTrafficData = mockAnalyticsData;
    timestampBackup = component.item.timestamp; // Backup the original timestamp for restoration in afterEach
    fixture.detectChanges();
  }));

  afterEach(() => {
    component.item.timestamp = timestampBackup;
  });

  it('should create', () => {
    spyOn(firebaseFirestoreGithubService, 'getAnalyticsData').and.returnValue(
      Promise.resolve(mockAnalyticsData),
    );
    expect(component).toBeTruthy();
  });

  describe('onGetSourceCode', () => {
    let windowOpenSpy: jasmine.Spy;

    beforeEach(() => {
      spyOn(firebaseAnalyticsService, 'logEvent');
      windowOpenSpy = spyOn(globalThis.window, 'open');
    });

    it('should open source and call logEvent on FirebaseAnalyticsService with correct parameters', () => {
      REPOS.forEach((repoObj) => {
        const url = `https://github.com/zoechbauer/${repoObj.repo}`;
        component.onGetSourceCode(repoObj.repo);

        expect(windowOpenSpy)
          .withContext('window.open for repo: ' + repoObj.repo)
          .toHaveBeenCalledWith(url, '_blank');

        expect(firebaseAnalyticsService.logEvent)
          .withContext('logEvent for repo: ' + repoObj.repo)
          .toHaveBeenCalledWith('get_source_code', {
            repo: repoObj.repo,
            app: REPO.Z_CONTROL_LANDING_PAGE,
          });
      });
    });

    it('should log error when open source fails', () => {
      windowOpenSpy.and.throwError('Test error');
      spyOn(console, 'error');

      component.onGetSourceCode(REPOS[0].repo);

      expect(console.error).toHaveBeenCalledWith(
        'Error opening source code URL:',
        jasmine.any(Error),
      );
    });
  });

  describe('onOpenGithubAnalyticsHelp', () => {
    beforeEach(() => {
      spyOn(firebaseAnalyticsService, 'logEvent');
      utilsServiceSpy.openMarkdownDoc.and.returnValue(Promise.resolve());
    });

    it('should open markdown and call logEvent on FirebaseAnalyticsService with correct parameters', async () => {
      for (const repoObj of REPOS) {
        for (const lang of ['en', 'de']) {
          component.lang = lang;
          await component.onOpenGithubAnalyticsHelp(repoObj.repo);

          expect(utilsServiceSpy.openMarkdownDoc)
            .withContext('openMarkdownDoc for repo: ' + repoObj.repo)
            .toHaveBeenCalledWith(
              `assets/app-docs/backend-functions-app/github-analytics-help-${lang}.md`,
              'SETTINGS.GITHUB_ANALYTICS.LABEL.HELP_PAGE_TITLE_1_LINE',
              'SETTINGS.GITHUB_ANALYTICS.LABEL.HELP_PAGE_TITLE_2_LINES',
            );

          expect(firebaseAnalyticsService.logEvent)
            .withContext('logEvent for repo: ' + repoObj.repo)
            .toHaveBeenCalledWith('get_github_analytics_help', {
              repo: repoObj.repo,
              language: lang,
              app: REPO.Z_CONTROL_LANDING_PAGE,
            });
        }
      }
    });

    it('should log error when open markdown fails', async () => {
      utilsServiceSpy.openMarkdownDoc.and.rejectWith(new Error('Test error'));
      spyOn(console, 'error');

      await component.onOpenGithubAnalyticsHelp(REPOS[0].repo);

      expect(console.error).toHaveBeenCalledWith(
        'Error opening GitHub Analytics help document:',
        jasmine.any(Error),
      );
    });
  });

  describe('calculate statistics values', () => {
    it('should calculate total views count correctly', () => {
      const item: GithubAnalyticsTrafficDocument = mockAnalyticsData[0];
      const totalViewsCount = component.getViewsTotalCount(item);
      expect(totalViewsCount).toBe(50); // 20 + 30
    });

    it('should calculate total unique views correctly', () => {
      const item: GithubAnalyticsTrafficDocument = mockAnalyticsData[0];
      const totalUniqueViews = component.getViewsTotalUniques(item);
      expect(totalUniqueViews).toBe(25); // 10 + 15
    });

    it('should calculate total clones count correctly', () => {
      const item: GithubAnalyticsTrafficDocument = mockAnalyticsData[0];
      const totalClonesCount = component.getClonesTotalCount(item);
      expect(totalClonesCount).toBe(10); // 10
    });

    it('should calculate total unique clones correctly', () => {
      const item: GithubAnalyticsTrafficDocument = mockAnalyticsData[0];
      const totalUniqueClones = component.getClonesTotalUniques(item);
      expect(totalUniqueClones).toBe(5); // 5
    });

    it('should return the oldest item date correctly', () => {
      const item: GithubAnalyticsTrafficDocument = mockAnalyticsData[0];
      const oldestDate = component.getOldestItem(item);
      expect(oldestDate).toEqual(new Date('2026-06-18T16:00:36.488Z'));
    });

    it('should return the most recent item date correctly', () => {
      const item: GithubAnalyticsTrafficDocument = mockAnalyticsData[0];
      const mostRecentDate = component.getMostRecentItem(item);
      expect(mostRecentDate).toEqual(new Date('2026-06-19T16:00:36.488Z'));
    });

    it('should return null for oldest item if no views or clones', () => {
      const item: GithubAnalyticsTrafficDocument = makeDoc(
        REPOS[0].repo,
        [],
        [],
      );
      const oldestDate = component.getOldestItem(item);
      expect(oldestDate).toBeNull();
    });

    it('should return null for most recent item if no views or clones', () => {
      const item: GithubAnalyticsTrafficDocument = makeDoc(
        REPOS[0].repo,
        [],
        [],
      );
      const mostRecentDate = component.getMostRecentItem(item);
      expect(mostRecentDate).toBeNull();
    });
  });

  describe('getFormattedFirstAccessDays', () => {
    it('should return the correct formatted first access days (1 day ago)', () => {
      component.lang = 'en';
      const item: GithubAnalyticsTrafficDocument = mockAnalyticsData[0];
      const formattedDays = component.getFormattedFirstAccessDays(item);
      expect(formattedDays).toBe('= 1 day ago'); // 2026-06-19 - 2026-06-18 = 1 day
    });

    it('should return the correct formatted first access days (13 days ago)', () => {
      component.lang = 'en';
      const item: GithubAnalyticsTrafficDocument = mockAnalyticsData[1];
      item.timestamp = '2026-06-21T16:00:36.488Z';
      const formattedDays = component.getFormattedFirstAccessDays(item);
      expect(formattedDays).toBe('= 13 days ago'); // 2026-06-21 - 2026-06-08 = 13 days
    });

    it('should return the correct formatted first access days (1 month ago)', () => {
      component.lang = 'en';
      const item: GithubAnalyticsTrafficDocument = mockAnalyticsData[1];
      item.timestamp = '2026-07-19T16:00:36.488Z'; // 1 month ago from 2026-06-19
      const formattedDays = component.getFormattedFirstAccessDays(item);

      expect(formattedDays).toBe('= 1 month ago'); // 2026-06-19 - 2026-05-01 = 1 month
    });

    it('should return the correct formatted first access days (2 months ago)', () => {
      component.lang = 'en';
      const item: GithubAnalyticsTrafficDocument = mockAnalyticsData[1];
      item.timestamp = '2026-08-19T16:00:36.488Z'; // 2 months ago from 2026-06-19
      const formattedDays = component.getFormattedFirstAccessDays(item);

      expect(formattedDays).toBe('= 2 months ago'); // 2026-08-19 - 2026-06-19 = 2 months
    });

    it('should return the correct formatted first access days (vor 1 Tag)', () => {
      component.lang = 'de';
      const item: GithubAnalyticsTrafficDocument = mockAnalyticsData[0];
      const formattedDays = component.getFormattedFirstAccessDays(item);
      expect(formattedDays).toBe('= vor 1 Tag'); // 2026-06-19 - 2026-06-18 = 1 day
    });

    it('should return the correct formatted first access days (vor 13 Tagen)', () => {
      component.lang = 'de';
      const item: GithubAnalyticsTrafficDocument = mockAnalyticsData[1];
      item.timestamp = '2026-06-21T16:00:36.488Z';
      const formattedDays = component.getFormattedFirstAccessDays(item);
      expect(formattedDays).toBe('= vor 13 Tagen'); // 2026-06-21 - 2026-06-08 = 13 days
    });

    it('should return the correct formatted first access days (vor 1 Monat)', () => {
      component.lang = 'de';
      const item: GithubAnalyticsTrafficDocument = mockAnalyticsData[1];
      item.timestamp = '2026-07-19T16:00:36.488Z'; // 1 month ago from 2026-06-19
      const formattedDays = component.getFormattedFirstAccessDays(item);

      expect(formattedDays).toBe('= vor 1 Monat'); // 2026-06-19 - 2026-05-01 = 1 month
    });

    it('should return the correct formatted first access days (vor 2 Monaten)', () => {
      component.lang = 'de';
      const item: GithubAnalyticsTrafficDocument = mockAnalyticsData[1];
      item.timestamp = '2026-08-19T16:00:36.488Z'; // 2 months ago from 2026-06-19
      const formattedDays = component.getFormattedFirstAccessDays(item);

      expect(formattedDays).toBe('= vor 2 Monaten'); // 2026-08-19 - 2026-06-19 = 2 months
    });

    it('should return empty string if there are no views or clones', () => {
      const item: GithubAnalyticsTrafficDocument = makeDoc(
        REPOS[0].repo,
        [],
        [],
      );
      const formattedDays = component.getFormattedFirstAccessDays(item);
      expect(formattedDays).toBe('');
    });
  });

  describe('getFormattedLastAccessDays', () => {
    it('should return the correct formatted last access days (1 day ago)', () => {
      component.lang = 'en';
      const item: GithubAnalyticsTrafficDocument = mockAnalyticsData[1];
      item.timestamp = '2026-06-20T16:00:36.488Z';
      const formattedDays = component.getFormattedLastAccessDays(item);

      expect(formattedDays).toBe('1 day ago'); // 2026-06-20 - 2026-06-19 = 1 day
    });

    it('should return the correct formatted last access days (2 days ago)', () => {
      component.lang = 'en';
      const item: GithubAnalyticsTrafficDocument = mockAnalyticsData[1];
      item.timestamp = '2026-06-21T16:00:36.488Z';
      const formattedDays = component.getFormattedLastAccessDays(item);

      expect(formattedDays).toBe('2 days ago'); // 2026-06-21 - 2026-06-19 = 2 days
    });

    it('should return the correct formatted last access days (vor 1 Tag)', () => {
      component.lang = 'de';
      const item: GithubAnalyticsTrafficDocument = mockAnalyticsData[1];
      item.timestamp = '2026-06-20T16:00:36.488Z';
      const formattedDays = component.getFormattedLastAccessDays(item);

      expect(formattedDays).toBe('vor 1 Tag'); // 2026-06-20 - 2026-06-19 = 1 day
    });

    it('should return the correct formatted last access days (vor 2 Tagen)', () => {
      component.lang = 'de';
      const item: GithubAnalyticsTrafficDocument = mockAnalyticsData[1];
      item.timestamp = '2026-06-21T16:00:36.488Z';
      const formattedDays = component.getFormattedLastAccessDays(item);

      expect(formattedDays).toBe('vor 2 Tagen'); // 2026-06-21 - 2026-06-19 = 2 days
    });

    it('should return empty string if there are no views or clones', () => {
      const item: GithubAnalyticsTrafficDocument = makeDoc(
        REPOS[0].repo,
        [],
        [],
      );
      const formattedDays = component.getFormattedLastAccessDays(item);
      expect(formattedDays).toBe('');
    });
  });
});
