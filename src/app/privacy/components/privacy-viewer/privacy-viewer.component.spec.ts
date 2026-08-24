import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject, of, throwError } from 'rxjs';

import { UtilsService } from '@app/services/utils.service';
import { Tab } from '@app/shared/enums';
import { createTranslateServiceMock } from '@testing/translate-service.mock';
import { createUtilsServiceMock } from '@testing/utils-service.mock';
import { PrivacyViewerComponent } from './privacy-viewer.component';
import { PrivacyService, PrivacyPolicy } from '../../services/privacy.service';

describe('PrivacyViewerComponent', () => {
  let component: PrivacyViewerComponent;
  let fixture: ComponentFixture<PrivacyViewerComponent>;
  let privacyServiceMock: jasmine.SpyObj<PrivacyService>;
  let activatedRouteMock: any;

  beforeEach(waitForAsync(() => {
    const modalControllerSpy = jasmine.createSpyObj('ModalController', [
      'create',
    ]);

    const utilsServiceMock = createUtilsServiceMock();

    activatedRouteMock = {
      params: new Subject<any>(),
      queryParams: new Subject<any>(),
    };

    privacyServiceMock = jasmine.createSpyObj('PrivacyService', [
      'getPolicy',
      'isPolicyAvailable',
    ]);
    privacyServiceMock.isPolicyAvailable.and.returnValue(true);
    privacyServiceMock.getPolicy.and.returnValue(
      of({
        type: 'qr-code-generator',
        language: 'en',
        title: 'Privacy Policy\nz-control QR Code Generator App',
        content: 'Sample Privacy Policy Content',
        lastUpdated: '2025-10-24',
      }),
    );

    TestBed.configureTestingModule({
      declarations: [],
      imports: [IonicModule.forRoot(), PrivacyViewerComponent],
      providers: [
        { provide: TranslateService, useValue: createTranslateServiceMock() },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: UtilsService, useValue: utilsServiceMock },
        { provide: PrivacyService, useValue: privacyServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PrivacyViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Navigation methods', () => {
    it('should call utilsService.navigateToTab with currentTab on goBack', () => {
      const utilsService = TestBed.inject(UtilsService);
      component.currentTab = Tab.MainFeature;
      const event = new Event('click');
      spyOn(event, 'preventDefault');
      spyOn(event, 'stopPropagation');

      component.goBack();

      expect(utilsService.navigateToTab).toHaveBeenCalledWith(Tab.MainFeature);
    });
  });

  describe('backToHomeButtonLabel', () => {
    it('should return "Zurück zur Startseite" when language is DE', () => {
      component.language = 'de';
      expect(component.backToHomeButtonLabel).toBe('Zurück zur Startseite');
    });

    it('should return "Back to Home" when language is EN', () => {
      component.language = 'en';
      expect(component.backToHomeButtonLabel).toBe('Back to Home');
    });
  });

  describe('Show back button logic', () => {
    it('should set showBackButton to true when internal query param is true', () => {
      activatedRouteMock.queryParams.next({ internal: 'true' });
      expect(component.showBackButton).toBeTrue();
    });

    it('should set showBackButton to false when internal query param is not true', () => {
      activatedRouteMock.queryParams.next({ internal: 'false' });
      expect(component.showBackButton).toBeFalse();
    });

    it('should set showBackButton to false when no internal query param is present', () => {
      activatedRouteMock.queryParams.next({});
      expect(component.showBackButton).toBeFalse();
    });
  });

  describe('loadPolicy', () => {
    const policyResponse = {
      type: 'qr-code-generator',
      language: 'en',
      title: 'Privacy Policy\nz-control QR Code Generator App',
      content: 'Sample Privacy Policy Content',
      lastUpdated: '2025-10-24',
    } as PrivacyPolicy;

    it('should set loading true while waiting and false after policy loads', () => {
      const policySubject = new Subject<PrivacyPolicy>();
      privacyServiceMock.isPolicyAvailable.and.returnValue(true);
      privacyServiceMock.getPolicy.and.returnValue(
        policySubject.asObservable(),
      );

      component.policyType = 'qr-code-generator';
      component.language = 'en';

      component['loadPolicy']();

      // subscription not yet emitted
      expect(component.loading).toBeTrue();

      // emit the policy
      policySubject.next(policyResponse);
      policySubject.complete();

      expect(component.policy).toEqual(policyResponse);
      expect(component.loading).toBeFalse();
      expect(component.error).toBeFalse();
    });

    it('should call privacyService.getPrivacyPolicy with correct parameters', async () => {
      component.policyType = 'qr-code-generator';
      component.language = 'en';

      await component['loadPolicy']();

      expect(privacyServiceMock.getPolicy).toHaveBeenCalledWith(
        'qr-code-generator',
        'en',
      );
    });

    it('should set policy on successful load', async () => {
      component.policyType = 'qr-code-generator';
      component.language = 'en';
      await component['loadPolicy']();

      expect(component.policy).toEqual(policyResponse);
      expect(component.loading).toBeFalse();
      expect(component.error).toBeFalse();
    });

    it('should set error to true on failed load', async () => {
      privacyServiceMock.getPolicy.and.returnValue(
        throwError(() => 'Error loading policy'),
      );
      component.policyType = 'qr-code-generator';
      component.language = 'en';

      await component['loadPolicy']();

      expect(component.error).toBeTrue();
      expect(component.loading).toBeFalse();
    });

    it('should fallback to English if requested language is not available', async () => {
      privacyServiceMock.isPolicyAvailable.and.callFake((type, language) => {
        if (language === 'en') return true;
        return false;
      });

      component.policyType = 'qr-code-generator';
      component.language = 'de';

      await component['loadPolicy']();

      expect(component.language).toBe('en');
      expect(privacyServiceMock.getPolicy).toHaveBeenCalledWith(
        'qr-code-generator',
        'en',
      );
    });

    it('should fallback to basic policy if type is not available', async () => {
      privacyServiceMock.isPolicyAvailable.and.returnValue(false);

      component.policyType = 'non-existent-type';
      component.language = 'en';

      await component['loadPolicy']();

      expect(component.policyType).toBe('qr-code-generator');
      expect(component.language).toBe('en');
    });
  });

  describe('detectInternalNavigation', () => {
    it('should set showBackButton to true if navigation state has internal true', () => {
      const router = TestBed.inject(Router);
      spyOn(router, 'getCurrentNavigation').and.returnValue({
        extras: { state: { internal: true } },
      } as any);

      component['detectInternalNavigation']();

      expect(component.showBackButton).toBeTrue();
    });

    it('should set showBackButton to false if navigation state does not have internal true', () => {
      const router = TestBed.inject(Router);
      spyOn(router, 'getCurrentNavigation').and.returnValue({
        extras: { state: {} },
      } as any);

      component['detectInternalNavigation']();

      expect(component.showBackButton).toBeFalse();
    });

    describe('route params & queryParams subscription', () => {
      it('should set policyType and language from route params', () => {
        spyOn(component as any, 'loadPolicy').and.callThrough();
        activatedRouteMock.params.next({
          type: 'qr-code-generator',
          language: 'en',
        });
        
        expect(component.policyType).toBe('qr-code-generator');
        expect(component.language).toBe('en');
        expect(component['loadPolicy']).toHaveBeenCalled();
      });

      it('should set default policyType and language if not provided in route params', () => {
        spyOn(component as any, 'loadPolicy').and.callThrough();
        activatedRouteMock.params.next({});

        expect(component.policyType).toBe('qr-code-generator');
        expect(component.language).toBe('en');
        expect(component['loadPolicy']).toHaveBeenCalled();
      });

      it('should set showBackButton to true when internal param is true', () => {
        activatedRouteMock.queryParams.next({ internal: 'true' });
        expect(component.showBackButton).toBeTrue();
      });

      it('should set showBackButton to false when internal param is not true', () => {
        activatedRouteMock.queryParams.next({ internal: 'false' });
        expect(component.showBackButton).toBeFalse();
      });

      it('should set showBackButton to false when no internal param is present', () => {
        activatedRouteMock.queryParams.next({});
        expect(component.showBackButton).toBeFalse();
      });

      it('should set currentTab from query params if internal is true', () => {
        activatedRouteMock.queryParams.next({
          internal: 'true',
          currentTab: Tab.Settings,
        });
        expect(component.currentTab).toBe(Tab.Settings);
      });

      it('should default currentTab to Tab.Settings if not provided in query params', () => {
        activatedRouteMock.queryParams.next({ internal: 'true' });
        expect(component.currentTab).toBe(Tab.Settings);
      });

      it('should set selectedAccordion from query params', () => {
        activatedRouteMock.queryParams.next({ from: 'QR Code Generator' });
        expect(component.selectedAccordion).toBe('QR Code Generator');
      });

      it('should default selectedAccordion to "Privacy Policy" if not provided in query params', () => {
        activatedRouteMock.queryParams.next({});
        expect(component.selectedAccordion).toBe('Privacy Policy');
      });
    });
  });
});
