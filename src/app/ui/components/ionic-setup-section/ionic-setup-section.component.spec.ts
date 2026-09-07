import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { UtilsService } from '@app/services/utils.service';
import { PrivacyService } from '@app/privacy/services/privacy.service';
import { APPS, APP_KEYS, AppKey } from '@app/shared/GitHubConstants';
import { IonicSetupSectionComponent } from '@ui/components/ionic-setup-section/ionic-setup-section.component';
import { createTranslateServiceMock } from '@testing/translate-service.mock';
describe('IonicSetupSectionComponent', () => {
  const nativeDownloadUrl =
    'https://play.google.com/store/apps/details?id=at.zcontrol.zoe.ionicsetup';
  const sourceCodeUrl = 'https://github.com/zoechbauer/z-control-ionic-setup';
  const webAppUrl = 'https://z-control-ionic-setup.web.app';

  let component: IonicSetupSectionComponent;
  let fixture: ComponentFixture<IonicSetupSectionComponent>;
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

    modalControllerSpy = jasmine.createSpyObj('ModalController', ['create']);

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
      imports: [IonicModule.forRoot(), IonicSetupSectionComponent],
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

    fixture = TestBed.createComponent(IonicSetupSectionComponent);
    component = fixture.componentInstance;
    
    const selectedAccordion = APP_KEYS.IONIC_SETUP as AppKey;
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
    let event = { detail: { value: 'IS Ionic Setup' } } as CustomEvent;
    component.subAccordionChange(event);
    expect(component.selectedSubAccordion).toBe('IS Ionic Setup');

    event = { detail: { value: undefined } } as CustomEvent;
    component.subAccordionChange(event);
    expect(component.selectedSubAccordion).toBe('');

    event = { detail: { value: '' } } as CustomEvent;
    component.subAccordionChange(event);
    expect(component.selectedSubAccordion).toBe('');
  });
});
