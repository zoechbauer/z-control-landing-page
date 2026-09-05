import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { PrivacyPolicyAppsComponent } from './privacy-policy-apps.component';
import { UtilsService } from 'src/app/services/utils.service';
import { PrivacyService } from 'src/app/privacy';

describe('PrivacyPolicyAppsComponent', () => {
  let component: PrivacyPolicyAppsComponent;
  let fixture: ComponentFixture<PrivacyPolicyAppsComponent>;
  let utilsServiceSpy: jasmine.SpyObj<UtilsService>;
  let privacyServiceSpy: jasmine.SpyObj<PrivacyService>;
  let activatedRoute: jasmine.SpyObj<any>;

  beforeEach(waitForAsync(() => {
    utilsServiceSpy = jasmine.createSpyObj('UtilsService', [
      'getPrivacyPolicy',
      'getPolicyName',
      'getDisplayNameForAccordion'
    ]);

    activatedRoute = jasmine.createSpyObj('ActivatedRoute', ['snapshot']);

    privacyServiceSpy = jasmine.createSpyObj('PrivacyService', [
      'getPrivacyPolicy',
      'getPolicyName',
    ]);

    TestBed.configureTestingModule({
      declarations: [],
      imports: [IonicModule.forRoot(), PrivacyPolicyAppsComponent],
      providers: [
        { provide: UtilsService, useValue: utilsServiceSpy },
        { provide: PrivacyService, useValue: privacyServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PrivacyPolicyAppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
