import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, Platform, NavController } from '@ionic/angular';
import { ModalController } from '@ionic/angular/standalone';
import { RouterTestingModule } from '@angular/router/testing';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { of, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { AppComponent } from './app.component';
import { FirebaseAnalyticsService } from './services/firebase-analytics.service';
import { createTranslateServiceMock } from './testing/translate-service.mock';
import { LocalStorageService } from './services/local-storage.service';
import { UtilsService } from './services/utils.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let firebaseAnalyticsServiceSpy: jasmine.SpyObj<FirebaseAnalyticsService>;
  let localStorageServiceSpy: jasmine.SpyObj<LocalStorageService>;
  let routerSpy: jasmine.SpyObj<Router>;

  let navControllerSpy: jasmine.SpyObj<NavController>;

  const logoClickedSub = new Subject<boolean>();
  const _isSmallScreen = false;
  const utilsServiceMock = {
    get isSmallScreen() {
      return _isSmallScreen;
    },
    isShowIonTabBar: false,
    navigateToTab: jasmine.createSpy('navigateToTab'),
    onLogoClicked: jasmine
      .createSpy('onLogoClicked')
      .and.returnValue(logoClickedSub.next(true)),
    openHelpModal: jasmine
      .createSpy('openHelpModal')
      .and.returnValue(Promise.resolve()),
    navigateToTabWithParams: jasmine.createSpy('navigateToTabWithParams'),
    logoClickedSub,
    logoClicked$: logoClickedSub.asObservable(),
  };

  beforeEach(waitForAsync(() => {
    modalControllerSpy = jasmine.createSpyObj('ModalController', ['create']);
    firebaseAnalyticsServiceSpy = jasmine.createSpyObj(
      'FirebaseAnalyticsService',
      ['logEvent', 'init', 'enableCollection'],
    );
    localStorageServiceSpy = jasmine.createSpyObj('LocalStorageService', [
      'initializeServicesAsync',
      'getAnalyticsConsent',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    navControllerSpy = jasmine.createSpyObj('NavController', [
      'navigateRoot',
      'navigateBack',
      'pop',
    ]);

    TestBed.configureTestingModule({
      imports: [
        AppComponent,
        RouterTestingModule.withRoutes([]),
        IonicModule.forRoot(),
      ],
      providers: [
        {
          provide: TranslateService,
          useValue: createTranslateServiceMock(),
        },
        {
          provide: LocalStorageService,
          useValue: localStorageServiceSpy,
        },
        {
          provide: UtilsService,
          useValue: utilsServiceMock,
        },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: NavController, useValue: navControllerSpy },
        {
          provide: FirebaseAnalyticsService,
          useValue: firebaseAnalyticsServiceSpy,
        },
        {
          provide: Platform,
          useValue: { ready: () => Promise.resolve() },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  }));

  it('should create the app', async () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit method', () => {
    it('should call fa.init on ngOnInit', async () => {
      firebaseAnalyticsServiceSpy.enableCollection.calls.reset();
      component.ngOnInit();
      await fixture.whenStable();

      expect(firebaseAnalyticsServiceSpy.init).toHaveBeenCalled();
    });

    it('should log error when fa.init throws an error', async () => {
      const error = new Error('Test error');
      firebaseAnalyticsServiceSpy.init.and.throwError(error.message);
      localStorageServiceSpy.initializeServicesAsync.and.resolveTo(undefined);
      spyOn(console, 'error');

      firebaseAnalyticsServiceSpy.enableCollection.calls.reset();
      component.ngOnInit();
      await fixture.whenStable();

      expect(console.error).toHaveBeenCalledWith('fa.init error', error);
    });

    it('should enable collection when local storage consent is given', async () => {
      localStorageServiceSpy.getAnalyticsConsent.and.returnValue(
        Promise.resolve(true),
      );
      firebaseAnalyticsServiceSpy.enableCollection.calls.reset();

      component.ngOnInit();
      await fixture.whenStable();

      expect(firebaseAnalyticsServiceSpy.enableCollection).toHaveBeenCalledWith(
        true,
      );
    });

    it('should disable collection when local storage consent is not given', async () => {
      localStorageServiceSpy.getAnalyticsConsent.and.returnValue(
        Promise.resolve(false),
      );

      firebaseAnalyticsServiceSpy.enableCollection.calls.reset();
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

  describe('should add or remove classes on body.div element based on platform and tabs bar visibility', () => {
    it('should add web-app-width to body for web platform', async () => {
      component.isNativeApp = false;
      fixture.detectChanges();

      const bodyDiv = fixture.nativeElement.querySelector('div');
      expect(bodyDiv?.classList.contains('web-app-width')).toBeTrue();
    });

    it('should add native-app-height-show-tabs-bar for native platform with tabs bar', async () => {
      component.isNativeApp = true;
      component.showTabsBar = true;
      fixture.detectChanges();

      const bodyDiv = fixture.nativeElement.querySelector('div');
      expect(
        bodyDiv?.classList.contains('native-app-height-show-tabs-bar'),
      ).toBeTrue();
    });

    it('should not add native-app-height-show-tabs-bar for native platform without tabs bar', async () => {
      component.isNativeApp = true;
      component.showTabsBar = false;
      fixture.detectChanges();

      const bodyDiv = fixture.nativeElement.querySelector('div');
      expect(bodyDiv.classList.contains('native-app-height-show-tabs-bar'))
        .withContext('native-app-height-show-tabs-bar class')
        .toBeFalse();
      expect(bodyDiv.classList.contains('native-app-height-hide-tabs-bar'))
        .withContext('native-app-height-hide-tabs-bar class')
        .toBeTrue();
    });
  });

  describe('openFooter method', () => {
    it('should call onLogoClicked after 1 second', async () => {
      component['openFooter']();
      await new Promise((resolve) => setTimeout(resolve, 1100));

      expect((component as any).utilsService.onLogoClicked).toHaveBeenCalled();
    });

    it('should open footer when Firebase is not enabled in local storage', async () => {
      localStorageServiceSpy.getAnalyticsConsent.and.returnValue(
        new Promise((resolve) => resolve(false)),
      );

      component.ngOnInit();
      // trigger platform.ready() callback so openFooter runs
      await new Promise((resolve) => setTimeout(resolve, 1100));

      expect((component as any).utilsService.onLogoClicked).toHaveBeenCalled();
    });
  });
});
