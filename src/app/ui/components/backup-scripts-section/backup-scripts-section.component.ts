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
  ModalController,
} from '@ionic/angular/standalone';
import { MarkdownViewerComponent } from '../markdown-viewer/markdown-viewer.component';
import { APPS } from 'shared/GitHubConstants';

enum App {
  BackupScripts = 'z-control Backup Scripts',
}

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
  @Input() selectedAccordion: string = '';
  @Input() currentMainAccordion: string = '';
  @Input() subAccordionOpened: boolean = false;
  @Input() isAnalyticsAllowed: boolean = true;

  @Output() accordionChange = new EventEmitter<CustomEvent>();
  @Output() subAccordionChangeEvent = new EventEmitter<string>();
  @Output() analyticsEvent = new EventEmitter<{
    eventName: string;
    params: any;
  }>();

  sourceCodeUrl = 'https://github.com/zoechbauer/z-control-backup-scripts';
  App = App;

  constructor(private readonly modalController: ModalController) {}

  onGetSourceCode() {
    globalThis.window.open(this.sourceCodeUrl, '_blank');
    this.analyticsEvent.emit({
      eventName: 'get_source_code',
      params: {
        repo: App.BackupScripts,
        app: APPS.LANDING_PAGE,
      },
    });
  }

  async openMarkdownDoc(docPath: string) {
    const docFileName = docPath.split('/').pop();
    this.analyticsEvent.emit({
      eventName: 'open_markdown_document',
      params: {
        document: docFileName,
        app: APPS.LANDING_PAGE,
      },
    });

    const modal = await this.modalController.create({
      component: MarkdownViewerComponent,
      componentProps: {
        fullChangeLogPath: docPath,
        title: `GitHub Documentation:<br>${docPath.split('/').pop()}`,
      },
      cssClass: 'documentation-modal',
    });
    await modal.present();
  }

  subAccordionChange(parentGroup: string) {
    this.subAccordionChangeEvent.emit(parentGroup);
  }

  getMailToLinkForFeedback(): string {
    return `mailto:zcontrol.app.qr@gmail.com?subject=${App.BackupScripts}%20Feedback`;
  }
}
