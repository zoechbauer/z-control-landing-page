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
import { BackendFunctionsSectionParameters } from 'shared/app-interfaces';

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
  @Output() subAccordionChangeEvent = new EventEmitter<string>();
  @Output() analyticsEvent = new EventEmitter<{
    eventName: string;
    params: any;
  }>();

  sourceCodeUrl = 'https://github.com/zoechbauer/z-control-backend-functions';

  constructor(private readonly modalController: ModalController) {}

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
    return `mailto:zcontrol.app.qr@gmail.com?subject=${APPS.BACKEND_FUNCTIONS}%20Feedback`;
  }
}
