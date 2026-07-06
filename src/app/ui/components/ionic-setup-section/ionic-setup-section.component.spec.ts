import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { UtilsService } from '@app/services/utils.service';
import { APPS } from '@app/shared/GitHubConstants';
import { IonicSetupSectionComponent } from './ionic-setup-section.component';

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
      imports: [IonicModule.forRoot(), IonicSetupSectionComponent],
      providers: [
        { provide: UtilsService, useValue: utilsServiceSpy },
        { provide: 'ModalController', useValue: modalControllerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(IonicSetupSectionComponent);
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
        repo: APPS.IONIC_SETUP,
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
    const expectedMailToLink = `mailto:zcontrol.app.qr@gmail.com?subject=${APPS.IONIC_SETUP}%20Feedback`;
    expect(component.getMailToLinkForFeedback()).toBe(expectedMailToLink);
  });

  it('should return the correct privacy policy link', () => {
    const privacyPolicyLink = component.privacyPolicyLink;
    expect(privacyPolicyLink).toEqual([
      '/privacy',
      'multi-language-translator',
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
