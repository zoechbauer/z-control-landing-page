import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';

import { ChangeLogAccordionComponent } from './change-log-accordion.component';
import { createTranslateServiceMock } from '@testing/translate-service.mock';
import { UtilsService } from 'src/app/services/utils.service';

describe('ChangeLogAccordionComponent', () => {
  let component: ChangeLogAccordionComponent;
  let fixture: ComponentFixture<ChangeLogAccordionComponent>;
  let utilsServiceSpy: jasmine.SpyObj<UtilsService>;

  beforeEach(async () => {
    utilsServiceSpy = jasmine.createSpyObj('UtilsService', [
      'getPrivacyPolicy',
      'getPolicyName',
      'getDisplayNameForAccordion'
    ]);

    await TestBed.configureTestingModule({
      imports: [ChangeLogAccordionComponent],
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

    fixture = TestBed.createComponent(ChangeLogAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit ionChange event when openChangelog is called', () => {
    spyOn(component.ionChange, 'emit');
    component.openChangelog();
    expect(component.ionChange.emit).toHaveBeenCalled();
  });
});
