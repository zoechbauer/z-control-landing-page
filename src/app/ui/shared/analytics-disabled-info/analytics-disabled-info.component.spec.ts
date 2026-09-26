import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { AnalyticsDisabledInfoComponent } from './analytics-disabled-info.component';
import { createTranslateServiceMock } from '@testing/translate-service.mock';
import { APPS } from 'src/app/shared/github.constants';
import { Tab } from 'src/app/shared/enums';

describe('AnalyticsDisabledInfoComponent', () => {
  let component: AnalyticsDisabledInfoComponent;
  let fixture: ComponentFixture<AnalyticsDisabledInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), AnalyticsDisabledInfoComponent],
      providers: [
        {
          provide: TranslateService,
          useValue: createTranslateServiceMock(),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AnalyticsDisabledInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Template rendering', () => {
    it('should always display the app name on main page and settings page', () => {
      const testCases = [
        {
          appName: APPS.LANDING_PAGE,
          tab: Tab.MainFeature,
          enabled: true,
        },
        {
          appName: APPS.IMAGE_TO_TEXT,
          tab: Tab.MainFeature,
          enabled: true,
        },
        {
          appName: APPS.LANDING_PAGE,
          tab: Tab.Settings,
          enabled: true,
        },
        {
          appName: APPS.IMAGE_TO_TEXT,
          tab: Tab.Settings,
          enabled: true,
        },
        {
          appName: APPS.LANDING_PAGE,
          tab: Tab.MainFeature,
          enabled: false,
        },
        {
          appName: APPS.IMAGE_TO_TEXT,
          tab: Tab.MainFeature,
          enabled: false,
        },
        {
          appName: APPS.LANDING_PAGE,
          tab: Tab.Settings,
          enabled: false,
        },
        {
          appName: APPS.IMAGE_TO_TEXT,
          tab: Tab.Settings,
          enabled: false,
        },
      ];

      testCases.forEach(({ appName, tab, enabled }) => {
        component.tab = tab;
        component.isAnalyticsEnabled = enabled;
        component.appName = appName;
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.app-name')?.textContent).toContain(
          appName,
        );
      });
    });

    it('should not display disabled-info and tab class when analytics is enabled on main page and settings page', () => {
      const testCases = [
        {
          tab: Tab.MainFeature,
        },
        {
          tab: Tab.Settings,
        },
      ];

      testCases.forEach(({ tab }) => {
        component.tab = tab;
        component.isAnalyticsEnabled = true;
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.analytics-disabled-info')).toBeNull();
        expect(compiled.querySelector(`.class-${tab}`)).toBeNull();
      });
    });

    it('should display disabled-info and tab class when analytics is disabled on main page and settings page', () => {
      const testCases = [
        {
          tab: Tab.MainFeature,
        },
        {
          tab: Tab.Settings,
        },
      ];

      testCases.forEach(({ tab }) => {
        component.tab = tab;
        component.isAnalyticsEnabled = false;
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.analytics-disabled-info')).toBeTruthy();
        expect(compiled.querySelector(`.class-${tab}`)).toBeTruthy();
      });
    });

    it('shows class-settings only on settings page when analytics is disabled', () => {
      // Settings page -> should have the settings class (border)
      component.tab = Tab.Settings;
      component.isAnalyticsEnabled = false;
      fixture.detectChanges();

      const el = fixture.nativeElement.querySelector(
        '.analytics-disabled-info',
      ) as HTMLElement;
      expect(el).toBeTruthy();
      expect(el.classList.contains('class-settings')).toBeTrue();
      expect(el.classList.contains('class-main')).toBeFalse();

      // Main page -> should NOT have the settings class
      component.tab = Tab.MainFeature;
      component.isAnalyticsEnabled = false;
      fixture.detectChanges();

      const elMain = fixture.nativeElement.querySelector(
        '.analytics-disabled-info',
      ) as HTMLElement;
      expect(elMain).toBeTruthy();
      expect(elMain.classList.contains('class-settings')).toBeFalse();
      expect(elMain.classList.contains('class-main')).toBeTrue();
    });
  });
});
