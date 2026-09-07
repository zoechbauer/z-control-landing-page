import { TranslateService } from '@ngx-translate/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { createTranslateServiceMock } from '@testing/translate-service.mock';
import { FeedbackAccordionComponent } from '@ui/components/accordions/feedback-accordion.component';
import { UtilsService } from '@app/services/utils.service';

describe('FeedbackAccordionComponent', () => {
  let component: FeedbackAccordionComponent;
  let fixture: ComponentFixture<FeedbackAccordionComponent>;
  let utilsServiceSpy: jasmine.SpyObj<UtilsService>;

  beforeEach(() => {
    utilsServiceSpy = jasmine.createSpyObj('UtilsService', [
      'getDisplayNameForAccordion'
    ]);

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
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedbackAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
