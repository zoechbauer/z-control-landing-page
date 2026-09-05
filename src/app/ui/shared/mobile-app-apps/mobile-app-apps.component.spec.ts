import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { UtilsService } from 'src/app/services/utils.service';
import { MobileAppAppsComponent } from './mobile-app-apps.component';
import { createTranslateServiceMock } from 'src/app/testing/translate-service.mock';

describe('MobileAppAppsComponent', () => {
  let component: MobileAppAppsComponent;
  let fixture: ComponentFixture<MobileAppAppsComponent>;
  let utilsServiceSpy: jasmine.SpyObj<UtilsService>;

  beforeEach(waitForAsync(() => {
    utilsServiceSpy = jasmine.createSpyObj('UtilsService', [
      'getWebLinkPathForAccordion'
    ]);

    TestBed.configureTestingModule({
      declarations: [],
      imports: [IonicModule.forRoot(), MobileAppAppsComponent],
      providers: [
        { provide: UtilsService, useValue: utilsServiceSpy },
        { provide: TranslateService, useValue: createTranslateServiceMock() },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileAppAppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
