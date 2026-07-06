import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HeaderComponent } from './header.component';
import { UtilsService } from '@app/services/utils.service';
import { Router } from '@angular/router';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  const utilsServiceMock = {
    onLogoClicked: jasmine.createSpy('onLogoClicked'),
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), HeaderComponent],
      providers: [{ provide: UtilsService, useValue: utilsServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  describe('Class logic', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should call utilsService.onLogoClicked when openFooter is called', async () => {
      const utilsService = TestBed.inject(UtilsService);
      component.openFooter();
      expect(utilsService.onLogoClicked).toHaveBeenCalled();
    });

    it('should return to home when goBack is called', () => {
      const router = TestBed.inject(Router);
      spyOn<any>(router, 'navigate');

      component.goBack();
      expect((router as any).navigate).toHaveBeenCalledWith(['/home']);
    });

    it('should update isMobile on window resize', () => {
      Object.defineProperty(window, 'innerWidth', {
        configurable: true,
        value: 500,
      });
      globalThis.window.dispatchEvent(new Event('resize'));
      expect(component.isMobile).toBeTrue();

      Object.defineProperty(window, 'innerWidth', {
        configurable: true,
        value: 800,
      });
      globalThis.window.dispatchEvent(new Event('resize'));
      expect(component.isMobile).toBeFalse();
    });

    it('should remove resize event listener on destroy', () => {
      const removeEventListenerSpy = spyOn(
        globalThis.window,
        'removeEventListener',
      ).and.callThrough();
      component.ngOnDestroy();
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'resize',
        jasmine.any(Function),
      );
    });
  });

  describe('Template rendering', () => {
    it('should render the header component', () => {
      const headerElement = fixture.nativeElement.querySelector('ion-header');
      expect(headerElement).toBeTruthy();
    });

    it('should conditionally render the back button', async () => {
      component.showBackButton = true;
      fixture.detectChanges();
      await fixture.whenStable();

      const backButton = fixture.nativeElement.querySelector(
        'ion-buttons.back-button ion-button',
      );
      expect(backButton).toBeTruthy();
    });

    it('should not render the back button when showBackButton is false', async () => {
      component.showBackButton = false;
      fixture.detectChanges();
      await fixture.whenStable();

      const backButton = fixture.nativeElement.querySelector(
        'ion-buttons.back-button ion-button',
      );
      expect(backButton).toBeFalsy();
    });

    it('should display the selected accordion name', async () => {
      component.selectedAccordion = 'Test Accordion';
      fixture.detectChanges();
      await fixture.whenStable();

      const selectedAccordion = fixture.nativeElement.querySelector(
        '.selected-accordion',
      );
      expect(selectedAccordion.textContent).toContain('Test Accordion');
    });

    it('should not display the selected accordion name when empty', async () => {
      component.selectedAccordion = '';
      fixture.detectChanges();
      await fixture.whenStable();

      const selectedAccordion = fixture.nativeElement.querySelector(
        '.selected-accordion',
      );
      expect(selectedAccordion).toBeFalsy();
    });

    it('should display the logo and trigger openFooter on click', async () => {
      const logoElement = fixture.nativeElement.querySelector('.logo');
      logoElement.click();
      expect(utilsServiceMock.onLogoClicked).toHaveBeenCalled();
    });

    it('should display logo text and title', async () => {
      const logoTextElement =
        fixture.nativeElement.querySelector('.logo-title');
      const titleElement = fixture.nativeElement.querySelector('.app-title');

      expect(logoTextElement).toBeTruthy();
      expect(logoTextElement.textContent).toContain('z-control');
      expect(titleElement).toBeTruthy();
      expect(titleElement.textContent).toContain('Apps & Tools');
    });
  });
});
