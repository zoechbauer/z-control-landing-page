import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { UtilsService } from 'src/app/services/utils.service';
import { FirebaseAnalyticsService } from 'src/app/services/firebase-analytics.service';
import { MobileAppAppsComponent } from './mobile-app-apps.component';
import { createTranslateServiceMock } from 'src/app/testing/translate-service.mock';
import { APP_KEYS, APPS } from 'src/app/shared/GitHubConstants';

describe('MobileAppAppsComponent', () => {
  let component: MobileAppAppsComponent;
  let fixture: ComponentFixture<MobileAppAppsComponent>;
  let utilsServiceSpy: jasmine.SpyObj<UtilsService>;
  let firebaseAnalyticsServiceSpy: jasmine.SpyObj<FirebaseAnalyticsService>;

  beforeEach(waitForAsync(() => {
    utilsServiceSpy = jasmine.createSpyObj('UtilsService', [
      'getPlayStoreLinkPathForAccordion',
      'getWebLinkPathForAccordion',
    ]);
    firebaseAnalyticsServiceSpy = jasmine.createSpyObj(
      'FirebaseAnalyticsService',
      ['logEvent'],
    );

    TestBed.configureTestingModule({
      declarations: [],
      imports: [IonicModule.forRoot(), MobileAppAppsComponent],
      providers: [
        { provide: UtilsService, useValue: utilsServiceSpy },
        { provide: TranslateService, useValue: createTranslateServiceMock() },
        {
          provide: FirebaseAnalyticsService,
          useValue: firebaseAnalyticsServiceSpy,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileAppAppsComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open app of selected accordion in play store and log firebase analytics event', () => {
    component.selectedAccordion = APP_KEYS.QR_CODE_GENERATOR;
    component.selectedLanguage = 'en';
    spyOn(globalThis.window, 'open');
    const expectedUrl =
      'https://play.google.com/store/apps/details?id=at.zcontrol.zoe.qrcodeapp';
    utilsServiceSpy.getPlayStoreLinkPathForAccordion.and.returnValue(
      expectedUrl,
    );
    fixture.detectChanges();

    component.onDownloadNative();

    expect(
      utilsServiceSpy.getPlayStoreLinkPathForAccordion,
    ).toHaveBeenCalledWith(APP_KEYS.QR_CODE_GENERATOR);
    
    expect(globalThis.window.open).toHaveBeenCalledWith(expectedUrl, '_blank');

    expect(firebaseAnalyticsServiceSpy.logEvent).toHaveBeenCalledWith(
      'download_native',
      {
        platform: 'android',
        url: expectedUrl,
        app: APPS.LANDING_PAGE,
      },
    );
  });
});
