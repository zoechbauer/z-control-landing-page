import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UtilsService } from '@app/services/utils.service';
import { APPS } from '@app/shared/GitHubConstants';
import { BackupScriptsSectionComponent } from './backup-scripts-section.component';

describe('BackupScriptsSectionComponent', () => {
  let component: BackupScriptsSectionComponent;
  let fixture: ComponentFixture<BackupScriptsSectionComponent>;
  let utilsServiceSpy: jasmine.SpyObj<UtilsService>;

  beforeEach(waitForAsync(() => {
    utilsServiceSpy = jasmine.createSpyObj('UtilsService', [
      'openGitHubAnalytics',
      'openChangelog',
      'openMarkdownDoc',
    ]);

    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), BackupScriptsSectionComponent],
      providers: [{ provide: UtilsService, useValue: utilsServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(BackupScriptsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
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
        repo: APPS.BACKUP_SCRIPTS,
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
    const expectedMailToLink = `mailto:zcontrol.app.qr@gmail.com?subject=${APPS.BACKUP_SCRIPTS}%20Feedback`;
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
