import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { GetSourceCodeComponent } from '@ui/components/get-source-code/get-source-code.component';
import { createTranslateServiceMock } from '@testing/translate-service.mock';
import { UtilsService } from 'src/app/services/utils.service';

describe('GetSourceCodeComponent', () => {
  let component: GetSourceCodeComponent;
  let fixture: ComponentFixture<GetSourceCodeComponent>;
  let utilsServiceSpy: jasmine.SpyObj<UtilsService>;

  beforeEach(waitForAsync(() => {
    utilsServiceSpy = jasmine.createSpyObj('UtilsService', ['getDisplayNameForAccordion', 'getSourceLinkPathForAccordion']);
    
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        IonicModule.forRoot(),
        TranslateModule.forRoot(),
        GetSourceCodeComponent,
      ],
      providers: [
        {
          provide: TranslateService,
          useValue: createTranslateServiceMock(),
        },
        { provide: UtilsService, useValue: utilsServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GetSourceCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
