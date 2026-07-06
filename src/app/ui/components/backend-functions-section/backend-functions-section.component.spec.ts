import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BackendFunctionsSectionComponent } from './backend-functions-section.component';
import { UtilsService } from '@app/services/utils.service';
import { APPS } from '@app/shared/GitHubConstants';

describe('BackendFunctionsSectionComponent', () => {
  let component: BackendFunctionsSectionComponent;
  let fixture: ComponentFixture<BackendFunctionsSectionComponent>;
  let utilsServiceSpy: jasmine.SpyObj<UtilsService>;

  beforeEach(waitForAsync(() => {
    utilsServiceSpy = jasmine.createSpyObj('UtilsService', [
      'openGitHubAnalytics',
      'openChangelog',
      'openMarkdownDoc',
    ]);

    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), BackendFunctionsSectionComponent],
      providers: [{ provide: UtilsService, useValue: utilsServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(BackendFunctionsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open GitHub analytics when onOpenGitHubAnalytics is called', async () => {
    const selectedAccordion = APPS.BACKEND_FUNCTIONS;
    component.parameters = {
      appSectionParameters: {
        selectedAccordion: selectedAccordion,
      },
    } as any;

    await component.onOpenGitHubAnalytics();
    expect(utilsServiceSpy.openGitHubAnalytics).toHaveBeenCalledWith(
      APPS.BACKEND_FUNCTIONS as keyof typeof APPS,
    );
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
    component.onGetSourceCode();

    expect(globalThis.window.open).toHaveBeenCalledWith(
      component.sourceCodeUrl,
      '_blank',
    );
    expect(component.analyticsEvent.emit).toHaveBeenCalledWith({
      eventName: 'get_source_code',
      params: {
        repo: APPS.BACKEND_FUNCTIONS,
        app: APPS.LANDING_PAGE,
      },
    });
  });

  it('should call utilsService.openMarkdownDoc when onOpenMarkdownDoc is called', async () => {
    const docPath = 'assets/some-folder/test-doc.md';
    await component.onOpenMarkdownDoc(docPath);
    expect(utilsServiceSpy.openMarkdownDoc).toHaveBeenCalledWith(docPath);
  });

  it('should return correct mailto link for feedback', () => {
    const expectedMailToLink = `mailto:zcontrol.app.qr@gmail.com?subject=${APPS.BACKEND_FUNCTIONS}%20Feedback`;
    expect(component.getMailToLinkForFeedback()).toBe(expectedMailToLink);
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
