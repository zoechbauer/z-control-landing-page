import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { FirebaseAnalyticsService } from '../services/firebase-analytics.service';
import { LocalStorageService } from '../services/local-storage.service';
import { of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { MainPage } from './main.page';
import { UtilsService } from '../services/utils.service';
import { APP_KEYS, AppKey } from '@app/shared/GitHubConstants';
import { Tab } from '@app/shared/enums';
import { createTranslateServiceMock } from '@testing/translate-service.mock';
import { createUtilsServiceMock } from '@testing/utils-service.mock';
import { PrivacyService } from '@app/privacy';

describe('MainPage', () => {
  let component: MainPage;
  let fixture: ComponentFixture<MainPage>;
  let firebaseAnalyticsServiceSpy: jasmine.SpyObj<FirebaseAnalyticsService>;
  let localStorageServiceSpy: jasmine.SpyObj<LocalStorageService>;
  let utilsServiceMock: any;
  let privacyServiceSpy: jasmine.SpyObj<PrivacyService>;

  beforeEach(waitForAsync(() => {
    firebaseAnalyticsServiceSpy = jasmine.createSpyObj(
      'FirebaseAnalyticsService',
      ['logEvent', 'enableCollection', 'init'],
    );
    firebaseAnalyticsServiceSpy.enabled$ = of(false);

    localStorageServiceSpy = jasmine.createSpyObj(
      'LocalStorageService',
      [
        'saveSelectedLanguage',
        'loadSelectedOrDefaultLanguage',
        'getAnalyticsConsent',
      ],
      {
        selectedLanguage$: of('de'),
      },
    );

    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: { params: {} },
      params: jasmine.createSpyObj('Observable', ['subscribe']),
    });

    utilsServiceMock = createUtilsServiceMock({
      navigateToTabWithParams: jasmine.createSpy('navigateToTabWithParams'),
      getAccordionTooltip: jasmine.createSpy('getAccordionTooltip'),
      getSubAccordionTooltip: jasmine.createSpy('getSubAccordionTooltip'),
      getWebLinkPathForAccordion: jasmine.createSpy(
        'getWebLinkPathForAccordion',
      ),
      getDisplayNameForAccordion: jasmine.createSpy(
        'getDisplayNameForAccordion',
      ),
    });

    privacyServiceSpy = jasmine.createSpyObj('PrivacyService', [
      'getPrivacyPolicy',
      'getPolicyName',
    ]);

    TestBed.configureTestingModule({
      imports: [MainPage],
      providers: [
        {
          provide: TranslateService,
          useValue: createTranslateServiceMock(),
        },
        {
          provide: FirebaseAnalyticsService,
          useValue: firebaseAnalyticsServiceSpy,
        },
        { provide: LocalStorageService, useValue: localStorageServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: UtilsService, useValue: utilsServiceMock },
        { provide: PrivacyService, useValue: privacyServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  afterEach(() => {
    document.querySelectorAll('ion-tab-bar').forEach((el) => el.remove());
    if (fixture) {
      fixture.destroy();
    }
    TestBed.resetTestingModule();
  });

  describe('Class logic', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    describe('goToSettingsAndOpenFirebaseAnalytics', () => {
      it('should call navigateToTabWithParams and emit logoClickedSub', fakeAsync(() => {
        const nextSpy = spyOn(
          utilsServiceMock.openFirebaseAnalyticsSub,
          'next',
        );
        component.goToSettingsAndOpenFirebaseAnalytics();
        tick(500);

        expect(utilsServiceMock.navigateToTabWithParams).toHaveBeenCalledWith(
          Tab.Settings,
          { open: 'firebase-analytics' },
        );

        expect(nextSpy).toHaveBeenCalledWith(true);
      }));
    });

    describe('accordionGroupChange', () => {
      const makeEvent = (value: string | undefined) =>
        ({ detail: { value } }) as CustomEvent;

      beforeEach(() => {
        spyOn(component, 'setSelectedAccordion').and.callThrough();
        spyOn(
          component as any,
          'handlePotentialMainAccordionClose',
        ).and.callThrough();
      });

      it('should handle main accordion codes', () => {
        const cases = [
          { value: 'QR Code Generation', code: 'QR' },
          { value: 'MLT Translator', code: 'MLT' },
          { value: 'I2T Image to Text', code: 'I2T' },
          { value: 'BF Backend Functions', code: 'BF' },
          { value: 'BS Backup Scripts', code: 'BS' },
          { value: 'IS Ionic Setup', code: 'IS' },
        ];

        cases.forEach(({ value, code }) => {
          (component.setSelectedAccordion as jasmine.Spy).calls.reset();
          (
            (component as any).handlePotentialMainAccordionClose as jasmine.Spy
          ).calls.reset();

          component.accordionGroupChange(makeEvent(value));

          expect(component.currentMainAccordion).withContext(value).toBe(code);
          expect(component.setSelectedAccordion)
            .withContext(value)
            .toHaveBeenCalledWith(code);
          expect((component as any).handlePotentialMainAccordionClose)
            .withContext(value)
            .not.toHaveBeenCalled();
        });
      });

      it('should handle closing the sub accordion', () => {
        component.accordionGroupChange(makeEvent(''));

        expect(component.currentMainAccordion).toBe('');
        expect(component.selectedAccordion).toBe(
          APP_KEYS.LANDING_PAGE as AppKey,
        );
      });

      it('should ignore sub-accordion values', () => {
        component.currentMainAccordion = 'QR';
        component.selectedAccordion = APP_KEYS.QR_CODE_GENERATOR as AppKey;

        component.accordionGroupChange(makeEvent('-QR: Sub Feature'));

        expect(component.currentMainAccordion).toBe('QR');
        expect(component.setSelectedAccordion).not.toHaveBeenCalled();
        expect(
          (component as any).handlePotentialMainAccordionClose,
        ).not.toHaveBeenCalled();
      });
    });
  });

  describe('Template rendering', () => {
    it('should render the home page component', () => {
      const MainPageElement =
        fixture.nativeElement.querySelector('ion-content');
      expect(MainPageElement).toBeTruthy();
    });

    describe('Enable analytics info', () => {
      it('should display the analytics-not-enabled info when analytics is not allowed', () => {
        component.isAnalyticsEnabled = false;
        component.selectedAccordion = APP_KEYS.LANDING_PAGE as AppKey;
        fixture.detectChanges();

        const analyticsNotAllowedInfo = fixture.nativeElement.querySelector(
          '.analytics-not-enabled',
        );
        expect(analyticsNotAllowedInfo).toBeTruthy();
      });

      it('should have a solid 3px red border on analytics-not-enabled', () => {
        component.isAnalyticsEnabled = false;
        component.selectedAccordion = APP_KEYS.LANDING_PAGE as AppKey;
        const el = fixture.nativeElement.querySelector(
          '.analytics-not-enabled',
        ) as HTMLElement;
        const styles = getComputedStyle(el);
        fixture.detectChanges();

        expect(styles.borderStyle).toBe('solid');
        expect(styles.borderWidth).toBe('3px');
        // note: color cannot be safely tested because it's an ionic variable
      });

      it('should not display the analytics-not-enabled info when analytics is allowed', async () => {
        component.isAnalyticsEnabled = true;
        component.selectedAccordion = APP_KEYS.LANDING_PAGE as AppKey;
        fixture.detectChanges();

        const analyticsNotAllowedInfo = fixture.nativeElement.querySelector(
          '.analytics-not-enabled',
        );
        expect(analyticsNotAllowedInfo).toBeFalsy();
      });

      it('should display the general info when analytics is allowed', () => {
        component.isAnalyticsEnabled = true;
        component.selectedAccordion = APP_KEYS.LANDING_PAGE as AppKey;
        fixture.detectChanges();

        const welcomeInfo = fixture.nativeElement.querySelector(
          '.welcome-info .feature',
        );
        expect(welcomeInfo).toBeTruthy();
      });

      it('should not display the general info when analytics is not allowed', () => {
        component.isAnalyticsEnabled = false;
        component.selectedAccordion = APP_KEYS.LANDING_PAGE as AppKey;
        fixture.detectChanges();

        const welcomeInfo = fixture.nativeElement.querySelector(
          '.welcome-info .feature',
        );
        expect(welcomeInfo).toBeFalsy();
      });
    });
  });
});
