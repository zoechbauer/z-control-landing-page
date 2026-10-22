import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { UtilsService } from '@app/services/utils.service';
import { ToastService } from '@app/services/toast-EN.service';
import { LocalStorageService } from '@app/services/local-storage.service';
import { FirebaseAnalyticsService } from '@app/services/firebase-analytics.service';
import { FirebaseFirestoreLandingPageVisitService } from '@app/services/firebase-firestore-landing-page-visit.service';
import { APPS } from 'src/app/shared/github.constants';
import { FirebaseAnalyticsAccordionComponent } from '@ui/components/accordions/firebase-analytics-accordion.component';
import { createTranslateServiceMock } from '@testing/translate-service.mock';
import { EventEnum, Tab } from 'src/app/shared/enums';

describe('FirebaseAnalyticsAccordionComponent', () => {
  let component: FirebaseAnalyticsAccordionComponent;
  let fixture: ComponentFixture<FirebaseAnalyticsAccordionComponent>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let localStorageServiceSpy: jasmine.SpyObj<LocalStorageService>;
  let utilsServiceSpy: jasmine.SpyObj<UtilsService>;
  let firebaseAnalyticsServiceSpy: jasmine.SpyObj<FirebaseAnalyticsService>;
  let fbLandingPageVisitServiceSpy: jasmine.SpyObj<FirebaseFirestoreLandingPageVisitService>;
  let activatedRouteSpy: any;
  let enabledSubject: Subject<boolean>;

  beforeEach(waitForAsync(() => {
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['showToast']);

    localStorageServiceSpy = jasmine.createSpyObj('LocalStorageService', [
      'getItem',
      'setItem',
      'setAnalyticsConsent',
    ]);
    localStorageServiceSpy.setAnalyticsConsent.and.resolveTo(undefined as any);

    utilsServiceSpy = jasmine.createSpyObj('UtilsService', [
      'onLogoClicked',
      'logoClicked$',
      'openGitHubAnalytics',
      'openChangelog',
      'getSettingsAccordionTooltip',
      'navigateToTab',
    ]);
    utilsServiceSpy.logoClicked$ = of(false);
    utilsServiceSpy.navigateToTab.and.resolveTo(undefined as any);

    firebaseAnalyticsServiceSpy = jasmine.createSpyObj(
      'FirebaseAnalyticsService',
      ['logEvent', 'enableCollection'],
    );

    fbLandingPageVisitServiceSpy = jasmine.createSpyObj(
      'FirebaseFirestoreLandingPageVisitService',
      ['logLandingPageVisit'],
    );
    fbLandingPageVisitServiceSpy.logLandingPageVisit.and.resolveTo(
      undefined as any,
    );

    enabledSubject = new Subject<boolean>();
    firebaseAnalyticsServiceSpy.enabled$ = enabledSubject.asObservable();
    enabledSubject.next(false);

    activatedRouteSpy = {
      snapshot: {
        queryParams: {},
      },
    };

    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), FirebaseAnalyticsAccordionComponent],
      providers: [
        provideRouter([]),
        { provide: UtilsService, useValue: utilsServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: LocalStorageService, useValue: localStorageServiceSpy },
        {
          provide: FirebaseAnalyticsService,
          useValue: firebaseAnalyticsServiceSpy,
        },
        {
          provide: FirebaseFirestoreLandingPageVisitService,
          useValue: fbLandingPageVisitServiceSpy,
        },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        {
          provide: TranslateService,
          useValue: createTranslateServiceMock(),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FirebaseAnalyticsAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  describe('Class logic', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    describe('onChangeEnableAnalytics', () => {
      it('should enable collection on FirebaseAnalyticsService, save in localStorage, log event and navigate to main feature tab if not enabled', async () => {
        component.isAnalyticsEnabled = false;
        component.onChangeEnableAnalytics(true);
        fixture.detectChanges();
        await fixture.whenStable();

        expect(localStorageServiceSpy.setAnalyticsConsent).toHaveBeenCalledWith(
          true,
        );
        expect(firebaseAnalyticsServiceSpy.logEvent).toHaveBeenCalledWith(
          'toggle_analytics',
          { app: APPS.LANDING_PAGE, analytics: 'enabled' },
        );
        expect(
          firebaseAnalyticsServiceSpy.enableCollection,
        ).toHaveBeenCalledWith(true);
        expect(utilsServiceSpy.navigateToTab).toHaveBeenCalledWith(
          Tab.MainFeature,
        );
      });

      it('should disable collection on FirebaseAnalyticsService, save in localStorage and log event after delay if enabled', fakeAsync(() => {
        component.isAnalyticsEnabled = true;
        component.onChangeEnableAnalytics(false);
        tick(301);

        expect(localStorageServiceSpy.setAnalyticsConsent).toHaveBeenCalledWith(
          false,
        );
        expect(firebaseAnalyticsServiceSpy.logEvent).toHaveBeenCalledWith(
          'toggle_analytics',
          { app: APPS.LANDING_PAGE, analytics: 'disabled' },
        );
        expect(
          firebaseAnalyticsServiceSpy.enableCollection,
        ).toHaveBeenCalledWith(false);
      }));

      it('should log console.error when disabling flow async task fails', async () => {
        component.isAnalyticsEnabled = true;
        const error = new Error('Disable flow error');
        // make the awaited landing page visit reject so the IIFE rejects
        fbLandingPageVisitServiceSpy.logLandingPageVisit.and.callFake(() => Promise.reject(error) as any);
        const consoleErrorSpy = spyOn(console, 'error');

        component.onChangeEnableAnalytics(false);
        // wait for the setTimeout(300) to run and for microtasks to settle
        await new Promise((resolve) => setTimeout(resolve, 310));
        fixture.detectChanges();
        await fixture.whenStable();

        expect(consoleErrorSpy).toHaveBeenCalled();
        // first arg should be our disabling message
        expect(consoleErrorSpy.calls.mostRecent().args[0]).toBe(
          'Error during disabling analytics flow:',
        );
        // second arg should be the error
        expect(consoleErrorSpy.calls.mostRecent().args[1]).toBe(error);
      });

      it('should log console.error when enabling flow async task fails', async () => {
        component.isAnalyticsEnabled = false;
        const error = new Error('Enable flow error');
        fbLandingPageVisitServiceSpy.logLandingPageVisit.and.callFake(() => Promise.reject(error) as any);
        const consoleErrorSpy = spyOn(console, 'error');

        component.onChangeEnableAnalytics(true);
        fixture.detectChanges();
        await fixture.whenStable();

        expect(consoleErrorSpy).toHaveBeenCalled();
        expect(consoleErrorSpy.calls.mostRecent().args[0]).toBe(
          'Error during enabling analytics flow:',
        );
        expect(consoleErrorSpy.calls.mostRecent().args[1]).toBe(error);
      });

      it('should show a toast analytics enabled when toggling analytics', () => {
        component.isAnalyticsEnabled = false;
        component.onChangeEnableAnalytics(true);
        expect(toastServiceSpy.showToast).toHaveBeenCalledWith(
          'SETTINGS.FIREBASE_ANALYTICS.TOAST.ANALYTICS_ENABLED',
        );
      });

      it('should show a toast analytics disabled when toggling analytics', () => {
        component.isAnalyticsEnabled = true;
        component.onChangeEnableAnalytics(false);
        expect(toastServiceSpy.showToast).toHaveBeenCalledWith(
          'SETTINGS.FIREBASE_ANALYTICS.TOAST.ANALYTICS_DISABLED',
        );
      });
    });

    describe('enabled subscription', () => {
      it('should set isAnalyticsEnabled to true when enabled$ emits true', () => {
        component.isAnalyticsEnabled = false;
        firebaseAnalyticsServiceSpy.enabled$ = of(true);
        component.ngOnInit();
        expect(component.isAnalyticsEnabled).toBeTrue();
      });

      it('should set isAnalyticsEnabled to false when enabled$ emits false', () => {
        component.isAnalyticsEnabled = true;
        firebaseAnalyticsServiceSpy.enabled$ = of(false);
        component.ngOnInit();
        expect(component.isAnalyticsEnabled).toBeFalse();
      });
    });

    describe('logPrivacyPolicyVisit', () => {
      it('should log privacy policy visit if analytics is disabled', () => {
        component.isAnalyticsEnabled = false;
        component.logPrivacyPolicyVisit();

        expect(
          fbLandingPageVisitServiceSpy.logLandingPageVisit,
        ).toHaveBeenCalledWith(false, EventEnum.READ_POLICY_FROM_ANALYTICS);
      });

      it('should not log privacy policy visit if analytics is enabled', () => {
        component.isAnalyticsEnabled = true;
        component.logPrivacyPolicyVisit();

        expect(
          fbLandingPageVisitServiceSpy.logLandingPageVisit,
        ).not.toHaveBeenCalled();
      });
    });

    describe('ngOnInit', () => {
      it('should subscribe to enabled$', () => {
        const subSpy = spyOn((component as any).sub, 'add').and.callThrough();

        component.ngOnInit();
        expect(subSpy).toHaveBeenCalledTimes(1);
      });

      it('should set isAnalyticsEnabled based on enabled$ observable', () => {
        firebaseAnalyticsServiceSpy.enabled$ = of(true);
        component.ngOnInit();
        expect(component.isAnalyticsEnabled).toBeTrue();
      });
    });

    describe('ngOnDestroy', () => {
      it('should unsubscribe from all subscriptions', () => {
        const unsubscribeSpy = spyOn(
          (component as any).sub,
          'unsubscribe',
        ).and.callThrough();
        (component as any).ngOnDestroy();

        expect(unsubscribeSpy).toHaveBeenCalled();
      });
    });
  });

  describe('Template rendering', () => {
    describe('buttons', () => {
      it('should call onChangeEnableAnalytics on enable analytics button click', () => {
        const enableAnalyticsButton = fixture.nativeElement.querySelector(
          '[data-testid="enable-analytics"] ion-toggle',
        ) as HTMLButtonElement;
        spyOn(component, 'onChangeEnableAnalytics');

        enableAnalyticsButton.click();
        expect(component.onChangeEnableAnalytics).toHaveBeenCalled();
      });
    });

    describe('firebase analytics', () => {
      it('should show the enable analytics toggle text when firebase analytics is disabled', async () => {
        const toggle = fixture.nativeElement.querySelector(
          '[data-testid="enable-analytics"] ion-toggle',
        ) as HTMLButtonElement;
        toggle.dispatchEvent(
          new CustomEvent('ionChange', { detail: { checked: false } }),
        );
        enabledSubject.next(false);
        fixture.detectChanges();
        await fixture.whenStable();
        const analyticsToggleText = fixture.nativeElement.querySelector(
          '[data-testid="enable-analytics"]',
        );

        expect(analyticsToggleText.textContent).toContain(
          'SETTINGS.FIREBASE_ANALYTICS.ENABLE_ANALYTICS',
        );
      });

      it('should show the disable analytics toggle text when firebase analytics is enabled', async () => {
        const toggle = fixture.nativeElement.querySelector(
          '[data-testid="enable-analytics"] ion-toggle',
        ) as HTMLButtonElement;
        toggle.dispatchEvent(
          new CustomEvent('ionChange', { detail: { checked: true } }),
        );
        enabledSubject.next(true);
        fixture.detectChanges();
        await fixture.whenStable();
        const analyticsToggleText = fixture.nativeElement.querySelector(
          '[data-testid="enable-analytics"]',
        );

        expect(analyticsToggleText.textContent).toContain(
          'SETTINGS.FIREBASE_ANALYTICS.DISABLE_ANALYTICS',
        );
      });

      it('should show the main feature tab when analytics is enabled on settings page', async () => {
        component.onChangeEnableAnalytics(true);
        fixture.detectChanges();
        await fixture.whenStable();

        expect(utilsServiceSpy.navigateToTab).toHaveBeenCalledWith(
          Tab.MainFeature,
        );
      });
    });
  });
});
