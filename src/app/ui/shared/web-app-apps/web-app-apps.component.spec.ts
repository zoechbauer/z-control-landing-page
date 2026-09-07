import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WebAppAppsComponent } from './web-app-apps.component';
import { UtilsService } from 'src/app/services/utils.service';

describe('WebAppAppsComponent', () => {
  let component: WebAppAppsComponent;
  let fixture: ComponentFixture<WebAppAppsComponent>;
  let utilsServiceSpy: jasmine.SpyObj<UtilsService>;
  
  beforeEach(waitForAsync(() => {
    utilsServiceSpy = jasmine.createSpyObj('UtilsService', ['onOpenWebApp']);
    TestBed.configureTestingModule({
      declarations: [],
      imports: [IonicModule.forRoot(), WebAppAppsComponent],
      providers: [
        { provide: UtilsService, useValue: utilsServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WebAppAppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onOpenWebApp method of UtilsService', () => {
    component.selectedAccordion = "IONIC_SETUP";
    component.onOpenWebApp();
    expect(utilsServiceSpy.onOpenWebApp).toHaveBeenCalledWith("IONIC_SETUP");
  });
});
