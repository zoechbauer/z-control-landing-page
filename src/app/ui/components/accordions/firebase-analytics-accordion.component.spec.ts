import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { UtilsService } from '@app/services/utils.service';
import { ToastService } from '@app/services/toast-EN.service';
import { LocalStorageService } from '@app/services/local-storage.service';
import { FirebaseAnalyticsService } from '@app/services/firebase-analytics.service';
import { APPS } from '@app/shared/GitHubConstants';
import { ToastAnchor } from '@app/shared/enums';
import { FirebaseAnalyticsAccordionComponent } from './firebase-analytics-accordion.component';
import { TranslateService } from '@ngx-translate/core';
import { createTranslateServiceMock } from '@testing/translate-service.mock';

describe('FirebaseAnalyticsAccordionComponent', () => {
  let component: FirebaseAnalyticsAccordionComponent;
  let fixture: ComponentFixture<FirebaseAnalyticsAccordionComponent>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let localStorageServiceSpy: jasmine.SpyObj<LocalStorageService>;
  let utilsServiceSpy: jasmine.SpyObj<UtilsService>;
  let firebaseAnalyticsServiceSpy: jasmine.SpyObj<FirebaseAnalyticsService>;
  let activatedRouteSpy: any;

  beforeEach(waitForAsync(() => {
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['showToast']);
    localStorageServiceSpy = jasmine.createSpyObj('LocalStorageService', [
      'getItem',
      'setItem',
      'setAnalyticsConsent',
    ]);
    utilsServiceSpy = jasmine.createSpyObj('UtilsService', [
      'onLogoClicked',
      'logoClicked$',
      'openGitHubAnalytics',
      'openChangelog',
    ]);
    utilsServiceSpy.logoClicked$ = of(false);
    firebaseAnalyticsServiceSpy = jasmine.createSpyObj(
      'FirebaseAnalyticsService',
      ['logEvent', 'enableCollection'],
    );
    firebaseAnalyticsServiceSpy.enabled$ = of(false);
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
      it('should enable collection on FirebaseAnalyticsService, save in localStorage and log event  if not enabled', () => {
        component.isAnalyticsEnabled = false;
        component.onChangeEnableAnalytics(true);

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
        component.isAnalyticsEnabled = false;
        fixture.detectChanges();
        await fixture.whenStable();
        const analyticsToggleText = fixture.nativeElement.querySelector(
          '[data-testid="enable-analytics"]',
        );

        expect(analyticsToggleText.textContent).toContain('SETTINGS.FIREBASE_ANALYTICS.ENABLE_ANALYTICS');
      });

      it('should show the disable analytics toggle text when firebase analytics is enabled', async () => {
        firebaseAnalyticsServiceSpy.enabled$ = of(true);
        fixture.detectChanges();
        await fixture.whenStable();
        const analyticsToggleText = fixture.nativeElement.querySelector(
          '[data-testid="enable-analytics"]',
        );

        expect(analyticsToggleText.textContent).toContain('SETTINGS.FIREBASE_ANALYTICS.ENABLE_ANALYTICS');

        const analyticsToggleButton = fixture.nativeElement.querySelector(
          '[data-testid="enable-analytics"] ion-toggle',
        );
        expect(analyticsToggleButton).toBeTruthy();
      });
    });
  });
});
