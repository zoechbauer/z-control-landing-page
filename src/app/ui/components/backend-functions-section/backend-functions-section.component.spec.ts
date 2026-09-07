import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { BackendFunctionsSectionComponent } from '@ui/components/backend-functions-section/backend-functions-section.component';
import { UtilsService } from '@app/services/utils.service';
import { APP_KEYS, AppKey } from '@app/shared/GitHubConstants';
import { createTranslateServiceMock } from '@testing/translate-service.mock';

describe('BackendFunctionsSectionComponent', () => {
  let component: BackendFunctionsSectionComponent;
  let fixture: ComponentFixture<BackendFunctionsSectionComponent>;
  let utilsServiceSpy: jasmine.SpyObj<UtilsService>;

  beforeEach(waitForAsync(() => {
    utilsServiceSpy = jasmine.createSpyObj('UtilsService', [
      'openChangelog',
      'openMarkdownDoc',
      'getAccordionTooltip',
      'getSubAccordionTooltip',
      'getWebLinkPathForAccordion',
      'getDisplayNameForAccordion',
      'openGitHubAnalytics'
    ]);
    utilsServiceSpy.getSubAccordionTooltip.and.callFake(
  (_lang: string, selectedSubAccordion: string, value: string) => {
    if (selectedSubAccordion === value) {
      return `Collapse ${value}`;
    }
    return `Expand ${value}`;
  },
);

    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), BackendFunctionsSectionComponent],
      providers: [
        { provide: UtilsService, useValue: utilsServiceSpy },
        {
          provide: TranslateService,
          useValue: createTranslateServiceMock(),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BackendFunctionsSectionComponent);
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

  it('should open GitHub analytics when onOpenGitHubAnalytics is called', async () => {
    const selectedAccordion = APP_KEYS.BACKEND_FUNCTIONS as AppKey;
    component.parameters = {
      appSectionParameters: {
        selectedAccordion: selectedAccordion,
      },
    } as any;

    await component.onOpenGitHubAnalytics();
    expect(utilsServiceSpy.openGitHubAnalytics).toHaveBeenCalledWith(
      APP_KEYS.BACKEND_FUNCTIONS as AppKey,
      'en',
    );
  });

  it('should call utilsService.openMarkdownDoc when onOpenMarkdownDoc is called', async () => {
    const docPath = 'assets/some-folder/test-doc.md';
    await component.onOpenMarkdownDoc(docPath);
    expect(utilsServiceSpy.openMarkdownDoc).toHaveBeenCalledWith(docPath);
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
  });
});
