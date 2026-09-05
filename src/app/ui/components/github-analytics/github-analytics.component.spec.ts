import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { createTranslateServiceMock } from '@testing/translate-service.mock';
import { GithubAnalyticsComponent } from '@ui/components/github-analytics/github-analytics.component';
import { FirebaseFirestoreService } from '@app/services/firebase-firestore.service';
import {
  COLLECTION,
  GithubAnalyticsTrafficDocument,
  REPO,
  REPOS,
} from '@app/shared/GitHubConstants';
import { UtilsService } from '@app/services/utils.service';

// Mock FirebaseFirestoreService to avoid real Firebase calls
class MockFirebaseFirestoreService {
  getAnalyticsData(
    collection?: any,
    repo?: any,
    useFirebaseEmulator?: boolean,
  ): Promise<GithubAnalyticsTrafficDocument[]> {
    // Return an empty array to match the expected type
    return Promise.resolve([]);
  }
}

const collection = COLLECTION.GITHUB_ANALYTICS_TRAFFIC_HISTORY;
const repo1 = REPOS[0].repo;
const repo2 = REPOS[1].repo;

const makeDoc = (
  repo: (typeof REPO)[keyof typeof REPO],
  views: Array<{ timestamp: string; count: number; uniques: number }>,
  clones: Array<{ timestamp: string; count: number; uniques: number }>,
  timestamp = '2026-06-20T16:00:36.488Z',
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

describe('GithubAnalyticsComponent', () => {
  let component: GithubAnalyticsComponent;
  let fixture: ComponentFixture<GithubAnalyticsComponent>;
  let firestoreService: FirebaseFirestoreService;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let utilsServiceSpy: jasmine.SpyObj<any>;

  beforeEach(waitForAsync(() => {
    modalControllerSpy = jasmine.createSpyObj('ModalController', ['dismiss']);
    utilsServiceSpy = jasmine.createSpyObj('UtilsService', [
      'isSmallScreen',
      'isPortrait',
      'openMarkdownDoc',
    ]);
    TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(),
        TranslateModule.forRoot(),
        GithubAnalyticsComponent,
      ],
      providers: [
        {
          provide: TranslateService,
          useValue: createTranslateServiceMock(),
        },
        {
          provide: FirebaseFirestoreService,
          useClass: MockFirebaseFirestoreService,
        },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: UtilsService, useValue: utilsServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GithubAnalyticsComponent);
    component = fixture.componentInstance;
    firestoreService = TestBed.inject(FirebaseFirestoreService);
    fixture.detectChanges();
  }));

  it('should create', () => {
    spyOn(firestoreService, 'getAnalyticsData').and.returnValue(
      Promise.resolve([]),
    );
    expect(component).toBeTruthy();
  });

  it('should close modal when closeModal is called', () => {
    component.closeModal();
    expect(modalControllerSpy.dismiss).toHaveBeenCalled();
  });

  it('should toggle isRepoOpened when onAccordionGroupChange is called', () => {
    let event = { detail: { value: 'someValue' } } as CustomEvent;
    component.isRepoOpened = false;
    component.onAccordionGroupChange(event);
    expect(component.isRepoOpened).withContext('open repo').toBeTrue();

    event = { detail: { value: undefined } } as CustomEvent;
    component.isRepoOpened = true;
    component.onAccordionGroupChange(event);
    expect(component.isRepoOpened).withContext('close repo').toBeFalse();
  });

  describe('init', () => {
    it('should call getAnalyticsData and set analyticsData', async () => {
      spyOn(firestoreService, 'getAnalyticsData').and.returnValue(
        Promise.resolve(mockAnalyticsData),
      );
      component.analyticsData = [];
      component.githubTrafficData = [];

      await (component as any).init();
      expect(component.analyticsData).toEqual(mockAnalyticsData);
      expect(component.githubTrafficData).toEqual(mockAnalyticsData);
    });

    it('should set isLoading to false after init', async () => {
      spyOn(firestoreService, 'getAnalyticsData').and.returnValue(
        Promise.resolve(mockAnalyticsData),
      );
      component.isLoading = true;

      await (component as any).init();
      expect(component.isLoading).toBeFalse();
    });
  });

  describe('getMostRecentItem', () => {
    it('should return the most recent item based on timestamp', () => {
      const mostRecentItem = component.getMostRecentItem(mockAnalyticsData[0]);
      expect(mostRecentItem).toEqual(new Date('2026-06-19T16:00:36.488Z'));
    });

    it('should return null for an empty array', () => {
      const emptyItem: GithubAnalyticsTrafficDocument = makeDoc(
        REPOS[0].repo,
        [],
        [],
      );
      const mostRecentItem = component.getMostRecentItem(emptyItem);
      expect(mostRecentItem).toBeNull();
    });
  });

  describe('getLastAccessDays', () => {
    it('should return the correct number of days since the last access', () => {
      const item: GithubAnalyticsTrafficDocument = mockAnalyticsData[0];
      const lastAccessDays = component.getLastAccessDays(item);
      expect(lastAccessDays).toBe(1); // 2026-06-19 - 2026-06-18 = 1 day
    });

    it('should return null if there are no views or clones', () => {
      const emptyItem: GithubAnalyticsTrafficDocument = makeDoc(
        REPOS[0].repo,
        [],
        [],
      );
      const lastAccessDays = component.getLastAccessDays(emptyItem);
      expect(lastAccessDays).toBeNull();
    });
  });

  describe('getAnalyticsData', () => {
    it('should call firestoreService.getAnalyticsData with correct parameters', async () => {
      const getAnalyticsDataSpy = spyOn(
        firestoreService,
        'getAnalyticsData',
      ).and.returnValue(Promise.resolve(mockAnalyticsData));

      await component['getAnalyticsData'](collection);
      expect(getAnalyticsDataSpy).toHaveBeenCalledWith(
        collection,
        'all',
        false,
      );
    });

    it('should set analyticsData and githubTrafficData after fetching data', async () => {
      spyOn(firestoreService, 'getAnalyticsData').and.returnValue(
        Promise.resolve(mockAnalyticsData),
      );

      const result = await component['getAnalyticsData'](collection);
      expect(result).toEqual(mockAnalyticsData);
    });
  });
});
