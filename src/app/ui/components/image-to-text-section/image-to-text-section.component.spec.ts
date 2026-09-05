import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { UtilsService } from '@app/services/utils.service';
import { APPS, APP_KEYS, AppKey } from '@app/shared/GitHubConstants';
import { ImageToTextSectionComponent } from '@ui/components/image-to-text-section/image-to-text-section.component';
import { createTranslateServiceMock } from '@testing/translate-service.mock';
import { PrivacyService } from 'src/app/privacy/services/privacy.service';

describe('ImageToTextSectionComponent', () => {
  const nativeDownloadUrl =
    'https://play.google.com/store/apps/details?id=at.zcontrol.zoe.image-to-text';
  const sourceCodeUrl = 'https://github.com/zoechbauer/z-control-image-to-text';
  const webAppUrl = 'https://z-control-image-to-text.web.app';

  let component: ImageToTextSectionComponent;
  let fixture: ComponentFixture<ImageToTextSectionComponent>;
  let utilsServiceSpy: jasmine.SpyObj<UtilsService>;
  let modalControllerSpy: jasmine.SpyObj<any>;
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
      (_lang: string, selectedSubAccordion: string, value: string) => {
        if (selectedSubAccordion === value) {
          return `Collapse ${value}`;
        }
        return `Expand ${value}`;
      },
    );

    privacyServiceSpy = jasmine.createSpyObj('PrivacyService', [
      'getPrivacyPolicy',
      'getPolicyName',
    ]);

    modalControllerSpy = jasmine.createSpyObj('ModalController', ['create']);

    activatedRouteSpy = {
      snapshot: {
        queryParams: {},
      },
    };

    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), ImageToTextSectionComponent],
      providers: [
        {
          provide: TranslateService,
          useValue: createTranslateServiceMock(),
        },
        { provide: UtilsService, useValue: utilsServiceSpy },
        { provide: 'ModalController', useValue: modalControllerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: PrivacyService, useValue: privacyServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageToTextSectionComponent);
    component = fixture.componentInstance;
    
    const selectedAccordion = APP_KEYS.IMAGE_TO_TEXT as AppKey;
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
    component.selectedSubAccordion = 'I2T Image to Text';

    expect(component.getAccordionTooltip('I2T Image to Text')).toBe(
      'Collapse I2T Image to Text',
    );
    expect(component.getAccordionTooltip('MLT Translator')).toBe(
      'Expand MLT Translator',
    );
  });

  it('should update selectedSubAccordion when subAccordionChange is called', () => {
    let event = { detail: { value: 'I2T Image to Text' } } as CustomEvent;
    component.subAccordionChange(event);
    expect(component.selectedSubAccordion).toBe('I2T Image to Text');

    event = { detail: { value: undefined } } as CustomEvent;
    component.subAccordionChange(event);
    expect(component.selectedSubAccordion).toBe('');

    event = { detail: { value: '' } } as CustomEvent;
    component.subAccordionChange(event);
    expect(component.selectedSubAccordion).toBe('');
  });
});
