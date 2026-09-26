import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { UtilsService } from '@app/services/utils.service';
import { PrivacyService } from '@app/privacy/services/privacy.service';
import { MultiLanguageTranslatorSectionComponent } from '@ui/components/multi-language-translator-section/multi-language-translator-section.component';
import { createTranslateServiceMock } from '@testing/translate-service.mock';
import { APP_KEYS, AppKey } from 'src/app/shared/github.constants';

describe('MultiLanguageTranslatorSectionComponent', () => {
  let component: MultiLanguageTranslatorSectionComponent;
  let fixture: ComponentFixture<MultiLanguageTranslatorSectionComponent>;
  let utilsServiceSpy: jasmine.SpyObj<UtilsService>;
  let activatedRouteSpy: any;
  let privacyServiceSpy: jasmine.SpyObj<PrivacyService>;

  beforeEach(waitForAsync(() => {
    utilsServiceSpy = jasmine.createSpyObj('UtilsService', [
      'openChangelog',
      'openMarkdownDoc',
      'getAccordionTooltip',
      'getSubAccordionTooltip',
      'getWebLinkPathForAccordion',
      'getDisplayNameForAccordion',
    ]);
    utilsServiceSpy.getSubAccordionTooltip.and.callFake(
      (selectedSubAccordion: string, value: string) => {
        if (selectedSubAccordion === value) {
          return `Collapse ${value}`;
        }
        return `Expand ${value}`;
      },
    );

    activatedRouteSpy = {
      snapshot: {
        queryParams: {},
      },
    };

    privacyServiceSpy = jasmine.createSpyObj('PrivacyService', [
      'getPrivacyPolicy',
      'getPolicyName',
    ]);

    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), MultiLanguageTranslatorSectionComponent],
      providers: [
        { provide: UtilsService, useValue: utilsServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: PrivacyService, useValue: privacyServiceSpy },
        {
          provide: TranslateService,
          useValue: createTranslateServiceMock(),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MultiLanguageTranslatorSectionComponent);
    component = fixture.componentInstance;

    const selectedAccordion = APP_KEYS.MULTI_LANGUAGE_TRANSLATOR as AppKey;
    component.parameters = {
      appSectionParameters: {
        selectedAccordion: selectedAccordion,
        currentMainAccordion: selectedAccordion,
        selectedLanguage: 'en',
      },
    } as any;
    component.selectedSubAccordion = selectedAccordion;

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return correct tooltip for subaccordion', () => {
    component.selectedSubAccordion = 'IS Ionic Setup';

    expect(component.getAccordionTooltip('IS Ionic Setup')).toBe(
      'Collapse IS Ionic Setup',
    );
    expect(component.getAccordionTooltip('MLT Translator')).toBe(
      'Expand MLT Translator',
    );
  });

  it('should update selectedSubAccordion when subAccordionChange is called', () => {
    let event = { detail: { value: 'MLT Translator' } } as CustomEvent;
    component.subAccordionChange(event);
    expect(component.selectedSubAccordion).toBe('MLT Translator');

    event = { detail: { value: undefined } } as CustomEvent;
    component.subAccordionChange(event);
    expect(component.selectedSubAccordion).toBe('');

    event = { detail: { value: '' } } as CustomEvent;
    component.subAccordionChange(event);
    expect(component.selectedSubAccordion).toBe('');

    component.selectedSubAccordion = 'something';
    component.subAccordionChange(undefined);
    expect(component.selectedSubAccordion).toBe('');
  });
});
