import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { APPS, APP_KEYS, AppKey } from '@app/shared/GitHubConstants';
import { UtilsService } from '@app/services/utils.service';
import { QrCodeGeneratorSectionComponent } from '@ui/components/qr-code-generator-section/qr-code-generator-section.component';
import { createTranslateServiceMock } from '@testing/translate-service.mock';
import { PrivacyService } from '@app/privacy/services/privacy.service';
import { FirebaseAnalyticsService } from 'src/app/services/firebase-analytics.service';

describe('QrCodeGeneratorSectionComponent', () => {
  const nativeDownloadUrl =
    'https://play.google.com/store/apps/details?id=at.zcontrol.zoe.qrcodegenerator';
  const sourceCodeUrl =
    'https://github.com/zoechbauer/z-control-qr-code-generator';
  const webAppUrl = 'https://z-control-qr-code.web.app';

  let component: QrCodeGeneratorSectionComponent;
  let fixture: ComponentFixture<QrCodeGeneratorSectionComponent>;
  let utilsServiceSpy: jasmine.SpyObj<UtilsService>;
  let firebaseAnalyticsServiceSpy: jasmine.SpyObj<any>;
  let activatedRouteSpy: any;
  let privacyServiceSpy: jasmine.SpyObj<PrivacyService>;

  beforeEach(waitForAsync(() => {
    utilsServiceSpy = jasmine.createSpyObj('UtilsService', [
      'openChangelog',
      'openMarkdownDoc',
      'getAccordionTooltip',
      'getSubAccordionTooltip',
      'getWebLinkPathForAccordion',
      'getDisplayNameForAccordion',
      'getPlayStoreLinkPathForAccordion',
    ]);
    utilsServiceSpy.getSubAccordionTooltip.and.callFake(
      (_lang: string, selectedSubAccordion: string, value: string) => {
        if (selectedSubAccordion === value) {
          return `Collapse ${value}`;
        }
        return `Expand ${value}`;
      },
    );
    utilsServiceSpy.getWebLinkPathForAccordion.and.returnValue(webAppUrl);
    utilsServiceSpy.getPlayStoreLinkPathForAccordion.and.returnValue(
      nativeDownloadUrl,
    );

    firebaseAnalyticsServiceSpy = jasmine.createSpyObj(
      'FirebaseAnalyticsService',
      ['logEvent'],
    );

    privacyServiceSpy = jasmine.createSpyObj('PrivacyService', [
      'getPrivacyPolicy',
      'getPolicyName',
    ]);

    activatedRouteSpy = {
      snapshot: {
        queryParams: {},
      },
    };

    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), QrCodeGeneratorSectionComponent],
      providers: [
        {
          provide: TranslateService,
          useValue: createTranslateServiceMock(),
        },
        { provide: UtilsService, useValue: utilsServiceSpy },
        {
          provide: FirebaseAnalyticsService,
          useValue: firebaseAnalyticsServiceSpy,
        },
        { provide: PrivacyService, useValue: privacyServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(QrCodeGeneratorSectionComponent);
    component = fixture.componentInstance;

    const selectedAccordion = APP_KEYS.QR_CODE_GENERATOR as AppKey;
    component.parameters = {
      appSectionParameters: {
        selectedAccordion: selectedAccordion,
        currentMainAccordion: selectedAccordion,
        selectedLanguage: 'en',
      },
    } as any;
    component.selectedSubAccordion = selectedAccordion;
    component.isAnalyticsEnabled = true;
    firebaseAnalyticsServiceSpy.logEvent.calls.reset();

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open download URL in a new tab and log analytics event when onDownloadNative is called', () => {
    spyOn(globalThis.window, 'open');
    component.onDownloadNative();

    expect(globalThis.window.open).toHaveBeenCalledWith(
      nativeDownloadUrl,
      '_blank',
    );
    expect(firebaseAnalyticsServiceSpy.logEvent).toHaveBeenCalledWith(
      'download_native',
      {
        platform: 'android',
        url: nativeDownloadUrl,
        app: APPS.LANDING_PAGE,
      },
    );
  });

  it('should open Web URL in a new tab and log analytics event when onOpenWebApp is called', () => {
    spyOn(globalThis.window, 'open');
    component.onOpenWebApp();

    expect(utilsServiceSpy.getWebLinkPathForAccordion).toHaveBeenCalledWith(
      APP_KEYS.QR_CODE_GENERATOR as AppKey,
    );
    expect(globalThis.window.open).toHaveBeenCalledWith(webAppUrl, '_blank');
    expect(firebaseAnalyticsServiceSpy.logEvent).toHaveBeenCalledWith(
      'open_web_app',
      {
        url: webAppUrl,
        app: APPS.LANDING_PAGE,
      },
    );
  });

  it('should return correct tooltip for subaccordion', () => {
    component.selectedSubAccordion = 'IS Ionic Setup';

    expect(component.getAccordionTooltip('IS Ionic Setup')).toBe(
      'Collapse IS Ionic Setup',
    );
    expect(component.getAccordionTooltip('MLT Translator')).toBe(
      'Expand MLT Translator',
    );
  });

  it('should update selectedSubAccordion when subAccordionChange is called', () => {
    component.selectedSubAccordion = '';
    let event = { detail: { value: 'MLT Translator' } } as CustomEvent;
    component.subAccordionChange(event);
    expect(component.selectedSubAccordion).toBe('MLT Translator');

    event = { detail: { value: undefined } } as CustomEvent;
    component.subAccordionChange(event);
    expect(component.selectedSubAccordion).toBe('');

    event = { detail: { value: '' } } as CustomEvent;
    component.subAccordionChange(event);
    expect(component.selectedSubAccordion).toBe('');
  });
});
