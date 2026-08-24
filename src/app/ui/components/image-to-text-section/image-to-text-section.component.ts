import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject, OnInit } from '@angular/core';
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
} from '@ionic/angular/standalone';

import { APPS } from '@app/shared/GitHubConstants';
import { Tab } from '@app/shared/enums';
import { ImageToTextSectionParameters } from '@app/shared/app-interfaces';
import { UtilsService } from '@app/services/utils.service';
import { OpenSourceComponent } from '../open-source/open-source.component';

@Component({
  selector: 'app-image-to-text-section',
  templateUrl: './image-to-text-section.component.html',
  styleUrls: ['./image-to-text-section.component.scss'],
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
    OpenSourceComponent,
  ],
})
export class ImageToTextSectionComponent {
  private readonly utilsService = inject(UtilsService);

  @Input() parameters?: ImageToTextSectionParameters;
  @Input() isAnalyticsEnabled = false;
  @Output() accordionChange = new EventEmitter<CustomEvent>();
  @Output() analyticsEvent = new EventEmitter<{
    eventName: string;
    params: any;
  }>();

  nativeDownloadUrl =
    'https://play.google.com/store/apps/details?id=at.zcontrol.zoe.image-to-text';
  sourceCodeUrl =
    'https://github.com/zoechbauer/z-control-image-to-text';
  webAppUrl = 'https://z-control-image-to-text.web.app';
  selectedSubAccordion: string = '';
  Tab = Tab;

  get showBackendFunctionsInfo(): boolean {
    return !this.utilsService.isSmallScreen && !this.utilsService.isSmallDevice;
  }

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
        repo: APPS.IMAGE_TO_TEXT,
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

  async onOpenChangelog() {
    const selectedAccordion = this.parameters?.appSectionParameters
      .selectedAccordion as keyof typeof APPS;
    await this.utilsService.openChangelog(selectedAccordion);
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
    return `mailto:zcontrol.app.qr@gmail.com?subject=${APPS.IMAGE_TO_TEXT}%20Feedback`;
  }

  get privacyPolicyLink() {
    return ['/privacy', 'image-to-text', this.parameters?.appSectionParameters?.selectedLanguage || 'en'];
  }
}
