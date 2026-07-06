import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { FooterComponent } from './footer.component';
import { UtilsService } from '@app/services/utils.service';
import { ToastService } from '@app/services/toast-EN.service';
import { LocalStorageService } from '@app/services/local-storage.service';
import { FirebaseAnalyticsService } from '@app/services/firebase-analytics.service';
import { APPS } from '@app/shared/GitHubConstants';
import { ToastAnchor } from '@app/shared/enums';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
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
      imports: [IonicModule.forRoot(), FooterComponent],
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
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  describe('Class logic', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    describe('toggleFooterDetails', () => {
      it('should toggle showDetails and log event when opening', () => {
        component.showDetails = false;
        component.toggleFooterDetails();
        expect(component.showDetails).toBeTrue();
        expect(firebaseAnalyticsServiceSpy.logEvent).toHaveBeenCalledWith(
          'open_footer',
          { app: APPS.LANDING_PAGE },
        );
      });

      it('should toggle showDetails without logging event when closing', () => {
        component.showDetails = true;
        component.toggleFooterDetails();
        expect(component.showDetails).toBeFalse();
        expect(firebaseAnalyticsServiceSpy.logEvent).not.toHaveBeenCalled();
      });
    });

    describe('getter', () => {
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

      it('should return the correct mailto link', () => {
        const mailtoLink = component.mailtoLink;
        expect(mailtoLink).toBe(
          'mailto:zcontrol.app.qr@gmail.com?subject=z-control%20Landing%20Page%20Feedback',
        );
      });

      it('should return the correct privacy policy link', () => {
        const privacyPolicyLink = component.privacyPolicyLink;
        expect(privacyPolicyLink).toEqual(['/privacy', 'landing-page', 'en']);
      });
    });

    describe('onChangeEnableAnalytics', () => {
      it('should enable collection on FirebaseAnalyticsService, save in localStorage and log event  if not enabled', () => {
        component.isAnalyticsEnabled = false;
        component.onChangeEnableAnalytics(true);

        expect(localStorageServiceSpy.setAnalyticsConsent).toHaveBeenCalledWith(
          true,
        );
        expect(firebaseAnalyticsServiceSpy.logEvent).toHaveBeenCalledWith(
          'toggle_analytics_footer',
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
          'toggle_analytics_footer',
          { app: APPS.LANDING_PAGE, analytics: 'disabled' },
        );
        expect(
          firebaseAnalyticsServiceSpy.enableCollection,
        ).toHaveBeenCalledWith(false);
      }));
    });

    describe('onOpenGitHubAnalytics', () => {
      it('should show toast and not open GitHub analytics if analytics is disabled', () => {
        component.isAnalyticsEnabled = false;
        component.onOpenGitHubAnalytics();

        expect(toastServiceSpy.showToast).toHaveBeenCalledWith(
          'Analytics is disabled. Please enable it to view GitHub Analytics Dashboard.',
          ToastAnchor.MainPage,
        );
        expect(utilsServiceSpy.openGitHubAnalytics).not.toHaveBeenCalled();
      });

      it('should open GitHub analytics and not show toast if analytics is enabled', () => {
        component.isAnalyticsEnabled = true;
        component.onOpenGitHubAnalytics();

        expect(toastServiceSpy.showToast).not.toHaveBeenCalled();
        expect(utilsServiceSpy.openGitHubAnalytics).toHaveBeenCalledWith(
          APPS.LANDING_PAGE as keyof typeof APPS,
        );
      });
    });

    describe('onOpenChangelog', () => {
      it('should show toast and not open changelog if analytics is disabled', () => {
        component.isAnalyticsEnabled = false;
        component.onOpenChangelog();

        expect(toastServiceSpy.showToast).toHaveBeenCalledWith(
          'Analytics is disabled. Please enable it to view the Release Notes.',
          ToastAnchor.MainPage,
        );
        expect(utilsServiceSpy.openChangelog).not.toHaveBeenCalled();
      });

      it('should open changelog and not show toast if analytics is enabled', () => {
        component.isAnalyticsEnabled = true;
        component.onOpenChangelog();

        expect(toastServiceSpy.showToast).not.toHaveBeenCalled();
        expect(utilsServiceSpy.openChangelog).toHaveBeenCalledWith(
          APPS.LANDING_PAGE as keyof typeof APPS,
        );
      });
    });

    describe('onGetSourceCode', () => {
      it('should show toast and not open source code if analytics is disabled', () => {
        component.isAnalyticsEnabled = false;
        component.onGetSourceCode();

        expect(toastServiceSpy.showToast).toHaveBeenCalledWith(
          'Analytics is disabled. Please enable it to view the source code.',
          ToastAnchor.MainPage,
        );
      });

      it('should open source code and not show toast if analytics is enabled', () => {
        spyOn(globalThis.window, 'open');
        component.isAnalyticsEnabled = true;
        component.onGetSourceCode();

        expect(toastServiceSpy.showToast).not.toHaveBeenCalled();
        expect(globalThis.window.open).toHaveBeenCalledWith(
          'https://github.com/zoechbauer/z-control-landing-page',
          '_blank',
        );
      });
    });

    describe('logoClicked subscription', () => {
      it('should log event and toggle show details when logoClicked$ emits true', () => {
        component.showDetails = false;
        utilsServiceSpy.logoClicked$ = of(true);
        component.ngOnInit();

        expect(component.showDetails).toBeTrue();
        expect(firebaseAnalyticsServiceSpy.logEvent).toHaveBeenCalledWith(
          'logo_clicked',
          { app: APPS.LANDING_PAGE },
        );
      });

      it('should not log event and toggle show details when logoClicked$ emits false', () => {
        component.showDetails = true;
        utilsServiceSpy.logoClicked$ = of(false);
        component.ngOnInit();

        expect(component.showDetails).toBeFalse();
        expect(firebaseAnalyticsServiceSpy.logEvent).not.toHaveBeenCalled();
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

    describe('ngOnInit', () => {
      it('should subscribe to logoClicked$ and enabled$', () => {
        const subSpy = spyOn((component as any).sub, 'add').and.callThrough();

        component.ngOnInit();
        expect(subSpy).toHaveBeenCalledTimes(2);
      });

      it('should set isAnalyticsEnabled based on enabled$ observable', () => {
        firebaseAnalyticsServiceSpy.enabled$ = of(true);
        component.ngOnInit();
        expect(component.isAnalyticsEnabled).toBeTrue();
      });

      it('should toggle showDetails when logoClicked$ emits', () => {
        utilsServiceSpy.logoClicked$ = of(true);
        component.showDetails = false;
        component.ngOnInit();

        expect(component.showDetails).toBeTrue();
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
    it('should render the footer', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('ion-footer')).toBeTruthy();
    });

    describe('css classes', () => {
      it('should add class=expanded to the footer details when showDetails is true', async () => {
        component.showDetails = true;
        fixture.detectChanges();
        await fixture.whenStable();

        const footerDetailExpandedClass = fixture.nativeElement.querySelector(
          '.footer-details.expanded',
        );
        expect(footerDetailExpandedClass).toBeTruthy();
      });

      it('should not add class=expanded to the footer details when showDetails is false', async () => {
        component.showDetails = false;
        fixture.detectChanges();
        await fixture.whenStable();

        const footerDetailExpandedClass = fixture.nativeElement.querySelector(
          '.footer-details.expanded',
        );
        expect(footerDetailExpandedClass).toBeFalsy();
      });
    });

    describe('buttons', () => {
      it('should call toggleFooterDetails on Accordion expand button click', () => {
        const expandButton = fixture.nativeElement.querySelector(
          '.expand-button',
        ) as HTMLButtonElement;
        spyOn(component, 'toggleFooterDetails');

        expandButton.click();
        expect(component.toggleFooterDetails).toHaveBeenCalled();
      });

      it('should call onChangeEnableAnalytics on enable analytics button click', () => {
        const enableAnalyticsButton = fixture.nativeElement.querySelector(
          '.enable-analytics ion-toggle',
        ) as HTMLButtonElement;
        spyOn(component, 'onChangeEnableAnalytics');

        enableAnalyticsButton.click();
        expect(component.onChangeEnableAnalytics).toHaveBeenCalled();
      });

      it('should call onOpenGitHubAnalytics on Github Analytics button click', () => {
        const githubAnalyticsButton = fixture.nativeElement.querySelector(
          '.github-dashboard-button',
        ) as HTMLButtonElement;
        spyOn(component, 'onOpenGitHubAnalytics');

        githubAnalyticsButton.click();
        expect(component.onOpenGitHubAnalytics).toHaveBeenCalled();
      });

      it('should call onOpenChangelog on Changelog button click', () => {
        const changelogButton = fixture.nativeElement.querySelector(
          '.change-log-button',
        ) as HTMLButtonElement;
        spyOn(component, 'onOpenChangelog');

        changelogButton.click();
        expect(component.onOpenChangelog).toHaveBeenCalled();
      });

      it('should call onOpenChangelog on Version div click', () => {
        const versionDiv = fixture.nativeElement.querySelector(
          '.version-and-changelog div',
        ) as HTMLDivElement;
        spyOn(component, 'onOpenChangelog');

        versionDiv.click();
        expect(component.onOpenChangelog).toHaveBeenCalled();
      });

      it('should call onGetSourceCode on get source code button click', () => {
        const getSourceCodeButton = fixture.nativeElement.querySelector(
          '.get-source-code-button',
        ) as HTMLButtonElement;
        spyOn(component, 'onGetSourceCode');

        getSourceCodeButton.click();
        expect(component.onGetSourceCode).toHaveBeenCalled();
      });

      describe('links', () => {
        it('should render the privacy policy routerLink correctly', () => {
          fixture.detectChanges();

          const linkDebugEl = fixture.debugElement.query(
            By.css('.footer-link'),
          );
          expect(linkDebugEl).toBeTruthy();

          const anchor = linkDebugEl.nativeElement as HTMLAnchorElement;
          expect(anchor).toBeTruthy();
          expect(anchor.getAttribute('href')).toContain('/privacy');
        });

        it('should render the footer email href correctly', () => {
          fixture.detectChanges();

          const footerEmailLink = fixture.nativeElement.querySelector(
            '.footer-email a',
          ) as HTMLAnchorElement;

          expect(footerEmailLink).toBeTruthy();
          expect(footerEmailLink.getAttribute('href')).toContain(
            'mailto:zcontrol.app.qr@gmail.com',
          );
        });
      });
    });

    describe('firebase analytics', () => {
      it('should show the enable analytics toggle text in red  when firebase analytics is disabled', async () => {
        component.isAnalyticsEnabled = false;
        fixture.detectChanges();
        await fixture.whenStable();

        const analyticsToggleText = fixture.nativeElement.querySelector(
          '.footer-details .enable-analytics',
        );
        const computedStyle = window.getComputedStyle(analyticsToggleText);
        expect(computedStyle.color).toBe('rgb(187, 0, 0)'); // red
      });

      it('should not show the enable analytics toggle text in red when firebase analytics is enabled', async () => {
        firebaseAnalyticsServiceSpy.enabled$ = of(true);
        fixture.detectChanges();
        await fixture.whenStable();

        const analyticsToggleText = fixture.nativeElement.querySelector(
          '.footer-details .enable-analytics',
        );
        const computedStyle = window.getComputedStyle(analyticsToggleText);
        expect(computedStyle.color).not.toBe('rgb(187, 0, 0)'); // not red

        const analyticsToggleButton = fixture.nativeElement.querySelector(
          '.footer-details .enable-analytics ion-toggle',
        );
        expect(analyticsToggleButton).toBeTruthy();
      });

      it('should show toast when analytics is disabled', async () => {
        firebaseAnalyticsServiceSpy.enabled$ = of(false);
        fixture.detectChanges();
        await fixture.whenStable();

        const cases = [
          {
            testId: 'github-analytics',
            expectedMessage:
              'Analytics is disabled. Please enable it to view GitHub Analytics Dashboard.',
          },
          {
            testId: 'changelog',
            expectedMessage:
              'Analytics is disabled. Please enable it to view the Release Notes.',
          },
          {
            testId: 'source-code',
            expectedMessage:
              'Analytics is disabled. Please enable it to view the source code.',
          },
        ];

        for (const { testId, expectedMessage } of cases) {
          toastServiceSpy.showToast.calls.reset();

          const button = fixture.nativeElement.querySelector(
            `[data-test="${testId}"]`,
          ) as HTMLButtonElement;

          expect(button).withContext(`Missing button: ${testId}`).toBeTruthy();

          button.click();

          expect(toastServiceSpy.showToast).toHaveBeenCalledOnceWith(
            expectedMessage,
            ToastAnchor.MainPage,
          );
        }
      });
    });
  });
});
