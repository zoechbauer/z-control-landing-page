import { CommonModule, JsonPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
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
import { APPS } from 'shared/GitHubConstants';
import { MarkdownViewerComponent } from '../markdown-viewer/markdown-viewer.component';
import { MultipleLanguageTranslatorSectionParameters } from 'shared/app-interfaces';

@Component({
  selector: 'app-multi-language-translator-section',
  templateUrl: './multi-language-translator-section.component.html',
  styleUrls: ['./multi-language-translator-section.component.scss'],
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
    JsonPipe
  ],
})
export class MultiLanguageTranslatorSectionComponent {
  @Input() parameters?: MultipleLanguageTranslatorSectionParameters;
  @Output() accordionChange = new EventEmitter<CustomEvent>();
  @Output() subAccordionChangeEvent = new EventEmitter<string>();
  @Output() analyticsEvent = new EventEmitter<{
    eventName: string;
    params: any;
  }>();

  nativeDownloadUrl =
    'https://play.google.com/store/apps/details?id=at.zcontrol.zoe.qrcodeapp';
  sourceCodeUrl =
    'https://github.com/zoechbauer/z-control-multi-language-translator';
  webAppUrl = 'https://z-control-multi-language-translator.web.app';

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
        repo: APPS.MULTI_LANGUAGE_TRANSLATOR,
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
    console.log('Opening changelog for', this.parameters?.appSectionParameters.selectedAccordion);
    const changeLogPath = 'assets/logs/change-logs/CHANGELOG_MULTI-LANGUAGE-TRANSLATOR.md';
    this.analyticsEvent.emit({
      eventName: 'open_changelog',
      params: {
        changelog_for: this.parameters?.appSectionParameters.selectedAccordion,
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
    return `mailto:zcontrol.app.qr@gmail.com?subject=${APPS.MULTI_LANGUAGE_TRANSLATOR}%20Feedback`;
  }

  get privacyPolicyLink() {
    return ['/privacy', 'multi-language-translator', 'en'];
  }
}
