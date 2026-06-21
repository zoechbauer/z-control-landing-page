import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular/standalone';

import { BackendFunctionsSectionComponent } from './backend-functions-section.component';
import { UtilsService } from 'src/app/services/utils.service';
import { FirebaseAnalyticsService } from 'src/app/services/firebase-analytics.service';

describe('BackendFunctionsSectionComponent', () => {
  let component: BackendFunctionsSectionComponent;
  let fixture: ComponentFixture<BackendFunctionsSectionComponent>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let utilsServiceSpy: jasmine.SpyObj<UtilsService>;

  beforeEach(waitForAsync(() => {
    modalControllerSpy = jasmine.createSpyObj('ModalController', ['create']);
    utilsServiceSpy = jasmine.createSpyObj('UtilsService', ['someMethod']);
    
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), BackendFunctionsSectionComponent],
      providers: [
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: UtilsService, useValue: utilsServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BackendFunctionsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
