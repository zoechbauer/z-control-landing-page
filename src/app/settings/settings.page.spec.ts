import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular/standalone';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { of, EMPTY, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { SettingsPage } from './settings.page';
import { LocalStorageService } from '../services/local-storage.service';
import { UtilsService } from '../services/utils.service';
import { FirebaseFirestoreService } from '../services/firebase-firestore.service';
import { createTranslateServiceMock } from '@testing/translate-service.mock';
import {
  GetSourceAccordionComponent,
  ChangeLogAccordionComponent,
  PrivacyPolicyAccordionComponent,
  FeedbackAccordionComponent,
  LanguageAccordionComponent,
  SpinnerComponent,
  GetGithubAnalyticsAccordionComponent,
  FirebaseAnalyticsAccordionComponent,
} from '@ui';

@Component({
  selector: 'app-language-accordion',
  template: '',
  standalone: true,
})
class MockLanguageAccordionComponent {
  @Input() lang!: string;
  @Output() ionChange = new EventEmitter<any>();
}

@Component({
  selector: 'app-feedback-accordion',
  template: '',
  standalone: true,
})
class MockFeedbackAccordionComponent {
  @Input() lang!: string;
}


@Component({
  selector: 'app-privacy-policy-accordion',
  template: '',
  standalone: true,
})
class MockPrivacyPolicyAccordionComponent {
  @Input() lang!: string;
}

@Component({
  selector: 'app-change-log-accordion',
  template: '',
  standalone: true,
})
class MockChangeLogAccordionComponent {
  @Input() lang!: string;
  @Input() versionInfo!: string;
  @Output() ionChange = new EventEmitter<void>();
}

@Component({
  selector: 'app-get-source-accordion',
  template: '',
  standalone: true,
})
class MockGetSourceAccordionComponent {
  @Input() lang!: string;
}

@Component({
  selector: 'app-spinner',
  template: '',
  standalone: true,
})
class MockSpinnerComponent {}

@Component({
  selector: 'app-get-github-analytics-accordion',
  template: '',
  standalone: true,
})
class MockGetGithubAnalyticsAccordionComponent {}

@Component({
  selector: 'app-firebase-analytics-accordion',
  template: '',
  standalone: true,
})
class MockFirebaseAnalyticsAccordionComponent {}

describe('SettingsPage', () => {
  let component: SettingsPage;
  let fixture: ComponentFixture<SettingsPage>;
  let utilsServiceSpy: jasmine.SpyObj<UtilsService>;
  let localStorageServiceSpy: jasmine.SpyObj<LocalStorageService>;

  beforeEach(async () => {
    utilsServiceSpy = jasmine.createSpyObj(
      'UtilsService',
      [
        'getDeviceInfo',
        'showOrHideIonTabBar',
        'openChangelog',
        'workflowChangedSub',
      ],
      {
        isNative: false,
        logoClicked$: EMPTY,
        openFirebaseAnalytics$: EMPTY,
      },
    );

    localStorageServiceSpy = jasmine.createSpyObj(
      'LocalStorageService',
      ['saveSelectedLanguage', 'loadSelectedOrDefaultLanguage'],
      {
        selectedLanguage$: of('de'),
      },
    );

    const firebaseFirestoreUtilsServiceSpy = jasmine.createSpyObj(
      'FirebaseFirestoreUtilsService',
      ['requestStatisticsRefresh'],
    );

    const modalControllerSpy = jasmine.createSpyObj('ModalController', [
      'create',
    ]);
    modalControllerSpy.create.and.resolveTo({
      present: jasmine.createSpy('present').and.resolveTo(),
      onDidDismiss: jasmine
        .createSpy('onDidDismiss')
        .and.resolveTo({ data: null }),
    });

    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), SettingsPage],
      providers: [
        {
          provide: TranslateService,
          useValue: createTranslateServiceMock(),
        },
        {
          provide: LocalStorageService,
          useValue: localStorageServiceSpy,
        },
        {
          provide: UtilsService,
          useValue: utilsServiceSpy,
        },
        {
          provide: FirebaseFirestoreService,
          useValue: jasmine.createSpyObj('FirebaseFirestoreService', ['init']),
        },
        {
          provide: ModalController,
          useValue: modalControllerSpy,
        },
      ],
    })
      .overrideComponent(SettingsPage, {
        remove: {
          imports: [
            LanguageAccordionComponent,
            FeedbackAccordionComponent,
            PrivacyPolicyAccordionComponent,
            ChangeLogAccordionComponent,
            GetSourceAccordionComponent,
            SpinnerComponent,
            GetGithubAnalyticsAccordionComponent,
            FirebaseAnalyticsAccordionComponent,
          ],
        },
        add: {
          imports: [
            MockLanguageAccordionComponent,
            MockFeedbackAccordionComponent,
            MockPrivacyPolicyAccordionComponent,
            MockChangeLogAccordionComponent,
            MockGetSourceAccordionComponent,
            MockSpinnerComponent,
            MockGetGithubAnalyticsAccordionComponent,
            MockFirebaseAnalyticsAccordionComponent,
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(SettingsPage);
    component = fixture.componentInstance;
  });

  describe('class logic', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should open changelog', () => {
      const openChangelogSpy = utilsServiceSpy.openChangelog;
      component.openChangelog();
      expect(openChangelogSpy).toHaveBeenCalled();
    });

    describe('versionInfo', () => {
        it('should format versionInfo correctly when values exist', () => {
          const versionInfo = component.versionInfo;

          expect(versionInfo).toMatch(
            /^Version \d+\.\d+ \(\d{4}-\d{2}-\d{2}\)$/,
          );
        });

        it('should return version unknown when major is missing', () => {
          const versionString = (component as any).getVersionString({
            minor: 1,
            date: '2024-01-01',
          });
          expect(versionString).toBe(
            'Version unknown (missing version information)',
          );
        });
        it('should not return version unknown when major or minor is 0', () => {
          let versionString = (component as any).getVersionString({
            major: 0,
            minor: 1,
            date: '2024-01-01',
          });
          expect(versionString)
            .withContext('major version 0')
            .toBe('Version 0.1 (2024-01-01)');

          versionString = (component as any).getVersionString({
            major: 1,
            minor: 0,
            date: '2024-01-01',
          });
          expect(versionString)
            .withContext('minor version 0')
            .toBe('Version 1.0 (2024-01-01)');
        });

        it('should return version unknown when date is invalid', () => {
          const versionString = (component as any).getVersionString({
            major: 1,
            minor: 1,
            date: 'YYYY-MM-DD',
          });
          expect(versionString).toBe(
            'Version unknown (missing version information)',
          );
        });

        it('should return version unknown when no environment version is provided', () => {
          const versionString = (component as any).getVersionString({});
          expect(versionString).toBe(
            'Version unknown (missing version information)',
          );
        });
      });

    describe('accordion behavior', () => {
      it('should set openAccordion to null and showAllAccordions to true when showAll is called', () => {
        component.openAccordion = 'language';
        component.showAllAccordions = false;

        component.showAll();

        expect(component.openAccordion).toBeNull();
        expect(component.showAllAccordions).toBeTrue();
      });

      it('should set openAccordion to the selected value and showAllAccordions to false on accordion change', () => {
        const event = {
          detail: { value: 'language' },
        } as CustomEvent;
        const content = {} as any;

        component.onAccordionGroupChange(event, content);

        expect(component.openAccordion).toBe('language');
        expect(component.showAllAccordions).toBeFalse();
      });

      it('should ignore undefined values on accordion change', () => {
        const event = {
          detail: { value: undefined },
        } as CustomEvent;
        const content = {} as any;

        component.onAccordionGroupChange(event, content);

        expect(component.openAccordion).toBeNull();
        expect(component.showAllAccordions).toBeTrue();
      });

      it('should not change values on accordion change when normalized value is undefined', () => {
        component.openAccordion = 'language';
        component.showAllAccordions = false;
        const event = {
          detail: { value: undefined },
        } as CustomEvent;
        const content = {} as any;
        spyOn(component as any, 'normalizeAccordionValue').and.returnValue(
          undefined,
        );

        component.onAccordionGroupChange(event, content);

        expect(component.openAccordion).toBe('language');
        expect(component.showAllAccordions).toBeFalse();
      });

      it('should normalize accordion values correctly', () => {
        expect((component as any).normalizeAccordionValue('language')).toBe(
          'language',
        );
        expect((component as any).normalizeAccordionValue('z-control')).toBe(
          'z-control',
        );
        expect(
          (component as any).normalizeAccordionValue(undefined),
        ).toBeNull();
        expect(
          (component as any).normalizeAccordionValue('invalid'),
        ).toBeUndefined();
      });

      it('should open feedback accordion when logo is clicked', () => {
        (component as any).openFeedbackAccordion();
        expect(component.openAccordion).toBe('z-control');
      });

      it('should open Firebase analytics accordion when firebase analytics button is clicked', () => {
        (component as any).openFirebaseAnalyticsAccordion();
        expect(component.openAccordion).toBe('firebase-analytics');
      });
    });

    describe('onLanguageChange', () => {
      it('should save selected language', () => {
        const saveSelectedLanguageSpy =
          localStorageServiceSpy.saveSelectedLanguage as jasmine.Spy;
        const event = {
          detail: { value: 'en' },
        } as CustomEvent;

        component.onLanguageChange(event);

        expect(saveSelectedLanguageSpy).toHaveBeenCalledWith('en');
      });

      it('should do nothing if no language is selected', () => {
        const saveSelectedLanguageSpy =
          localStorageServiceSpy.saveSelectedLanguage as jasmine.Spy;
        const event = {
          detail: { value: null },
        } as CustomEvent;

        component.onLanguageChange(event);

        expect(saveSelectedLanguageSpy).not.toHaveBeenCalled();
      });
    });

    describe('ngOnInit', () => {
      it('should call setupSubscriptions, and showOrHideIonTabBar', () => {
        const setupSubscriptionsSpy = spyOn(
          component as any,
          'setupSubscriptions',
        ).and.callThrough();
        const showOrHideIonTabBarSpy = utilsServiceSpy.showOrHideIonTabBar;
        (component as any).showAllAccordions = false;

        component.ngOnInit();

        expect(setupSubscriptionsSpy).toHaveBeenCalled();
        expect(showOrHideIonTabBarSpy).toHaveBeenCalled();
        (component as any).showAllAccordions = true;
      });
    });

    describe('subscriptions and cleanup', () => {
      it('should unsubscribe from all subscriptions on destroy', () => {
        const subscription1 = jasmine.createSpyObj('Subscription', [
          'unsubscribe',
        ]);
        const subscription2 = jasmine.createSpyObj('Subscription', [
          'unsubscribe',
        ]);
        (component as any).subscriptions = [subscription1, subscription2];

        (component as any).ngOnDestroy();

        expect(subscription1.unsubscribe).toHaveBeenCalled();
        expect(subscription2.unsubscribe).toHaveBeenCalled();
      });

      it('should handle empty subscriptions array on destroy', () => {
        (component as any).subscriptions = [];
        (component as any).ngOnDestroy();
        // No errors should occur, and the test will pass if it reaches this point without throwing
      });

      it('should subscribe to selectedLanguage$ and update selectedLanguage', () => {
        Object.defineProperty(localStorageServiceSpy, 'selectedLanguage$', {
          get: () => of('en'),
        });

        (component as any).setupSubscriptions();

        expect(component.selectedLanguage).toBe('en');
      });

      it('should subscribe to openFirebaseAnalytics$ and open firebase analytics accordion', () => {
        const openFirebaseAnalytics$ = new EventEmitter<void>();
        Object.defineProperty(utilsServiceSpy, 'openFirebaseAnalytics$', {
          get: () => openFirebaseAnalytics$.asObservable(),
        });

        const openFirebaseAnalyticsAccordionSpy = spyOn(
          component as any,
          'openFirebaseAnalyticsAccordion',
        );

        (component as any).setupSubscriptions();

        openFirebaseAnalytics$.emit();

        expect(openFirebaseAnalyticsAccordionSpy).toHaveBeenCalled();
      });

      it('should subscribe to logoClicked$ and open feedback accordion', () => {
        const logoClicked$ = new EventEmitter<void>();
        Object.defineProperty(utilsServiceSpy, 'logoClicked$', {
          get: () => logoClicked$.asObservable(),
        });

        const openFeedbackAccordionSpy = spyOn(
          component as any,
          'openFeedbackAccordion',
        );

        (component as any).setupSubscriptions();

        logoClicked$.emit();

        expect(openFeedbackAccordionSpy).toHaveBeenCalled();
      });
    });
  });

  describe('template rendering', () => {
    it('should render mocked child accordion hosts (shallow render smoke test)', () => {
      // Guard test: verifies overrideComponent uses mock accordions, avoiding deep child DI dependencies.
      component.isLoading = false;
      component.selectedLanguage = 'de';
      component.showAllAccordions = true;
      component.openAccordion = null;
      fixture.detectChanges();

      const language = fixture.nativeElement.querySelector(
        'app-language-accordion',
      ) as HTMLElement;
      const feedback = fixture.nativeElement.querySelector(
        'app-feedback-accordion',
      ) as HTMLElement;

      expect(language).toBeTruthy();
      expect(feedback).toBeTruthy();

      // Mock components have empty templates.
      expect(language.innerHTML.trim()).toBe('');
      expect(feedback.innerHTML.trim()).toBe('');

      // Real child templates would render these markers.
      expect(fixture.nativeElement.querySelector('.notes')).toBeNull();
    });

    describe('loading spinner', () => {
      it('should show spinner during localStorage.selectedLanguage$ subscription in ngOnInit', async () => {
        const selectedLanguageSubject = new Subject<string>();
        Object.defineProperty(localStorageServiceSpy, 'selectedLanguage$', {
          get: () => selectedLanguageSubject.asObservable(),
        });

        const loadSelectedOrDefaultLanguageSpy =
          localStorageServiceSpy.loadSelectedOrDefaultLanguage as jasmine.Spy;
        loadSelectedOrDefaultLanguageSpy.and.returnValue(Promise.resolve());

        component.ngOnInit();
        fixture.detectChanges();

        // Spinner should be visible while loading (before we emit)
        let spinner = fixture.nativeElement.querySelector('app-spinner');
        expect(spinner)
          .withContext('Spinner should be visible while loading')
          .toBeTruthy();
        expect(component.isLoading).toBeTrue();

        // Now emit the language value
        selectedLanguageSubject.next('en');
        fixture.detectChanges();
        await fixture.whenStable();

        // Spinner should be hidden after loading
        expect(component.isLoading).toBeFalse();
        spinner = fixture.nativeElement.querySelector('app-spinner');
        expect(spinner)
          .withContext('Spinner should be hidden after loading')
          .toBeNull();
      });
    });

    describe('accordion visibility flow', () => {
      beforeEach(() => {
        component.isLoading = false;
        component.selectedLanguage = 'de';
        component.showAllAccordions = true;
        component.openAccordion = null;

        fixture.detectChanges();
      });

      it('should render all accordion components when no accordion is open', () => {
        const languageAccordion = fixture.nativeElement.querySelector(
          'app-language-accordion',
        );
        const feedbackAccordion = fixture.nativeElement.querySelector(
          'app-feedback-accordion',
        );
        const privacyAccordion = fixture.nativeElement.querySelector(
          'app-privacy-policy-accordion',
        );
        const changeLogAccordion = fixture.nativeElement.querySelector(
          'app-change-log-accordion',
        );
        const sourceAccordion = fixture.nativeElement.querySelector(
          'app-get-source-accordion',
        );
        const closeButtonArea = fixture.nativeElement.querySelector(
          '.accordion-close-button',
        );

        expect(languageAccordion).toBeTruthy();
        expect(feedbackAccordion).toBeTruthy();
        expect(privacyAccordion).toBeTruthy();
        expect(changeLogAccordion).toBeTruthy();
        expect(sourceAccordion).toBeTruthy();
        expect(closeButtonArea).toBeNull();
      });

      it('should render only selected accordion and close button in single-accordion mode', () => {
        component.openAccordion = 'language';
        component.showAllAccordions = false;
        fixture.detectChanges();

        const languageAccordion = fixture.nativeElement.querySelector(
          'app-language-accordion',
        );
        const feedbackAccordion = fixture.nativeElement.querySelector(
          'app-feedback-accordion',
        );
        const closeButtonArea = fixture.nativeElement.querySelector(
          '.accordion-close-button',
        );

        expect(languageAccordion).toBeTruthy();
        expect(feedbackAccordion).toBeNull();
        expect(closeButtonArea).toBeTruthy();
      });

      it('should switch to single-accordion mode when ionValueChange emits selected accordion value', () => {
        const group = fixture.nativeElement.querySelector(
          'ion-accordion-group',
        ) as HTMLElement;
        expect(group).toBeTruthy();

        group.dispatchEvent(
          new CustomEvent('ionValueChange', {
            detail: { value: 'language' },
            bubbles: true,
          }),
        );
        fixture.detectChanges();

        expect(component.openAccordion).toBe('language');
        expect(component.showAllAccordions).toBeFalse();

        const closeButtonArea = fixture.nativeElement.querySelector(
          '.accordion-close-button',
        );
        expect(closeButtonArea).toBeTruthy();
      });

      it('should show all accordions again when close button is clicked', () => {
        component.openAccordion = 'language';
        component.showAllAccordions = false;
        fixture.detectChanges();

        const closeButton = fixture.nativeElement.querySelector(
          '.accordion-close-button ion-button',
        ) as HTMLElement;
        expect(closeButton).toBeTruthy();

        closeButton.dispatchEvent(new Event('click'));
        fixture.detectChanges();

        expect(component.openAccordion).toBeNull();
        expect(component.showAllAccordions).toBeTrue();

        const feedbackAccordion = fixture.nativeElement.querySelector(
          'app-feedback-accordion',
        );
        const closeButtonArea = fixture.nativeElement.querySelector(
          '.accordion-close-button',
        );
        expect(feedbackAccordion).toBeTruthy();
        expect(closeButtonArea).toBeNull();
      });
    });
  });
});
