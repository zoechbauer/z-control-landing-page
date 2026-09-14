import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';

import { PrivacyPolicyAccordionComponent } from '@ui/components/accordions/privacy-policy-accordion.component';
import { createTranslateServiceMock } from '@testing/translate-service.mock';
import { UtilsService } from '@app/services/utils.service';

describe('PrivacyPolicyAccordionComponent', () => {
  let component: PrivacyPolicyAccordionComponent;
  let fixture: ComponentFixture<PrivacyPolicyAccordionComponent>;
  let activatedRouteSpy: any;
  let utilsServiceSpy: jasmine.SpyObj<UtilsService>;

  beforeEach(async () => {
    activatedRouteSpy = {
      snapshot: {
        queryParams: {},
      },
    };
    utilsServiceSpy = jasmine.createSpyObj('UtilsService', ['getSettingsAccordionTooltip']);

    await TestBed.configureTestingModule({
      imports: [PrivacyPolicyAccordionComponent],
      providers: [
        {
          provide: TranslateService,
          useValue: createTranslateServiceMock(),
        },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: UtilsService, useValue: utilsServiceSpy },
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
