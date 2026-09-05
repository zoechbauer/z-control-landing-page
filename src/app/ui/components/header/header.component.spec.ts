import {
  ComponentFixture,
  TestBed,
  waitForAsync,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular/standalone';
import { TranslateService } from '@ngx-translate/core';

import { HeaderComponent } from '@ui/components/header/header.component';
import { UtilsService } from '@app/services/utils.service';
import { Tab } from '@app/shared/enums';
import { createTranslateServiceMock } from '@testing/translate-service.mock';
import { createUtilsServiceMock } from '@testing/utils-service.mock';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(waitForAsync(() => {
    const modalControllerSpy = jasmine.createSpyObj('ModalController', [
      'create',
    ]);
    const utilsServiceMock = createUtilsServiceMock();

    TestBed.configureTestingModule({
      declarations: [],
      imports: [IonicModule.forRoot(), HeaderComponent],
      providers: [
        { provide: TranslateService, useValue: createTranslateServiceMock() },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: UtilsService, useValue: utilsServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call utilsService.openHelpModal', async () => {
    const utilsService = TestBed.inject(UtilsService);
    await component.openHelpModal();
    expect(utilsService.openHelpModal).toHaveBeenCalled();
  });

  it('should return correct values for onMainFeatureTab and onSettingsTab', () => {
    component.currentTab = Tab.MainFeature;

    expect(component.onMainFeatureTab).toBeTrue();
    expect(component.onSettingsTab).toBeFalse();
  });

  describe('large screen', () => {
    it('should return true for isLargeScreen if utilsService.isSmallScreen is false', () => {
      const utilsService = TestBed.inject(UtilsService);
      Object.defineProperty(utilsService, 'isSmallScreen', {
        get: () => false,
      });
      expect(component.isLargeScreen).toBeTrue();
    });

    it('should return false for isLargeScreen if utilsService.isSmallScreen is true', () => {
      const utilsService = TestBed.inject(UtilsService);
      Object.defineProperty(utilsService, 'isSmallScreen', { get: () => true });
      expect(component.isLargeScreen).toBeFalse();
    });
  });

  describe('Navigation methods', () => {
    it('should call utilsService.navigateToTab with Tab.MainFeature and Tab.Settings', () => {
      const utilsService = TestBed.inject(UtilsService);
      component.goToMainFeature();
      expect(utilsService.navigateToTab).toHaveBeenCalledWith(Tab.MainFeature);

      component.goToSettings();
      expect(utilsService.navigateToTab).toHaveBeenCalledWith(Tab.Settings);
    });

    it('should navigate to Tab.Settings with params and emit logoClickedSub after 500ms', fakeAsync(() => {
      const utilsService = TestBed.inject(UtilsService);
      spyOn(utilsService.logoClickedSub, 'next');
      component.goToSettingsAndOpenFeedback();
      expect(utilsService.navigateToTabWithParams).toHaveBeenCalledWith(
        Tab.Settings,
        { open: 'z-control' },
      );
      tick(510);
      expect(utilsService.logoClickedSub.next).toHaveBeenCalledWith(true);
    }));

    it('should call utilsService.navigateToTab with currentTab on goBack', () => {
      const utilsService = TestBed.inject(UtilsService);
      component.currentTab = Tab.MainFeature;
      const event = new Event('click');
      spyOn(event, 'preventDefault');
      spyOn(event, 'stopPropagation');

      component.goBack(event);

      expect(utilsService.navigateToTab).toHaveBeenCalledWith(Tab.MainFeature);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
    });

    it('should go to settings and open feedback when goToSettingsAndOpenFeedback is called', fakeAsync(() => {
      const utilsService = TestBed.inject(UtilsService);
      spyOn(utilsService.logoClickedSub, 'next');
      component.goToSettingsAndOpenFeedback();

      expect(utilsService.navigateToTabWithParams).toHaveBeenCalledWith(
        Tab.Settings,
        { open: 'z-control' },
      );
      tick(510);
      expect(utilsService.logoClickedSub.next).toHaveBeenCalledWith(true);
    }));
  });
});
