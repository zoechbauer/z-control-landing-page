import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UtilsService } from 'src/app/services/utils.service';
import { HelpAppsComponent } from './help-apps.component';

describe('HelpAppsComponent', () => {
  let component: HelpAppsComponent;
  let fixture: ComponentFixture<HelpAppsComponent>;
  let utilsServiceSpy: jasmine.SpyObj<UtilsService>;

  beforeEach(waitForAsync(() => {
    utilsServiceSpy = jasmine.createSpyObj('UtilsService', [
      'getWebLinkPathForAccordion',
    ]);
    TestBed.configureTestingModule({
      declarations: [],
      imports: [IonicModule.forRoot(), HelpAppsComponent],
      providers: [
        { provide: UtilsService, useValue: utilsServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HelpAppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
