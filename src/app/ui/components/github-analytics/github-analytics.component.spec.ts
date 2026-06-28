import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular/standalone';

import { GithubAnalyticsComponent } from './github-analytics.component';
import { FirebaseFirestoreService } from 'src/app/services/firebase-firestore.service';
import { FirebaseAnalyticsService } from 'src/app/services/firebase-analytics.service';
import {
  COLLECTION,
  GithubAnalyticsTrafficDocument,
  REPO,
  REPOS,
} from 'src/app/shared/GitHubConstants';
import { UtilsService } from 'src/app/services/utils.service';

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
    [{ uniques: 10, count: 20, timestamp: '2026-06-18T16:00:36.488Z' }],
  ),
];

describe('GithubAnalyticsComponent', () => {
  let component: GithubAnalyticsComponent;
  let fixture: ComponentFixture<GithubAnalyticsComponent>;
  let firestoreService: FirebaseFirestoreService;
  let firebaseAnalyticsService: FirebaseAnalyticsService;
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
      imports: [IonicModule.forRoot(), GithubAnalyticsComponent],
      providers: [
        {
          provide: FirebaseFirestoreService,
          useClass: MockFirebaseFirestoreService,
        },
        {
          provide: FirebaseAnalyticsService,
          useClass: MockFirebaseAnalyticsService,
        },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: UtilsService, useValue: utilsServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GithubAnalyticsComponent);
    component = fixture.componentInstance;
    firestoreService = TestBed.inject(FirebaseFirestoreService);
    firebaseAnalyticsService = TestBed.inject(FirebaseAnalyticsService);
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

  it('should call checkOrientation on window resize', () => {
    spyOn(firestoreService, 'getAnalyticsData').and.returnValue(
      Promise.resolve(mockAnalyticsData),
    );
    const checkOrientationSpy = spyOn(component as any, 'checkOrientation');

    window.dispatchEvent(new Event('resize'));
    expect(checkOrientationSpy).toHaveBeenCalled();
  });

  describe('checkOrientation', () => {
    it('should set isMobilePortrait to true when isSmallScreen and isPortrait are true', () => {
      utilsServiceSpy.isSmallScreen = true;
      utilsServiceSpy.isPortrait = true;

      component['checkOrientation']();
      expect(component.isMobilePortrait).toBeTrue();
    });

    it('should set isMobilePortrait to false when isSmallScreen is false', () => {
      utilsServiceSpy.isSmallScreen = false;
      utilsServiceSpy.isPortrait = true;

      component['checkOrientation']();
      expect(component.isMobilePortrait).toBeFalse();
    });

    it('should set isMobilePortrait to false when isPortrait is false', () => {
      utilsServiceSpy.isSmallScreen = true;
      utilsServiceSpy.isPortrait = false;

      component['checkOrientation']();
      expect(component.isMobilePortrait).toBeFalse();
    });
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
        await component.onOpenGithubAnalyticsHelp(repoObj.repo);

        expect(utilsServiceSpy.openMarkdownDoc)
          .withContext('openMarkdownDoc for repo: ' + repoObj.repo)
          .toHaveBeenCalledWith(
            'assets/app-docs/backend-functions-app/github-analytics-help.md',
          );

        expect(firebaseAnalyticsService.logEvent)
          .withContext('logEvent for repo: ' + repoObj.repo)
          .toHaveBeenCalledWith('get_github_analytics_help', {
            repo: repoObj.repo,
            app: REPO.Z_CONTROL_LANDING_PAGE,
          });
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

    it('should call checkOrientation', async () => {
      spyOn(firestoreService, 'getAnalyticsData').and.returnValue(
        Promise.resolve(mockAnalyticsData),
      );
      const checkOrientationSpy = spyOn(
        component as any,
        'checkOrientation',
      ).and.callThrough();

      await (component as any).init();
      expect(checkOrientationSpy).toHaveBeenCalled();
    });

    it('should add addEventListener for resize event', async () => {
      spyOn(firestoreService, 'getAnalyticsData').and.returnValue(
        Promise.resolve(mockAnalyticsData),
      );
      const addEventListenerSpy = spyOn(
        globalThis.window,
        'addEventListener',
      ).and.callThrough();

      await (component as any).init();
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'resize',
        jasmine.any(Function),
      );
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
});
