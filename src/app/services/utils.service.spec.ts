import { TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';

import { UtilsService } from './utils.service';
import { FirebaseAnalyticsService } from './firebase-analytics.service';
import { APPS, APP_KEYS, AppKey } from '@app/shared/GitHubConstants';
import { GithubAnalyticsComponent } from '@ui/components/github-analytics/github-analytics.component';
import { MarkdownViewerComponent } from '@ui/components/markdown-viewer/markdown-viewer.component';
import { HelpModalComponent } from '@ui/components/get-help/get-help.component';
import { Tab } from '@app/shared/enums';
import { environment } from '@env/environment';

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
          APP_KEYS.BACKEND_FUNCTIONS as AppKey,
          lang,
        );

        expect(firebaseAnalyticsServiceSpy.logEvent).toHaveBeenCalledWith(
          'view_github_analytics',
          {
            called_from: APP_KEYS.BACKEND_FUNCTIONS,
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
    const testCases = [
      {
        key: 'IMAGE_TO_TEXT',
        fullChangeLogPath: 'assets/logs/change-logs/CHANGELOG_IMAGE-TO-TEXT.md',
        appName: APPS.IMAGE_TO_TEXT,
      },
      {
        key: 'IONIC_SETUP',
        fullChangeLogPath: 'assets/logs/change-logs/CHANGELOG_IONIC-SETUP.md',
        appName: APPS.IONIC_SETUP,
      },
      {
        key: 'LANDING_PAGE',
        fullChangeLogPath: 'assets/logs/change-logs/CHANGELOG_LANDING-PAGE.md',
        appName: APPS.LANDING_PAGE,
      },
      {
        key: 'MULTI_LANGUAGE_TRANSLATOR',
        fullChangeLogPath:
          'assets/logs/change-logs/CHANGELOG_MULTI-LANGUAGE-TRANSLATOR.md',
        appName: APPS.MULTI_LANGUAGE_TRANSLATOR,
      },
      {
        key: 'QR_CODE_GENERATOR',
        fullChangeLogPath: 'assets/logs/change-logs/CHANGELOG_QR-CODE.md',
        appName: APPS.QR_CODE_GENERATOR,
      },
      {
        key: 'BACKEND_FUNCTIONS',
        fullChangeLogPath:
          'assets/logs/change-logs/CHANGELOG_BACKEND-FUNCTIONS.md',
        appName: APPS.BACKEND_FUNCTIONS,
      },
    ];

    it('should open changelog and log analytics for each test case', async () => {
      for (const testCase of testCases) {
        modalControllerSpy.create.calls.reset();
        firebaseAnalyticsServiceSpy.logEvent.calls.reset();

        const presentSpy = jasmine
          .createSpy('present')
          .and.returnValue(Promise.resolve());
        modalControllerSpy.create.and.returnValue(
          Promise.resolve({ present: presentSpy } as any),
        );

        await service.openChangelog(testCase.key as AppKey);

        const createArg = modalControllerSpy.create.calls.mostRecent().args[0];
        expect(createArg.component).toBe(MarkdownViewerComponent);
        expect(createArg.cssClass).toBe('change-log-modal');
        expect(createArg.componentProps).toEqual({
          fullChangeLogPath: testCase.fullChangeLogPath,
          title1line: `Changelog for ${testCase.appName}`,
          title2lines: `Changelog for<br />${testCase.appName}`,
        });
        expect(presentSpy).toHaveBeenCalled();

        expect(firebaseAnalyticsServiceSpy.logEvent).toHaveBeenCalledWith(
          'open_changelog',
          {
            changelog_for: testCase.key,
            app: APPS.LANDING_PAGE,
          },
        );
      }
    });

    it('should return empty path for unknown accordion and still open modal', async () => {
      const presentSpy = jasmine
        .createSpy('present')
        .and.returnValue(Promise.resolve());
      modalControllerSpy.create.and.returnValue(
        Promise.resolve({ present: presentSpy } as any),
      );

      await service.openChangelog('UNKNOWN' as AppKey);

      const createArg = modalControllerSpy.create.calls.mostRecent().args[0];
      expect(createArg.component).toBe(MarkdownViewerComponent);
      expect(createArg.cssClass).toBe('change-log-modal');
      expect(createArg.componentProps).toEqual({
        fullChangeLogPath: '',
        title1line: 'Changelog for undefined',
        title2lines: 'Changelog for<br />undefined',
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

  describe('Get path for links', () => {
    it('should return the correct webLinkPath for all APP_KEYS', () => {
      const appKeysWebLinkPathArray = [
        {
          key: 'IMAGE_TO_TEXT',
          path: 'https://z-control-image-to-text.web.app',
        },
        { key: 'IONIC_SETUP', path: 'https://z-control-ionic-setup.web.app' },
        {
          key: 'MULTI_LANGUAGE_TRANSLATOR',
          path: 'https://z-control-translator.web.app',
        },
        { key: 'QR_CODE_GENERATOR', path: 'https://z-control-qr-code.web.app' },
        { key: 'LANDING_PAGE', path: 'https://z-control-4070.web.app' },
        { key: 'BACKEND_FUNCTIONS', path: '' },
        { key: 'BACKUP_SCRIPTS', path: '' },
        { key: 'IONIC_ANGULAR21_VITEST_SETUP', path: '' },
      ];
      appKeysWebLinkPathArray.forEach(({ key, path }) => {
        const result = service.getWebLinkPathForAccordion(key as AppKey);
        expect(result).toBe(path);
      });
      expect(appKeysWebLinkPathArray).toHaveSize(Object.keys(APP_KEYS).length);
    });

    it('should return the correct sourceLinkPath for all APP_KEYS', () => {
      const appKeysSourceLinkPathArray = [
        {
          key: 'IMAGE_TO_TEXT',
          path: 'https://github.com/zoechbauer/z-control-image-to-text',
        },
        {
          key: 'IONIC_SETUP',
          path: 'https://github.com/zoechbauer/z-control-ionic-setup',
        },
        {
          key: 'MULTI_LANGUAGE_TRANSLATOR',
          path: 'https://github.com/zoechbauer/z-control-multi-language-translator',
        },
        {
          key: 'QR_CODE_GENERATOR',
          path: 'https://github.com/zoechbauer/z-control-qr-code-generator',
        },
        {
          key: 'LANDING_PAGE',
          path: 'https://github.com/zoechbauer/z-control-landing-page',
        },
        {
          key: 'BACKEND_FUNCTIONS',
          path: 'https://github.com/zoechbauer/z-control-backend-functions',
        },
        {
          key: 'BACKUP_SCRIPTS',
          path: 'https://github.com/zoechbauer/z-control-Backup-Scripts',
        },
        {
          key: 'IONIC_ANGULAR21_VITEST_SETUP',
          path: 'https://github.com/zoechbauer/ionic-angular21-vitest-setup',
        },
      ];
      appKeysSourceLinkPathArray.forEach(({ key, path }) => {
        const result = service.getSourceLinkPathForAccordion(key as AppKey);
        expect(result).toBe(path);
      });
      expect(appKeysSourceLinkPathArray).toHaveSize(
        Object.keys(APP_KEYS).length,
      );
    });

    it('should return the correct playStoreLinkPath for all APP_KEYS', () => {
      const appKeysPlayStoreLinkPathArray = [
        {
          key: 'IMAGE_TO_TEXT',
          path: 'https://play.google.com/store/apps/details?id=at.zcontrol.zoe.image-to-text',
        },
        {
          key: 'IONIC_SETUP',
          path: 'https://play.google.com/store/apps/details?id=at.zcontrol.zoe.ionic-setup',
        },
        {
          key: 'MULTI_LANGUAGE_TRANSLATOR',
          path: 'https://play.google.com/store/apps/details?id=at.zcontrol.zoe.translator',
        },
        {
          key: 'QR_CODE_GENERATOR',
          path: 'https://play.google.com/store/apps/details?id=at.zcontrol.zoe.qrcodeapp',
        },
        { key: 'LANDING_PAGE', path: '' },
        { key: 'BACKEND_FUNCTIONS', path: '' },
        { key: 'BACKUP_SCRIPTS', path: '' },
        { key: 'IONIC_ANGULAR21_VITEST_SETUP', path: '' },
      ];
      appKeysPlayStoreLinkPathArray.forEach(({ key, path }) => {
        const result = service.getPlayStoreLinkPathForAccordion(key as AppKey);
        expect(result).toBe(path);
      });
      expect(appKeysPlayStoreLinkPathArray).toHaveSize(
        Object.keys(APP_KEYS).length,
      );
    });

    it('should return the correct changelogPath for all APP_KEYS', () => {
      const appKeysChangelogPathArray = [
        {
          key: 'IMAGE_TO_TEXT',
          path: 'assets/logs/change-logs/CHANGELOG_IMAGE-TO-TEXT.md',
        },
        {
          key: 'IONIC_SETUP',
          path: 'assets/logs/change-logs/CHANGELOG_IONIC-SETUP.md',
        },
        {
          key: 'MULTI_LANGUAGE_TRANSLATOR',
          path: 'assets/logs/change-logs/CHANGELOG_MULTI-LANGUAGE-TRANSLATOR.md',
        },
        {
          key: 'QR_CODE_GENERATOR',
          path: 'assets/logs/change-logs/CHANGELOG_QR-CODE.md',
        },
        {
          key: 'LANDING_PAGE',
          path: 'assets/logs/change-logs/CHANGELOG_LANDING-PAGE.md',
        },
        {
          key: 'BACKEND_FUNCTIONS',
          path: 'assets/logs/change-logs/CHANGELOG_BACKEND-FUNCTIONS.md',
        },
        { key: 'BACKUP_SCRIPTS', path: '' },
        { key: 'IONIC_ANGULAR21_VITEST_SETUP', path: '' },
      ];
      appKeysChangelogPathArray.forEach(({ key, path }) => {
        const result = (service as any).getChangelogPathForAccordion(
          key as AppKey,
        );
        expect(result).toBe(path);
      });
      expect(appKeysChangelogPathArray).toHaveSize(
        Object.keys(APP_KEYS).length,
      );
    });
  });

  it('should show the correct display name for all APP_KEYS', () => {
    const appKeysDisplayNameArray = [
      { key: 'IMAGE_TO_TEXT', displayName: 'z\u2011control Image to Text App' },
      { key: 'IONIC_SETUP', displayName: 'z\u2011control Ionic Setup App' },
      {
        key: 'MULTI_LANGUAGE_TRANSLATOR',
        displayName: 'z\u2011control Translator App',
      },
      {
        key: 'QR_CODE_GENERATOR',
        displayName: 'z\u2011control QR Code Generator App',
      },
      { key: 'LANDING_PAGE', displayName: 'z\u2011control Landing Page App' },
      {
        key: 'BACKEND_FUNCTIONS',
        displayName: 'z\u2011control Backend Functions',
      },
      { key: 'BACKUP_SCRIPTS', displayName: 'z\u2011control Backup Scripts' },
      {
        key: 'IONIC_ANGULAR21_VITEST_SETUP',
        displayName: 'Ionic Angular21 Vitest Setup',
      },
    ];
    appKeysDisplayNameArray.forEach(({ key, displayName }) => {
      const result = service.getDisplayNameForAccordion(key as AppKey);
      expect(result).toBe(displayName);
    });
    expect(appKeysDisplayNameArray).toHaveSize(Object.keys(APP_KEYS).length);
  });

  describe('getAccordionTooltip', () => {
    it('should return expand message when tooltip of main accordion differs from selected main accordion', () => {
      const accordionName = APPS.LANDING_PAGE;
      const selectedMainAccordion = APPS.QR_CODE_GENERATOR;
      const tooltipMainAccordion = APPS.LANDING_PAGE;

      let lang = 'en';
      let result = service.getAccordionTooltip(
        lang,
        accordionName,
        selectedMainAccordion,
        tooltipMainAccordion,
      );
      expect(result).toBe(`Expand ${accordionName} section`);

      lang = 'de';
      result = service.getAccordionTooltip(
        lang,
        accordionName,
        selectedMainAccordion,
        tooltipMainAccordion,
      );
      expect(result).toBe(`Abschnitt ${accordionName} öffnen`);
    });

    it('should return collapse message when tooltip of main accordion is equal to selected main accordion', () => {
      const accordionName = APPS.LANDING_PAGE;
      const selectedMainAccordion = APPS.LANDING_PAGE;
      const tooltipMainAccordion = APPS.LANDING_PAGE;

      let lang = 'en';
      let result = service.getAccordionTooltip(
        lang,
        accordionName,
        selectedMainAccordion,
        tooltipMainAccordion,
      );
      expect(result).toBe(`Collapse ${accordionName} section`);

      lang = 'de';
      result = service.getAccordionTooltip(
        lang,
        accordionName,
        selectedMainAccordion,
        tooltipMainAccordion,
      );
      expect(result).toBe(`Abschnitt ${accordionName} schließen`);
    });
  });

  describe('getSubAccordionTooltip', () => {
    it('should return expand message when tooltip of sub accordion differs from selected sub accordion', () => {
      const selectedSubAccordion = APPS.QR_CODE_GENERATOR;
      const tooltipSubAccordion = APPS.LANDING_PAGE;

      let lang = 'en';
      let result = service.getSubAccordionTooltip(
        lang,
        selectedSubAccordion,
        tooltipSubAccordion,
      );
      expect(result).toBe('Expand this part-section');

      lang = 'de';
      result = service.getSubAccordionTooltip(
        lang,
        selectedSubAccordion,
        tooltipSubAccordion,
      );
      expect(result).toBe('Diesen Teil-Abschnitt öffnen');
    });

    it('should return collapse message when tooltip of sub accordion is equal to selected sub accordion', () => {
      const selectedSubAccordion = APPS.QR_CODE_GENERATOR;
      const tooltipSubAccordion = APPS.QR_CODE_GENERATOR;

      let lang = 'en';
      let result = service.getSubAccordionTooltip(
        lang,
        selectedSubAccordion,
        tooltipSubAccordion,
      );
      expect(result).toBe('Collapse this part-section');

      lang = 'de';
      result = service.getSubAccordionTooltip(
        lang,
        selectedSubAccordion,
        tooltipSubAccordion,
      );
      expect(result).toBe('Diesen Teil-Abschnitt schließen');
    });
  });

  it('should open web app for a selected accordion and log firebase analytics event', () => {
    const accordionName = APP_KEYS.QR_CODE_GENERATOR;
    const expected_qr_code_url = 'https://z-control-qr-code.web.app';
    spyOn(window, 'open');

    service.onOpenWebApp(accordionName);

    expect(window.open).toHaveBeenCalledWith(expected_qr_code_url, '_blank');

    expect(firebaseAnalyticsServiceSpy.logEvent).toHaveBeenCalledWith(
      'open_web_app',
      {
        url: expected_qr_code_url,
        app: APPS.LANDING_PAGE,
      },
    );
  });
});
