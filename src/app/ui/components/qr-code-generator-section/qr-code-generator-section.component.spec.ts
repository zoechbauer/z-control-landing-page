import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { UtilsService } from 'src/app/services/utils.service';
import { APPS } from 'src/app/shared/GitHubConstants';
import { QrCodeGeneratorSectionComponent } from '../..';

describe('QrCodeGeneratorSectionComponent', () => {
  const nativeDownloadUrl =
    'https://play.google.com/store/apps/details?id=at.zcontrol.zoe.qrcodegenerator';
  const sourceCodeUrl = 'https://github.com/zoechbauer/z-control-qr-code-generator';
  const webAppUrl = 'https://z-control-qr-code-generator.web.app';

  let component: QrCodeGeneratorSectionComponent;
  let fixture: ComponentFixture<QrCodeGeneratorSectionComponent>;
  let utilsServiceSpy: jasmine.SpyObj<UtilsService>;
  let modalControllerSpy: jasmine.SpyObj<any>;
  let activatedRouteSpy: any;

  beforeEach(waitForAsync(() => {
    utilsServiceSpy = jasmine.createSpyObj('UtilsService', [
      'openGitHubAnalytics',
      'openChangelog',
      'openMarkdownDoc',
    ]);
    modalControllerSpy = jasmine.createSpyObj('ModalController', ['create']);
    activatedRouteSpy = {
      snapshot: {
        queryParams: {},
      },
    };

    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), QrCodeGeneratorSectionComponent],
      providers: [
        { provide: UtilsService, useValue: utilsServiceSpy },
        { provide: 'ModalController', useValue: modalControllerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(QrCodeGeneratorSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open changelog when onOpenChangelog is called', async () => {
    const selectedAccordion = APPS.BACKEND_FUNCTIONS;
    component.parameters = {
      appSectionParameters: {
        selectedAccordion: selectedAccordion,
      },
    } as any;
    await component.onOpenChangelog();
    expect(utilsServiceSpy.openChangelog).toHaveBeenCalledWith(
      APPS.BACKEND_FUNCTIONS as keyof typeof APPS,
    );
  });

  it('should open source code URL in a new tab and emit analytics event when onGetSourceCode is called', () => {
    spyOn(globalThis.window, 'open');
    spyOn(component.analyticsEvent, 'emit');
    component.sourceCodeUrl = sourceCodeUrl;
    component.onGetSourceCode();

    expect(globalThis.window.open).toHaveBeenCalledWith(
      component.sourceCodeUrl,
      '_blank',
    );
    expect(component.analyticsEvent.emit).toHaveBeenCalledWith({
      eventName: 'get_source_code',
      params: {
        repo: APPS.QR_CODE_GENERATOR,
        app: APPS.LANDING_PAGE,
      },
    });
  });

  it('should open download URL in a new tab and emit analytics event when onDownloadNative is called', () => {
    spyOn(globalThis.window, 'open');
    spyOn(component.analyticsEvent, 'emit');
    component.nativeDownloadUrl = nativeDownloadUrl;
    component.onDownloadNative();

    expect(globalThis.window.open).toHaveBeenCalledWith(
      component.nativeDownloadUrl,
      '_blank',
    );
    expect(component.analyticsEvent.emit).toHaveBeenCalledWith({
      eventName: 'download_native',
      params: {
        platform: 'android',
        url: component.nativeDownloadUrl,
        app: APPS.LANDING_PAGE,
      },
    });
  });

  it('should open Web URL in a new tab and emit analytics event when onOpenWebApp is called', () => {
    spyOn(globalThis.window, 'open');
    spyOn(component.analyticsEvent, 'emit');
    component.webAppUrl = webAppUrl;
    component.onOpenWebApp();

    expect(globalThis.window.open).toHaveBeenCalledWith(
      component.webAppUrl,
      '_blank',
    );
    expect(component.analyticsEvent.emit).toHaveBeenCalledWith({
      eventName: 'open_web_app',
      params: {
        url: component.webAppUrl,
        app: APPS.LANDING_PAGE,
      },
    });
  });

  it('should return correct mailto link for feedback', () => {
    const expectedMailToLink = `mailto:zcontrol.app.qr@gmail.com?subject=${APPS.QR_CODE_GENERATOR}%20Feedback`;
    expect(component.getMailToLinkForFeedback()).toBe(expectedMailToLink);
  });

  it('should return the correct privacy policy link', () => {
    const privacyPolicyLink = component.privacyPolicyLink;
    expect(privacyPolicyLink).toEqual([
      '/privacy',
      'qr-code-generator',
      'en',
    ]);
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
    component.selectedSubAccordion = '';
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
