import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { SourceCodeAppsComponent } from './source-code-apps.component';
import { APP_KEYS, APPS } from '@app/shared/GitHubConstants';
import { UtilsService } from '@app/services/utils.service';
import { FirebaseAnalyticsService } from '@app/services/firebase-analytics.service';
import { createTranslateServiceMock } from '@testing/translate-service.mock';

describe('SourceCodeAppsComponent', () => {
  let component: SourceCodeAppsComponent;
  let fixture: ComponentFixture<SourceCodeAppsComponent>;
  let utilsServiceSpy: jasmine.SpyObj<UtilsService>;
  let firebaseAnalyticsServiceSpy: jasmine.SpyObj<FirebaseAnalyticsService>;

  beforeEach(waitForAsync(() => {
    utilsServiceSpy = jasmine.createSpyObj('UtilsService', [
      'getDisplayNameForAccordion',
      'getSourceLinkPathForAccordion',
    ]);
    firebaseAnalyticsServiceSpy = jasmine.createSpyObj(
      'FirebaseAnalyticsService',
      ['logEvent'],
    );

    TestBed.configureTestingModule({
      declarations: [],
      imports: [IonicModule.forRoot(), SourceCodeAppsComponent],
      providers: [
        {
          provide: TranslateService,
          useValue: createTranslateServiceMock(),
        },
        {
          provide: UtilsService,
          useValue: utilsServiceSpy,
        },
        {
          provide: FirebaseAnalyticsService,
          useValue: firebaseAnalyticsServiceSpy,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SourceCodeAppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getDisplayNameForAccordion method of UtilsService', () => {
    component.selectedAccordion = APP_KEYS.QR_CODE_GENERATOR;
    component.appName;
    expect(utilsServiceSpy.getDisplayNameForAccordion).toHaveBeenCalledWith(
      APP_KEYS.QR_CODE_GENERATOR,
    );
  });

  it('should open source link for the selected accordion and log the analytics event', () => {
    component.selectedAccordion = APP_KEYS.QR_CODE_GENERATOR;
    component.onGetSourceCode();

    expect(utilsServiceSpy.getSourceLinkPathForAccordion).toHaveBeenCalledWith(
      APP_KEYS.QR_CODE_GENERATOR,
    );
    expect(firebaseAnalyticsServiceSpy.logEvent).toHaveBeenCalledWith(
      'get_source_code',
      { repo: APP_KEYS.QR_CODE_GENERATOR, app: APPS.LANDING_PAGE },
    );
  });
});
