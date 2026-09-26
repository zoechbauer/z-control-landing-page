import { TranslateService } from '@ngx-translate/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { createTranslateServiceMock } from '@testing/translate-service.mock';
import { FeedbackAccordionComponent } from '@ui/components/accordions/feedback-accordion.component';
import { UtilsService } from '@app/services/utils.service';
import { FirebaseFirestoreLandingPageVisitService } from '@app/services/firebase-firestore-landing-page-visit.service';
import { EventEnum } from 'src/app/shared/enums';

describe('FeedbackAccordionComponent', () => {
  let component: FeedbackAccordionComponent;
  let fixture: ComponentFixture<FeedbackAccordionComponent>;
  let utilsServiceSpy: jasmine.SpyObj<UtilsService>;
  let fbLandingPageVisitServiceSpy: jasmine.SpyObj<FirebaseFirestoreLandingPageVisitService>;

  beforeEach(() => {
    utilsServiceSpy = jasmine.createSpyObj('UtilsService', [
      'getDisplayNameForAccordion',
      'getSettingsAccordionTooltip',
    ]);

    fbLandingPageVisitServiceSpy = jasmine.createSpyObj(
      'FirebaseFirestoreLandingPageVisitService',
      ['logLandingPageVisit'],
    );

    TestBed.configureTestingModule({
      imports: [FeedbackAccordionComponent],
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
          provide: FirebaseFirestoreLandingPageVisitService,
          useValue: fbLandingPageVisitServiceSpy,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedbackAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('logSendFeedback', () => {
    it('should log send feedback if analytics is disabled', () => {
      component.isAnalyticsEnabled = false;
      component.logSendFeedback();

      expect(
        fbLandingPageVisitServiceSpy.logLandingPageVisit,
      ).toHaveBeenCalledWith(false, EventEnum.SEND_FEEDBACK);
    });

    it('should not log send feedback if analytics is enabled', () => {
      component.isAnalyticsEnabled = true;
      component.logSendFeedback();

      expect(
        fbLandingPageVisitServiceSpy.logLandingPageVisit,
      ).not.toHaveBeenCalled();
    });
  });
});
