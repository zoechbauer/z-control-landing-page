import { TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular/standalone';

import { UtilsService } from './utils.service';
import { FirebaseAnalyticsService } from './firebase-analytics.service';
import { APPS } from 'src/app/shared/GitHubConstants';
import { GithubAnalyticsComponent } from '../ui/components/github-analytics/github-analytics.component';
import { MarkdownViewerComponent } from '../ui/components/markdown-viewer/markdown-viewer.component';

describe('UtilsService', () => {
  let service: UtilsService;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let firebaseAnalyticsServiceSpy: jasmine.SpyObj<FirebaseAnalyticsService>;

  const setViewport = (width: number, height: number, portrait: boolean) => {
    spyOnProperty(window, 'innerWidth', 'get').and.returnValue(width);
    spyOnProperty(window, 'innerHeight', 'get').and.returnValue(height);
    spyOn(globalThis, 'matchMedia').and.returnValue({
      matches: portrait,
      media: '(orientation: portrait)',
      onchange: null,
      addEventListener: jasmine.createSpy('addEventListener'),
      removeEventListener: jasmine.createSpy('removeEventListener'),
      addListener: jasmine.createSpy('addListener'),
      removeListener: jasmine.createSpy('removeListener'),
      dispatchEvent: jasmine.createSpy('dispatchEvent').and.returnValue(true),
    } as any);
  };

  beforeEach(() => {
    modalControllerSpy = jasmine.createSpyObj('ModalController', ['create']);
    firebaseAnalyticsServiceSpy = jasmine.createSpyObj('FirebaseAnalyticsService', ['logEvent']);

    TestBed.configureTestingModule({
      providers: [
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: FirebaseAnalyticsService, useValue: firebaseAnalyticsServiceSpy },
      ],
    });

    service = TestBed.inject(UtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit logo clicked', (done) => {
    service.logoClicked$.subscribe((value) => {
      expect(value).toBeTrue();
      done();
    });

    service.onLogoClicked();
  });

  describe('device detection', () => {
    it('should return true for isPortrait when matchMedia matches', () => {
      setViewport(1024, 800, true);
      expect(service.isPortrait).toBeTrue();
    });

    it('should return false for isPortrait when matchMedia does not match', () => {
      setViewport(1024, 800, false);
      expect(service.isPortrait).toBeFalse();
    });

    it('should return true for isSmallScreen on small width in portrait', () => {
      setViewport(768, 900, true);
      expect(service.isSmallScreen).toBeTrue();
    });

    it('should return false for isSmallScreen on small width in landscape', () => {
      setViewport(768, 900, false);
      expect(service.isSmallScreen).toBeFalse();
    });

    it('should return true for isSmallDevice on small width and height', () => {
      setViewport(768, 640, false);
      expect(service.isSmallDevice).toBeTrue();
    });

    it('should return false for isSmallDevice when size is large', () => {
      setViewport(1024, 900, true);
      expect(service.isSmallDevice).toBeFalse();
    });
  });

  describe('openGitHubAnalytics', () => {
    it('should log analytics and open the GitHub Analytics modal', async () => {
      const presentSpy = jasmine.createSpy('present').and.returnValue(Promise.resolve());
      modalControllerSpy.create.and.returnValue(Promise.resolve({ present: presentSpy } as any));

      await service.openGitHubAnalytics(APPS.BACKEND_FUNCTIONS as keyof typeof APPS);

      expect(firebaseAnalyticsServiceSpy.logEvent).toHaveBeenCalledWith(
        'view_github_analytics',
        {
          called_from: APPS.BACKEND_FUNCTIONS,
          app: APPS.LANDING_PAGE,
        },
      );
      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: GithubAnalyticsComponent,
        cssClass: 'github-analytics-modal',
      });
      expect(presentSpy).toHaveBeenCalled();
    });
  });

  describe('openChangelog', () => {
    it('should log analytics and open changelog for landing page', async () => {
      const presentSpy = jasmine.createSpy('present').and.returnValue(Promise.resolve());
      modalControllerSpy.create.and.returnValue(Promise.resolve({ present: presentSpy } as any));

      await service.openChangelog(APPS.LANDING_PAGE as keyof typeof APPS);

      expect(firebaseAnalyticsServiceSpy.logEvent).toHaveBeenCalledWith(
        'open_changelog',
        {
          changelog_for: APPS.LANDING_PAGE,
          app: APPS.LANDING_PAGE,
        },
      );
      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: MarkdownViewerComponent,
        componentProps: {
          fullChangeLogPath: 'assets/logs/change-logs/CHANGELOG_LANDING-PAGE.md',
          title: `Changelog for ${APPS.LANDING_PAGE}`,
        },
        cssClass: 'change-log-modal',
      });
      expect(presentSpy).toHaveBeenCalled();
    });

    it('should open backend functions changelog with correct path', async () => {
      const presentSpy = jasmine.createSpy('present').and.returnValue(Promise.resolve());
      modalControllerSpy.create.and.returnValue(Promise.resolve({ present: presentSpy } as any));

      await service.openChangelog(APPS.BACKEND_FUNCTIONS as keyof typeof APPS);

      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: MarkdownViewerComponent,
        componentProps: {
          fullChangeLogPath: 'assets/logs/change-logs/CHANGELOG_BACKEND-FUNCTIONS.md',
          title: `Changelog for ${APPS.BACKEND_FUNCTIONS}`,
        },
        cssClass: 'change-log-modal',
      });
      expect(firebaseAnalyticsServiceSpy.logEvent).toHaveBeenCalledWith(
        'open_changelog',
        {
          changelog_for: APPS.BACKEND_FUNCTIONS,
          app: APPS.LANDING_PAGE,
        },
      );
      expect(presentSpy).toHaveBeenCalled();
    });

    it('should open ionic setup changelog with correct path', async () => {
      const presentSpy = jasmine.createSpy('present').and.returnValue(Promise.resolve());
      modalControllerSpy.create.and.returnValue(Promise.resolve({ present: presentSpy } as any));

      await service.openChangelog(APPS.IONIC_SETUP as keyof typeof APPS);

      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: MarkdownViewerComponent,
        componentProps: {
          fullChangeLogPath: 'assets/logs/change-logs/CHANGELOG_IONIC-SETUP.md',
          title: `Changelog for ${APPS.IONIC_SETUP}`,
        },
        cssClass: 'change-log-modal',
      });
      expect(presentSpy).toHaveBeenCalled();
    });

    it('should open qr code generator changelog with correct path', async () => {
      const presentSpy = jasmine.createSpy('present').and.returnValue(Promise.resolve());
      modalControllerSpy.create.and.returnValue(Promise.resolve({ present: presentSpy } as any));

      await service.openChangelog(APPS.QR_CODE_GENERATOR as keyof typeof APPS);

      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: MarkdownViewerComponent,
        componentProps: {
          fullChangeLogPath: 'assets/logs/change-logs/CHANGELOG_QR-CODE.md',
          title: `Changelog for ${APPS.QR_CODE_GENERATOR}`,
        },
        cssClass: 'change-log-modal',
      });
      expect(presentSpy).toHaveBeenCalled();
    });

    it('should open multi-language translator changelog with correct path', async () => {
      const presentSpy = jasmine.createSpy('present').and.returnValue(Promise.resolve());
      modalControllerSpy.create.and.returnValue(Promise.resolve({ present: presentSpy } as any));

      await service.openChangelog(APPS.MULTI_LANGUAGE_TRANSLATOR as keyof typeof APPS);

      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: MarkdownViewerComponent,
        componentProps: {
          fullChangeLogPath: 'assets/logs/change-logs/CHANGELOG_MULTI-LANGUAGE-TRANSLATOR.md',
          title: `Changelog for ${APPS.MULTI_LANGUAGE_TRANSLATOR}`,
        },
        cssClass: 'change-log-modal',
      });
      expect(presentSpy).toHaveBeenCalled();
    });

    it('should return empty path for unknown accordion and still open modal', async () => {
      const presentSpy = jasmine.createSpy('present').and.returnValue(Promise.resolve());
      modalControllerSpy.create.and.returnValue(Promise.resolve({ present: presentSpy } as any));

      await service.openChangelog('UNKNOWN' as keyof typeof APPS);

      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: MarkdownViewerComponent,
        componentProps: {
          fullChangeLogPath: '',
          title: 'Changelog for UNKNOWN',
        },
        cssClass: 'change-log-modal',
      });
      expect(presentSpy).toHaveBeenCalled();
    });
  });
});