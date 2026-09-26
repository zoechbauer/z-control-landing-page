import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';

import { LanguageAccordionComponent } from '@ui/components/accordions/language-accordion.component';
import { createTranslateServiceMock } from '@testing/translate-service.mock';
import { UtilsService } from '@app/services/utils.service';
import { FirebaseFirestoreLandingPageVisitService } from 'src/app/services/firebase-firestore-landing-page-visit.service';
import { EventEnum } from 'src/app/shared/enums';

describe('LanguageAccordionComponent', () => {
  let component: LanguageAccordionComponent;
  let fixture: ComponentFixture<LanguageAccordionComponent>;
  let utilsServiceSpy: jasmine.SpyObj<UtilsService>;
  let fbLandingPageVisitServiceSpy: jasmine.SpyObj<FirebaseFirestoreLandingPageVisitService>;

  function getNormalizedText(): string {
    return (fixture.nativeElement.textContent || '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  beforeEach(async () => {
    utilsServiceSpy = jasmine.createSpyObj('UtilsService', [
      'getSettingsAccordionTooltip',
    ]);
    fbLandingPageVisitServiceSpy = jasmine.createSpyObj(
      'FirebaseFirestoreLandingPageVisitService',
      ['logLandingPageVisit'],
    );

    await TestBed.configureTestingModule({
      imports: [LanguageAccordionComponent],
      providers: [
        { provide: TranslateService, useValue: createTranslateServiceMock() },
        { provide: UtilsService, useValue: utilsServiceSpy },
        {
          provide: FirebaseFirestoreLandingPageVisitService,
          useValue: fbLandingPageVisitServiceSpy,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('class logic', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should call logLanguageChange on language change', () => {
      spyOn<any>(component, 'logLanguageChange');

      component.lang = 'de';
      component.onLanguageChange({ detail: { value: 'de' } } as any);
      expect((component as any).logLanguageChange).toHaveBeenCalledWith('de');

      component.lang = 'en';
      component.onLanguageChange({ detail: { value: 'en' } } as any);
      expect((component as any).logLanguageChange).toHaveBeenCalledWith('en');
    });

    describe('logLanguageChange', () => {
      it('should log language change to DE if analytics is disabled', () => {
        component.isAnalyticsEnabled = false;
        (component as any).logLanguageChange('de');

        expect(
          fbLandingPageVisitServiceSpy.logLandingPageVisit,
        ).toHaveBeenCalledWith(false, EventEnum.LANG_CHG_DE);
      });

      it('should log language change to EN if analytics is disabled', () => {
        component.isAnalyticsEnabled = false;
        (component as any).logLanguageChange('en');

        expect(
          fbLandingPageVisitServiceSpy.logLandingPageVisit,
        ).toHaveBeenCalledWith(false, EventEnum.LANG_CHG_EN);
      });

      it('should not log language change if analytics is enabled', () => {
        component.isAnalyticsEnabled = true;
        (component as any).logLanguageChange('en');

        expect(
          fbLandingPageVisitServiceSpy.logLandingPageVisit,
        ).not.toHaveBeenCalled();
      });
    });
  });

  describe('template rendering', () => {
    it('should render german template when lang is de', () => {
      component.lang = 'de';
      fixture.detectChanges();

      const text = getNormalizedText();

      expect(text).toContain(
        'Die App-Sprache wird standardmäßig von den Spracheinstellungen Ihres Geräts bestimmt.',
      );
      expect(text).not.toContain(
        "The app language defaults to your device's language setting.",
      );
    });

    it('should render english template when lang is en', () => {
      component.lang = 'en';
      fixture.detectChanges();

      const text = getNormalizedText();

      expect(text).toContain(
        "The app language defaults to your device's language setting.",
      );
      expect(text).not.toContain(
        'Die App-Sprache wird standardmäßig von den Spracheinstellungen Ihres Geräts bestimmt.',
      );
    });

    it('should fallback to english template when lang is not de', () => {
      component.lang = 'fr';
      fixture.detectChanges();

      const text = getNormalizedText();

      expect(text).toContain(
        "The app language defaults to your device's language setting.",
      );
      expect(text).not.toContain(
        'Die App-Sprache wird standardmäßig von den Spracheinstellungen Ihres Geräts bestimmt.',
      );
    });

    it('should render language select options for en and de', () => {
      fixture.detectChanges();

      const enOption = fixture.nativeElement.querySelector(
        'ion-select-option[value="en"]',
      );
      const deOption = fixture.nativeElement.querySelector(
        'ion-select-option[value="de"]',
      );

      expect(enOption).toBeTruthy();
      expect(deOption).toBeTruthy();
    });
  });
});
