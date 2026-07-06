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
import { BackupScriptsSectionParameters } from '@app/shared/app-interfaces';
import { UtilsService } from '@app/services/utils.service';
@Component({
  selector: 'app-backup-scripts-section',
  templateUrl: './backup-scripts-section.component.html',
  styleUrls: ['./backup-scripts-section.component.scss'],
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
export class BackupScriptsSectionComponent {
  @Input() parameters?: BackupScriptsSectionParameters;

  @Output() accordionChange = new EventEmitter<CustomEvent>();
  @Output() analyticsEvent = new EventEmitter<{
    eventName: string;
    params: any;
  }>();

  sourceCodeUrl = 'https://github.com/zoechbauer/z-control-backup-scripts';
  selectedSubAccordion: string = '';

  constructor(private readonly utilsService: UtilsService) {}

  onGetSourceCode() {
    globalThis.window.open(this.sourceCodeUrl, '_blank');
    this.analyticsEvent.emit({
      eventName: 'get_source_code',
      params: {
        repo: APPS.BACKUP_SCRIPTS,
        app: APPS.LANDING_PAGE,
      },
    });
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
    return `mailto:zcontrol.app.qr@gmail.com?subject=${APPS.BACKUP_SCRIPTS}%20Feedback`;
  }
}
