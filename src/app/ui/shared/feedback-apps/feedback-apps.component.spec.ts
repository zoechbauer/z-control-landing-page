import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FeedbackAppsComponent } from './feedback-apps.component';
import { UtilsService } from 'src/app/services/utils.service';

describe('FeedbackAppsComponent', () => {
  let component: FeedbackAppsComponent;
  let fixture: ComponentFixture<FeedbackAppsComponent>;
  let utilsServiceSpy: jasmine.SpyObj<UtilsService>;

  beforeEach(waitForAsync(() => {
    utilsServiceSpy = jasmine.createSpyObj('UtilsService', [
      'getWebLinkPathForAccordion',
      'getDisplayNameForAccordion'
    ]);
    TestBed.configureTestingModule({
      declarations: [],
      imports: [IonicModule.forRoot(), FeedbackAppsComponent],
      providers: [
        { provide: UtilsService, useValue: utilsServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedbackAppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
