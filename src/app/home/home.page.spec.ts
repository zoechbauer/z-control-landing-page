import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { FirebaseAnalyticsService } from '../services/firebase-analytics.service';
import { LocalStorageService } from '../services/local-storage.service';
import { of } from 'rxjs';

import { HomePage } from './home.page';
import { UtilsService } from '../services/utils.service';
import { APPS } from '../shared/GitHubConstants';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let firebaseAnalyticsServiceSpy: jasmine.SpyObj<FirebaseAnalyticsService>;
  let localStorageServiceSpy: jasmine.SpyObj<LocalStorageService>;
  let utilsServiceSpy: jasmine.SpyObj<UtilsService>;

  beforeEach(waitForAsync(() => {
    firebaseAnalyticsServiceSpy = jasmine.createSpyObj(
      'FirebaseAnalyticsService',
      ['logEvent', 'enableCollection', 'init'],
    );
    firebaseAnalyticsServiceSpy.enabled$ = of(false);

    localStorageServiceSpy = jasmine.createSpyObj('LocalStorageService', [
      'getAnalyticsConsent',
    ]);

    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: { params: {} },
      params: jasmine.createSpyObj('Observable', ['subscribe']),
    });

    utilsServiceSpy = jasmine.createSpyObj('UtilsService', [
      'openGitHubAnalytics',
      'openChangelog',
      'openMarkdownDoc',
    ]);
    utilsServiceSpy.logoClicked$ = of(false);

    TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [
        {
          provide: FirebaseAnalyticsService,
          useValue: firebaseAnalyticsServiceSpy,
        },
        { provide: LocalStorageService, useValue: localStorageServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: UtilsService, useValue: utilsServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  describe('Class logic', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    describe('handleAnalyticsEvent', () => {
      it('should call logEvent on FirebaseAnalyticsService with correct parameters', () => {
        const eventName = 'test_event';
        const params = { key: 'value' };

        component.handleAnalyticsEvent({ eventName, params });

        expect((component as any).fa.logEvent).toHaveBeenCalledWith(
          eventName,
          params,
        );
      });
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
        expect(component.selectedAccordion).toBe(APPS.LANDING_PAGE);
      });

      it('should ignore sub-accordion values', () => {
        component.currentMainAccordion = 'QR';
        component.selectedAccordion = APPS.QR_CODE_GENERATOR;

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
      const homePageElement =
        fixture.nativeElement.querySelector('ion-content');
      expect(homePageElement).toBeTruthy();
    });

    describe('Enable analytics info', () => {
      it('should display the analytics-not-allowed info when analytics is not allowed', () => {
        localStorageServiceSpy.getAnalyticsConsent.and.returnValue(false);
        component.selectedAccordion = APPS.LANDING_PAGE;
        fixture.detectChanges();

        const analyticsNotAllowedInfo = fixture.nativeElement.querySelector(
          '.analytics-not-allowed',
        );
        expect(analyticsNotAllowedInfo).toBeTruthy();
      });

      it('should have a solid 3px red border on analytics-not-allowed', () => {
        localStorageServiceSpy.getAnalyticsConsent.and.returnValue(false);
        const el = fixture.nativeElement.querySelector(
          '.analytics-not-allowed',
        ) as HTMLElement;
        const styles = getComputedStyle(el);

        expect(styles.borderStyle).toBe('solid');
        expect(styles.borderWidth).toBe('3px');
        // note: color cannot be safely tested because it's an ionic variable
      });

      it('should not display the analytics-not-allowed info when analytics is allowed', () => {
        localStorageServiceSpy.getAnalyticsConsent.and.returnValue(true);
        component.selectedAccordion = APPS.LANDING_PAGE;
        fixture.detectChanges();

        const analyticsNotAllowedInfo = fixture.nativeElement.querySelector(
          '.analytics-not-allowed',
        );
        expect(analyticsNotAllowedInfo).toBeFalsy();
      });

      it('should display the general info when analytics is allowed', () => {
        localStorageServiceSpy.getAnalyticsConsent.and.returnValue(true);
        component.selectedAccordion = APPS.LANDING_PAGE;
        fixture.detectChanges();

        const welcomeInfo = fixture.nativeElement.querySelector(
          '.welcome-info .feature',
        );
        expect(welcomeInfo).toBeTruthy();
      });

      it('should not display the general info when analytics is not allowed', () => {
        localStorageServiceSpy.getAnalyticsConsent.and.returnValue(false);
        component.selectedAccordion = APPS.LANDING_PAGE;
        fixture.detectChanges();

        const welcomeInfo = fixture.nativeElement.querySelector(
          '.welcome-info .feature',
        );
        expect(welcomeInfo).toBeFalsy();
      });
    });

    describe('Open footer', () => {
      it('should render the footer component', () => {
        const footerElement = fixture.nativeElement.querySelector('app-footer');
        expect(footerElement).toBeTruthy();
      });

      it('should open footer if logo is clicked', () => {
        (utilsServiceSpy.logoClicked$ as any) = of(true);
        fixture.detectChanges();

        const footerElement = fixture.nativeElement.querySelector(
          '.footer-details.expanded',
        );
        expect(footerElement).toBeTruthy();
      });
    });

    describe('Application sections', () => {
      type AppSectionTestCase = {
        appSectionName: string;
        appUsingFirestoreBackend?: boolean;
        isAppFirestoreBackendFunction?: boolean;
      };

      const appSections: AppSectionTestCase[] = [
        { appSectionName: 'BF: Backend Functions', isAppFirestoreBackendFunction: true },
        { appSectionName: 'MLT: Translator', appUsingFirestoreBackend: true },
        { appSectionName: 'IS: Ionic Setup', appUsingFirestoreBackend: true },
        { appSectionName: 'QR: QR Code' },
        { appSectionName: 'BS: Backup Scripts' },
      ];

      const usingBackendFunctionsText = 'uses z-control Backend Functions';
      const usingBackendFunctionsIconTitle = 'Uses z-control Backend Functions';
      const backendFunctionsAppIconTitle = 'Backend Functions are used by marked Apps with icon';

      beforeEach(() => {
        component.selectedAccordion = APPS.LANDING_PAGE;
        fixture.detectChanges();
      });

      it('should show all application sections when the landing page is selected', () => {
        appSections.forEach(({ appSectionName: value }) => {
          const sectionElement = fixture.nativeElement.querySelector(
            `ion-accordion[value="${value}"]`,
          ) as HTMLElement;

          expect(sectionElement)
            .withContext(`section "${value}"`)
            .toBeTruthy();
        });
      });

      it('should display backend functions text and icon only for apps using Firestore backend function', () => {
        appSections
          .filter(({ appUsingFirestoreBackend: usingFirestoreBackend }) => usingFirestoreBackend)
          .forEach(({ appSectionName: value }) => {
            const accordion = fixture.nativeElement.querySelector(
              `ion-accordion[value="${value}"]`,
            ) as HTMLElement;

            expect(accordion)
              .withContext(`accordion "${value}"`)
              .toBeTruthy();

            expect(accordion.textContent)
              .withContext(`text in "${value}"`)
              .toContain(usingBackendFunctionsText);

            expect(
              accordion.querySelector(
                `ion-icon[title="${usingBackendFunctionsIconTitle}"]`,
              ),
            )
              .withContext(`icon in "${value}"`)
              .toBeTruthy();
          });
      });

      it('should not display backend functions text and icon for apps not using Firestore backend function', () => {
        appSections
          .filter(({ appUsingFirestoreBackend: usingFirestoreBackend }) => !usingFirestoreBackend)
          .forEach(({ appSectionName: value }) => {
            const accordion = fixture.nativeElement.querySelector(
              `ion-accordion[value="${value}"]`,
            ) as HTMLElement;

            expect(accordion)
              .withContext(`accordion "${value}"`)
              .toBeTruthy();

            expect(accordion.textContent)
              .withContext(`text in "${value}"`)
              .not.toContain(usingBackendFunctionsText);

            expect(
              accordion.querySelector(
                `ion-icon[title="${usingBackendFunctionsIconTitle}"]`,
              ),
            )
              .withContext(`icon in "${value}"`)
              .toBeNull();
          });
      });

      it('should display not Backend Functions text but display icon for Firestore Backend Functions app', () => {
        appSections
          .filter(({ isAppFirestoreBackendFunction: isFirestoreBackendFunction }) => isFirestoreBackendFunction)
          .forEach(({ appSectionName: value }) => {
            const accordion = fixture.nativeElement.querySelector(
              `ion-accordion[value="${value}"]`,
            ) as HTMLElement;

            expect(accordion)
              .withContext(`accordion "${value}"`)
              .toBeTruthy();

            expect(accordion.textContent)
              .withContext(`text in "${value}"`)
              .not.toContain(usingBackendFunctionsText);

            expect(
              accordion.querySelector(
                `ion-icon[title="${backendFunctionsAppIconTitle}"]`,
              ),
            )
              .withContext(`icon in "${value}"`)
              .toBeTruthy();
          });
      });
    });
  });
});
