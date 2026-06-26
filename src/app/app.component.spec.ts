import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular/standalone';
import { NavigationEnd, provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';

import { AppComponent } from './app.component';
import { FirebaseAnalyticsService } from './services/firebase-analytics.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let firebaseAnalyticsServiceSpy: jasmine.SpyObj<FirebaseAnalyticsService>;

  beforeEach(() => {
    modalControllerSpy = jasmine.createSpyObj('ModalController', ['create']);
    firebaseAnalyticsServiceSpy = jasmine.createSpyObj(
      'FirebaseAnalyticsService',
      ['logEvent', 'init', 'enableCollection'],
    );

    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        { provide: ModalController, useValue: modalControllerSpy },
        {
          provide: FirebaseAnalyticsService,
          useValue: firebaseAnalyticsServiceSpy,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', async () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit method', () => {
    it('should call fa.init on ngOnInit', () => {
      component.ngOnInit();
      expect(firebaseAnalyticsServiceSpy.init).toHaveBeenCalled();
    });

    it('should log error when fa.init throws an error', () => {
      const error = new Error('Test error');
      firebaseAnalyticsServiceSpy.init.and.throwError(error.message);
      spyOn(console, 'error');

      component.ngOnInit();
      expect(console.error).toHaveBeenCalledWith('fa.init error', error);
    });

    it('should enable collection when local storage consent is given', async () => {
      spyOn(
        (component as any).localStorageService,
        'getAnalyticsConsent',
      ).and.returnValue(true);
      component.ngOnInit();
      await fixture.whenStable();
      expect(firebaseAnalyticsServiceSpy.enableCollection).toHaveBeenCalledWith(
        true,
      );
    });

    it('should disable collection when local storage consent is not given', async () => {
      // valid local storage consent values
     const analyticsConsentSpy = spyOn(
        (component as any).localStorageService,
        'getAnalyticsConsent',
      ).and.returnValue(false);
      component.ngOnInit();
      await fixture.whenStable();

      expect(firebaseAnalyticsServiceSpy.enableCollection).toHaveBeenCalledWith(
        false,
      );

      // undefined local storage consent value
      analyticsConsentSpy.and.returnValue(undefined);
      component.ngOnInit();
      await fixture.whenStable();

      expect(firebaseAnalyticsServiceSpy.enableCollection).toHaveBeenCalledWith(
        false,
      );
    });

    it('should log page_view event on navigation', async () => {
      const mockNavigationEnd = new NavigationEnd(1, '/test', '/test');

      const mockEvents = of(mockNavigationEnd);
      (component as any).router = { events: mockEvents } as Router;

      component.ngOnInit();

      await fixture.whenStable();
      expect(firebaseAnalyticsServiceSpy.logEvent).toHaveBeenCalledWith(
        'page_view',
        {
          page_path: '/test',
          page_title: document.title,
        },
      );
    });
  });

  describe('openFooter method', () => {
    it('should call onLogoClicked after 1 second', async () => {
      spyOn((component as any).utilsService, 'onLogoClicked');
      component['openFooter']();
      await new Promise((resolve) => setTimeout(resolve, 1100));

      expect((component as any).utilsService.onLogoClicked).toHaveBeenCalled();
    });

    it('should open footer when Firebase is not enabled in local storage', async () => {
      spyOn(
        (component as any).localStorageService,
        'getAnalyticsConsent',
      ).and.returnValue(false);
      spyOn((component as any).utilsService, 'onLogoClicked');

      component.ngOnInit();
      await new Promise((resolve) => setTimeout(resolve, 1100));

      expect((component as any).utilsService.onLogoClicked).toHaveBeenCalled();
    });
  });
});
