import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';
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
  qrCode = 'z-control QR Code Generator App',
}

@Component({
  selector: 'app-qr-code-generator-section',
  templateUrl: './qr-code-generator-section.component.html',
  styleUrls: ['./qr-code-generator-section.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
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
export class QrCodeGeneratorSectionComponent {
  @Input() selectedAccordion: string = '';
  @Input() currentMainAccordion: string = '';
  @Input() subAccordionOpened: boolean = false;
  @Input() isAnalyticsAllowed: boolean = true;
  @Input() maxInputLength: number = 1000;

  @Output() accordionChange = new EventEmitter<CustomEvent>();
  @Output() subAccordionChangeEvent = new EventEmitter<string>();
  @Output() analyticsEvent = new EventEmitter<{
    eventName: string;
    params: any;
  }>();

  nativeDownloadUrl =
    'https://play.google.com/store/apps/details?id=at.zcontrol.zoe.qrcodeapp';
  sourceCodeUrl = 'https://github.com/zoechbauer/z-control-qr-code-generator';
  webAppUrl = 'https://z-control-qr-code.web.app';
  App = App;

  constructor(private readonly modalController: ModalController) {}

  onDownloadNative() {
    globalThis.window.open(this.nativeDownloadUrl, '_blank');
    this.analyticsEvent.emit({
      eventName: 'download_native',
      params: {
        platform: 'android',
        url: this.nativeDownloadUrl,
        app: APPS.LANDING_PAGE,
      },
    });
  }

  onGetSourceCode() {
    globalThis.window.open(this.sourceCodeUrl, '_blank');
    this.analyticsEvent.emit({
      eventName: 'get_source_code',
      params: {
        repo: App.qrCode,
        app: APPS.LANDING_PAGE,
      },
    });
  }

  onOpenWebApp() {
    globalThis.window.open(this.webAppUrl, '_blank');
    this.analyticsEvent.emit({
      eventName: 'open_web_app',
      params: {
        url: this.webAppUrl,
        app: APPS.LANDING_PAGE,
      },
    });
  }

  async openChangelog() {
    const changeLogPath = 'assets/logs/change-logs/CHANGELOG_QR-CODE.md';
    this.analyticsEvent.emit({
      eventName: 'open_changelog',
      params: {
        changelog_for: this.selectedAccordion,
        app: APPS.LANDING_PAGE,
      },
    });

    const modal = await this.modalController.create({
      component: MarkdownViewerComponent,
      componentProps: {
        fullChangeLogPath: changeLogPath,
      },
      cssClass: 'change-log-modal',
    });

    await modal.present();
  }

  subAccordionChange(parentGroup: string) {
    this.subAccordionChangeEvent.emit(parentGroup);
  }

  getMailToLinkForFeedback(): string {
    return `mailto:zcontrol.app.qr@gmail.com?subject=${App.qrCode}%20Feedback`;
  }
}
