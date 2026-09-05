import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { SourceCodeAppsComponent } from './source-code-apps.component';
import { UtilsService } from 'src/app/services/utils.service';
import { FirebaseAnalyticsService } from 'src/app/services/firebase-analytics.service';
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
    firebaseAnalyticsServiceSpy = jasmine.createSpyObj('FirebaseAnalyticsService', [
      'logEvent',
    ]);

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
        { provide: FirebaseAnalyticsService, useValue: firebaseAnalyticsServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SourceCodeAppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
