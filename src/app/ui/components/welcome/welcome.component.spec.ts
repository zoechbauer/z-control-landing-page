import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { WelcomeComponent } from '@ui/components/welcome/welcome.component';
import { UtilsService } from 'src/app/services/utils.service';

describe('WelcomeComponent', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;
  let utilsServiceSpy: jasmine.SpyObj<UtilsService>;

  beforeEach(waitForAsync(() => {
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: { params: {} },
      params: jasmine.createSpyObj('Observable', ['subscribe']),
    });

    utilsServiceSpy = jasmine.createSpyObj('UtilsService', ['isSmallScreen']);

    TestBed.configureTestingModule({
      declarations: [],
      imports: [IonicModule.forRoot(), WelcomeComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: UtilsService, useValue: utilsServiceSpy }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  describe('logic', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should emit event when onAnalyticsEnabledClick is called', () => {
      spyOn(component.isAnalyticsEnabledClicked, 'emit');
      component.onAnalyticsEnabledClick();
      expect(component.isAnalyticsEnabledClicked.emit).toHaveBeenCalled();
    });
  });

  describe('template rendering', () => {
    it('should render the component', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.welcome-info')).toBeTruthy();
    });

    it('should display welcome message if isAnalyticsEnabled is true', () => {
      component.isAnalyticsEnabled = true;
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;

      expect(compiled.querySelector('.welcome-info')).toBeTruthy();
      expect(compiled.querySelector('.feature')).toBeTruthy();
      expect(compiled.querySelector('.analytics-not-enabled')).toBeFalsy();
    });

    it('should display analytics not enabled message if isAnalyticsEnabled is false', () => {
      component.isAnalyticsEnabled = false;
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;

      expect(compiled.querySelector('.welcome-info')).toBeTruthy();
      expect(compiled.querySelector('.analytics-not-enabled')).toBeTruthy();
      expect(compiled.querySelector('.feature')).toBeFalsy();
    });

    it('should display the text in the selected language EN', () => {
      component.selectedLanguage = 'en';
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.welcome-info')?.textContent).toContain(
        'Welcome to z-control',
      );
    });

    it('should display the text in the selected language DE', () => {
      component.selectedLanguage = 'de';
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.welcome-info')?.textContent).toContain(
        'Willkommen bei z-control',
      );
    });
  });
});
