import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { PrivacyPolicyComponent } from '@ui/components/privacy-policy/privacy-policy.component';
import { createTranslateServiceMock } from '@testing/translate-service.mock';
import { FirebaseFirestoreLandingPageVisitService } from 'src/app/services/firebase-firestore-landing-page-visit.service';
import { EventEnum } from 'src/app/shared/enums';

describe('PrivacyPolicyComponent', () => {
  let component: PrivacyPolicyComponent;
  let fixture: ComponentFixture<PrivacyPolicyComponent>;
  let activatedRouteSpy: any;
  let fbLandingPageVisitServiceSpy: jasmine.SpyObj<FirebaseFirestoreLandingPageVisitService>;

  beforeEach(waitForAsync(() => {
    activatedRouteSpy = {
      snapshot: {
        queryParams: {},
      },
    };
    fbLandingPageVisitServiceSpy = jasmine.createSpyObj(
      'FirebaseFirestoreLandingPageVisitService',
      ['logLandingPageVisit'],
    );

    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        IonicModule.forRoot(),
        TranslateModule.forRoot(),
        PrivacyPolicyComponent,
      ],
      providers: [
        {
          provide: TranslateService,
          useValue: createTranslateServiceMock(),
        },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        {
          provide: FirebaseFirestoreLandingPageVisitService,
          useValue: fbLandingPageVisitServiceSpy,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PrivacyPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('logPrivacyPolicyVisit', () => {
    it('should log privacy policy visit if analytics is disabled', () => {
      component.isAnalyticsEnabled = false;
      component.logPrivacyPolicyVisit();

      expect(
        fbLandingPageVisitServiceSpy.logLandingPageVisit,
      ).toHaveBeenCalledWith(false, EventEnum.READ_POLICY_FROM_SETTINGS);
    });

    it('should not log privacy policy visit if analytics is enabled', () => {
      component.isAnalyticsEnabled = true;
      component.logPrivacyPolicyVisit();

      expect(
        fbLandingPageVisitServiceSpy.logLandingPageVisit,
      ).not.toHaveBeenCalled();
    });
  });
});
