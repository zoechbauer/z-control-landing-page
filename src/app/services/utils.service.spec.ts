import { TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

import { UtilsService } from './utils.service';
import { FirebaseAnalyticsService } from './firebase-analytics.service';
import { APPS } from '@app/shared/GitHubConstants';
import { GithubAnalyticsComponent } from '../ui/components/github-analytics/github-analytics.component';
import { MarkdownViewerComponent } from '../ui/components/markdown-viewer/markdown-viewer.component';
import { Tab } from '../shared/enums';
import { environment } from 'src/environments/environment';
import { HelpModalComponent } from '../ui/components/get-help/get-help.component';
import { Capacitor } from '@capacitor/core';

describe('UtilsService', () => {
  let service: UtilsService;
  let environmentBackup: typeof environment;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let firebaseAnalyticsServiceSpy: jasmine.SpyObj<FirebaseAnalyticsService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let setViewport: (width: number, height: number, portrait: boolean) => void;

  beforeEach(() => {
    environmentBackup = { ...environment };

    setViewport = (width: number, height: number, portrait: boolean) => {
      Object.defineProperty(window, 'innerWidth', {
        configurable: true,
        value: width,
      });

      Object.defineProperty(window, 'innerHeight', {
        configurable: true,
        value: height,
      });

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

    modalControllerSpy = jasmine.createSpyObj('ModalController', ['create']);
    
    firebaseAnalyticsServiceSpy = jasmine.createSpyObj(
      'FirebaseAnalyticsService',
      ['logEvent'],
    );
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: ModalController, useValue: modalControllerSpy },
        {
          provide: FirebaseAnalyticsService,
          useValue: firebaseAnalyticsServiceSpy,
        },
        { provide: Router, useValue: routerSpy },
      ],
    });

    service = TestBed.inject(UtilsService);
  });

  afterEach(() => {
    Object.assign(environment, environmentBackup);
    document.querySelectorAll('ion-tab-bar').forEach((el) => el.remove());
  });

  const createModalMock = (component: unknown): HTMLIonModalElement => {
    const modal = document.createElement(
      'div',
    ) as unknown as HTMLIonModalElement;
    Object.defineProperty(modal, 'component', {
      value: component,
      configurable: true,
      writable: true,
    });
    (modal as any).present = jasmine
      .createSpy('present')
      .and.resolveTo(undefined);
    return modal;
  };

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

  describe('Navigation methods', () => {
    it('should navigate to tab', () => {
      service.navigateToTab(Tab.MainFeature);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/tabs/main']);
    });

    it('should navigate to tab with query params', () => {
      service.navigateToTabWithParams(Tab.Settings, { section: 'faq' });
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/tabs/settings'], {
        queryParams: { section: 'faq' },
      });
    });
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

    it('should return true for isNative when native platform is true', () => {
      spyOn(Capacitor, 'isNativePlatform').and.returnValue(true);
      expect(service.isNativeApp).toBeTrue();
    });
  });

  describe('openGitHubAnalytics', () => {
    const languages = ['en', 'de'];

    languages.forEach((lang) => {
      it(`should log analytics and open the GitHub Analytics modal in ${lang.toUpperCase()}`, async () => {
        const presentSpy = jasmine
          .createSpy('present')
          .and.returnValue(Promise.resolve());
        modalControllerSpy.create.and.returnValue(
          Promise.resolve({ present: presentSpy } as any),
        );

        await service.openGitHubAnalytics(
          APPS.BACKEND_FUNCTIONS as keyof typeof APPS,
          lang,
        );

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
          componentProps: {
            lang: lang,
          },
        });
        expect(presentSpy).toHaveBeenCalled();
      });
    });
  });

  describe('openHelpModal', () => {
    it('should open help modal and present it', async () => {
      const modal = createModalMock(HelpModalComponent);
      modalControllerSpy.create.and.resolveTo(modal);
      await service.openHelpModal();
      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: HelpModalComponent,
        cssClass: 'manual-instructions-modal',
      });
      expect((modal as any).present).toHaveBeenCalled();
    });
  });

  describe('openChangelog', () => {
    it('should log analytics and open changelog for landing page', async () => {
      const presentSpy = jasmine
        .createSpy('present')
        .and.returnValue(Promise.resolve());
      modalControllerSpy.create.and.returnValue(
        Promise.resolve({ present: presentSpy } as any),
      );

      await service.openChangelog(APPS.LANDING_PAGE as keyof typeof APPS);

      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: MarkdownViewerComponent,
        componentProps: {
          fullChangeLogPath:
            'assets/logs/change-logs/CHANGELOG_LANDING-PAGE.md',
          title: `Changelog for ${APPS.LANDING_PAGE}`,
        },
        cssClass: 'change-log-modal',
      });
      expect(presentSpy).toHaveBeenCalled();
      expect(firebaseAnalyticsServiceSpy.logEvent).toHaveBeenCalledWith(
        'open_changelog',
        {
          changelog_for: APPS.LANDING_PAGE,
          app: APPS.LANDING_PAGE,
        },
      );
    });

    it('should open image to text changelog with correct path', async () => {
      const presentSpy = jasmine
        .createSpy('present')
        .and.returnValue(Promise.resolve());
      modalControllerSpy.create.and.returnValue(
        Promise.resolve({ present: presentSpy } as any),
      );

      await service.openChangelog(APPS.IMAGE_TO_TEXT as keyof typeof APPS);

      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: MarkdownViewerComponent,
        componentProps: {
          fullChangeLogPath:
            'assets/logs/change-logs/CHANGELOG_IMAGE-TO-TEXT.md',
          title: `Changelog for ${APPS.IMAGE_TO_TEXT}`,
        },
        cssClass: 'change-log-modal',
      });
      expect(presentSpy).toHaveBeenCalled();
      expect(firebaseAnalyticsServiceSpy.logEvent).toHaveBeenCalledWith(
        'open_changelog',
        {
          changelog_for: APPS.IMAGE_TO_TEXT,
          app: APPS.LANDING_PAGE,
        },
      );
      expect(presentSpy).toHaveBeenCalled();
    });

    it('should open backend functions changelog with correct path', async () => {
      const presentSpy = jasmine
        .createSpy('present')
        .and.returnValue(Promise.resolve());
      modalControllerSpy.create.and.returnValue(
        Promise.resolve({ present: presentSpy } as any),
      );

      await service.openChangelog(APPS.BACKEND_FUNCTIONS as keyof typeof APPS);

      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: MarkdownViewerComponent,
        componentProps: {
          fullChangeLogPath:
            'assets/logs/change-logs/CHANGELOG_BACKEND-FUNCTIONS.md',
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
      const presentSpy = jasmine
        .createSpy('present')
        .and.returnValue(Promise.resolve());
      modalControllerSpy.create.and.returnValue(
        Promise.resolve({ present: presentSpy } as any),
      );

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
      expect(firebaseAnalyticsServiceSpy.logEvent).toHaveBeenCalledWith(
        'open_changelog',
        {
          changelog_for: APPS.IONIC_SETUP,
          app: APPS.LANDING_PAGE,
        },
      );
      expect(presentSpy).toHaveBeenCalled();
    });

    it('should open qr code generator changelog with correct path', async () => {
      const presentSpy = jasmine
        .createSpy('present')
        .and.returnValue(Promise.resolve());
      modalControllerSpy.create.and.returnValue(
        Promise.resolve({ present: presentSpy } as any),
      );

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
      expect(firebaseAnalyticsServiceSpy.logEvent).toHaveBeenCalledWith(
        'open_changelog',
        {
          changelog_for: APPS.QR_CODE_GENERATOR,
          app: APPS.LANDING_PAGE,
        },
      );
      expect(presentSpy).toHaveBeenCalled();
    });

    it('should open multi-language translator changelog with correct path', async () => {
      const presentSpy = jasmine
        .createSpy('present')
        .and.returnValue(Promise.resolve());
      modalControllerSpy.create.and.returnValue(
        Promise.resolve({ present: presentSpy } as any),
      );

      await service.openChangelog(
        APPS.MULTI_LANGUAGE_TRANSLATOR as keyof typeof APPS,
      );

      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: MarkdownViewerComponent,
        componentProps: {
          fullChangeLogPath:
            'assets/logs/change-logs/CHANGELOG_MULTI-LANGUAGE-TRANSLATOR.md',
          title: `Changelog for ${APPS.MULTI_LANGUAGE_TRANSLATOR}`,
        },
        cssClass: 'change-log-modal',
      });
      expect(presentSpy).toHaveBeenCalled();
      expect(firebaseAnalyticsServiceSpy.logEvent).toHaveBeenCalledWith(
        'open_changelog',
        {
          changelog_for: APPS.MULTI_LANGUAGE_TRANSLATOR,
          app: APPS.LANDING_PAGE,
        },
      );
      expect(presentSpy).toHaveBeenCalled();
    });

    it('should return empty path for unknown accordion and still open modal', async () => {
      const presentSpy = jasmine
        .createSpy('present')
        .and.returnValue(Promise.resolve());
      modalControllerSpy.create.and.returnValue(
        Promise.resolve({ present: presentSpy } as any),
      );

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

  describe('openMarkdownDoc', () => {
    it('should log analytics and open the markdown document in a modal', async () => {
      const docPath = 'assets/app-docs/test-doc.md';
      const docFile = 'test-doc.md';

      const presentSpy = jasmine
        .createSpy('present')
        .and.returnValue(Promise.resolve());
      modalControllerSpy.create.and.returnValue(
        Promise.resolve({ present: presentSpy } as any),
      );

      await service.openMarkdownDoc(docPath);

      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: MarkdownViewerComponent,
        componentProps: {
          fullChangeLogPath: docPath,
          title: `GitHub Documentation:<br>${docFile}`,
        },
        cssClass: 'documentation-modal',
      });
      expect(firebaseAnalyticsServiceSpy.logEvent).toHaveBeenCalledWith(
        'open_markdown_document',
        {
          document: docFile,
          app: APPS.LANDING_PAGE,
        },
      );
      expect(presentSpy).toHaveBeenCalled();
    });
  });

  describe('Scrolling utilities', () => {
    it('should scroll to element and prevent default on scrollTo', () => {
      const scrollIntoView = jasmine.createSpy('scrollIntoView');
      const event = {
        preventDefault: jasmine.createSpy('preventDefault'),
      } as unknown as Event;
      spyOn(document, 'getElementById').and.returnValue({
        scrollIntoView,
      } as unknown as HTMLElement);
      service.scrollTo('target', event);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    });

    it('should warn when target element does not exist in scrollTo', () => {
      const event = {
        preventDefault: jasmine.createSpy('preventDefault'),
      } as unknown as Event;
      spyOn(document, 'getElementById').and.returnValue(null);
      const warnSpy = spyOn(console, 'warn');
      service.scrollTo('missing-id', event);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(warnSpy).toHaveBeenCalledWith(
        "Element with id 'missing-id' not found",
      );
    });

    it('should scroll to element start in scrollToElement', () => {
      const scrollIntoView = jasmine.createSpy('scrollIntoView');
      spyOn(document, 'getElementById').and.returnValue({
        scrollIntoView,
      } as unknown as HTMLElement);
      service.scrollToElement('target');
      expect(scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start',
      });
    });

    it('should calculate offset and call scrollTo in scrollToElementUsingTabBar', () => {
      const scrollTo = jasmine.createSpy('scrollTo');
      spyOnProperty(globalThis, 'pageYOffset', 'get').and.returnValue(200);
      spyOn(document, 'getElementById').and.returnValue({
        getBoundingClientRect: () => ({ top: 100 }),
        scrollTo,
      } as unknown as HTMLElement);
      service.scrollToElementUsingTabBar('target');
      expect(scrollTo).toHaveBeenCalledWith({
        top: 196,
        behavior: 'smooth',
      });
    });
  });

  describe('addLeadingBlanks', () => {
    const cases: Array<{
      name: string;
      value: string | number;
      total: number;
      expected: string;
    }> = [
      {
        name: 'string shorter than total',
        value: '12',
        total: 5,
        expected: '   12',
      },
      {
        name: 'number shorter than total',
        value: 12,
        total: 5,
        expected: '   12',
      },
      {
        name: 'equal length string',
        value: '12345',
        total: 5,
        expected: '12345',
      },
      {
        name: 'longer than total',
        value: '123456',
        total: 5,
        expected: '123456',
      },
      { name: 'empty string', value: '', total: 3, expected: '   ' },
      { name: 'zero number', value: 0, total: 3, expected: '  0' },
    ];

    cases.forEach(({ name, value, total, expected }) => {
      it(`should return "${expected}" for ${name}`, () => {
        const result = service.addLeadingBlanks(value as any, total);
        expect(result).toEqual(expected);
      });
    });
  });

  describe('Tab bar visibility and manipulation', () => {
    it('should return false for isShowIonTabBar when tabs are disabled in environment', () => {
      environment.app.showTabsBar = false;
      expect(service.isShowIonTabBar).toBeFalse();
    });

    it('should return true for isShowIonTabBar when tabs are enabled and small screen', () => {
      environment.app.showTabsBar = true;
      spyOnProperty(service, 'isSmallScreen', 'get').and.returnValue(true);
      expect(service.isShowIonTabBar).toBeTrue();
    });

    it('should show tab bar when enabled', () => {
      const tabBar = document.createElement('ion-tab-bar');
      tabBar.classList.add('hide-ion-tab-bar');
      document.body.appendChild(tabBar);
      spyOnProperty(service, 'isShowIonTabBar', 'get').and.returnValue(true);

      service.showOrHideIonTabBar();
      expect(tabBar.classList.contains('hide-ion-tab-bar')).toBeFalse();
    });

    it('should hide tab bar when disabled', () => {
      const tabBar = document.createElement('ion-tab-bar');
      document.body.appendChild(tabBar);
      spyOnProperty(service, 'isShowIonTabBar', 'get').and.returnValue(false);

      service.showOrHideIonTabBar();
      expect(tabBar.classList.contains('hide-ion-tab-bar')).toBeTrue();
    });
  });
});
