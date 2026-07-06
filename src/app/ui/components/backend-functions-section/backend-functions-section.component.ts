import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonButton,
  IonAccordion,
  IonAccordionGroup,
  IonItem,
  IonLabel,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
} from '@ionic/angular/standalone';
import { APPS } from '@app/shared/GitHubConstants';
import { BackendFunctionsSectionParameters } from '@app/shared/app-interfaces';
import { UtilsService } from '@app/services/utils.service';

@Component({
  selector: 'app-backend-functions-section',
  templateUrl: './backend-functions-section.component.html',
  styleUrls: ['./backend-functions-section.component.scss'],
  imports: [
    CommonModule,
    IonIcon,
    IonCard,
    IonButton,
    IonAccordion,
    IonAccordionGroup,
    IonItem,
    IonLabel,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
  ],
})
export class BackendFunctionsSectionComponent {
  @Input() parameters?: BackendFunctionsSectionParameters;

  @Output() accordionChange = new EventEmitter<CustomEvent>();
  @Output() analyticsEvent = new EventEmitter<{
    eventName: string;
    params: any;
  }>();

  sourceCodeUrl = 'https://github.com/zoechbauer/z-control-backend-functions';
  selectedSubAccordion: string = '';

  constructor(private readonly utilsService: UtilsService) {}

  onGetSourceCode() {
    globalThis.window.open(this.sourceCodeUrl, '_blank');
    this.analyticsEvent.emit({
      eventName: 'get_source_code',
      params: {
        repo: APPS.BACKEND_FUNCTIONS,
        app: APPS.LANDING_PAGE,
      },
    });
  }

  async onOpenGitHubAnalytics() {
    const selectedAccordion = this.parameters?.appSectionParameters
      .selectedAccordion as keyof typeof APPS;
    await this.utilsService.openGitHubAnalytics(selectedAccordion);
  }

  async onOpenChangelog() {
    const selectedAccordion = this.parameters?.appSectionParameters
      .selectedAccordion as keyof typeof APPS;
    await this.utilsService.openChangelog(selectedAccordion);
  }

  async onOpenMarkdownDoc(docPath: string) {
    await this.utilsService.openMarkdownDoc(docPath);
  }

  subAccordionChange(event?: CustomEvent) {
    this.selectedSubAccordion = event?.detail?.value || '';
  }

  getAccordionTooltip(value: string): string {
    return this.selectedSubAccordion == value
      ? `Collapse ${value}`
      : `Expand ${value}`;
  }

  getMailToLinkForFeedback(): string {
    return `mailto:zcontrol.app.qr@gmail.com?subject=${APPS.BACKEND_FUNCTIONS}%20Feedback`;
  }
}
