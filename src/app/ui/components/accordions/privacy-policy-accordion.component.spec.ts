import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';

import { PrivacyPolicyAccordionComponent } from '@ui/components/accordions/privacy-policy-accordion.component';
import { createTranslateServiceMock } from '@testing/translate-service.mock';

describe('PrivacyPolicyAccordionComponent', () => {
  let component: PrivacyPolicyAccordionComponent;
  let fixture: ComponentFixture<PrivacyPolicyAccordionComponent>;
  let activatedRouteSpy: any;

  beforeEach(async () => {
    activatedRouteSpy = {
      snapshot: {
        queryParams: {},
      },
    };

    await TestBed.configureTestingModule({
      imports: [PrivacyPolicyAccordionComponent],
      providers: [
        {
          provide: TranslateService,
          useValue: createTranslateServiceMock(),
        },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
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
