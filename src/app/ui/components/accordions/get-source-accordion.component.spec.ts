import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';

import { GetSourceAccordionComponent } from '@ui/components/accordions/get-source-accordion.component';
import { createTranslateServiceMock } from '@testing/translate-service.mock';
import { UtilsService } from 'src/app/services/utils.service';

describe('GetSourceAccordionComponent', () => {
  let component: GetSourceAccordionComponent;
  let fixture: ComponentFixture<GetSourceAccordionComponent>;
  let utilsServiceSpy: jasmine.SpyObj<UtilsService>;
  
  beforeEach(() => {
    utilsServiceSpy = jasmine.createSpyObj('UtilsService', ['getDisplayNameForAccordion']); 
    TestBed.configureTestingModule({
      imports: [GetSourceAccordionComponent],
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

    fixture = TestBed.createComponent(GetSourceAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
