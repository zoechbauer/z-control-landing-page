import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';

import { PrivacyPolicyAccordionComponent } from '@ui/components/accordions/privacy-policy-accordion.component';
import { createTranslateServiceMock } from '@testing/translate-service.mock';
import { UtilsService } from '@app/services/utils.service';
import { FirebaseFirestoreLandingPageVisitService } from '@app/services/firebase-firestore-landing-page-visit.service';

describe('PrivacyPolicyAccordionComponent', () => {
  let component: PrivacyPolicyAccordionComponent;
  let fixture: ComponentFixture<PrivacyPolicyAccordionComponent>;
  let activatedRouteSpy: any;
  let utilsServiceSpy: jasmine.SpyObj<UtilsService>;
  let fbLandingPageVisitServiceSpy: jasmine.SpyObj<FirebaseFirestoreLandingPageVisitService>;

  beforeEach(async () => {
    activatedRouteSpy = {
      snapshot: {
        queryParams: {},
      },
    };
    utilsServiceSpy = jasmine.createSpyObj('UtilsService', ['getSettingsAccordionTooltip']);
        fbLandingPageVisitServiceSpy = jasmine.createSpyObj(
      'FirebaseFirestoreLandingPageVisitService',
      ['logLandingPageVisit'],
    );

    await TestBed.configureTestingModule({
      imports: [PrivacyPolicyAccordionComponent],
      providers: [
        {
          provide: TranslateService,
          useValue: createTranslateServiceMock(),
        },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: UtilsService, useValue: utilsServiceSpy },
        {
          provide: FirebaseFirestoreLandingPageVisitService,
          useValue: fbLandingPageVisitServiceSpy,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PrivacyPolicyAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
