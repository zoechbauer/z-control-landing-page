import { CommonModule } from '@angular/common';
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
import { IonicSetupSectionParameters } from 'shared/app-interfaces';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-ionic-setup-section',
  templateUrl: './ionic-setup-section.component.html',
  styleUrls: ['./ionic-setup-section.component.scss'],
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
export class IonicSetupSectionComponent {
  @Input() parameters?: IonicSetupSectionParameters;
  @Output() accordionChange = new EventEmitter<CustomEvent>();
  @Output() subAccordionChangeEvent = new EventEmitter<string>();
  @Output() analyticsEvent = new EventEmitter<{
    eventName: string;
    params: any;
  }>();

  nativeDownloadUrl =
    'https://play.google.com/store/apps/details?id=at.zcontrol.zoe.ionicsetup';
  sourceCodeUrl = 'https://github.com/zoechbauer/z-control-ionic-setup';
  webAppUrl = 'https://z-control-ionic-setup.web.app';

  constructor(
    private readonly modalController: ModalController,
    private readonly utilsService: UtilsService,
  ) {}

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
        repo: APPS.IONIC_SETUP,
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
    const selectedAccordion = this.parameters?.appSectionParameters.selectedAccordion as keyof typeof APPS;
    this.utilsService.openChangelog(selectedAccordion);
  }

  subAccordionChange(parentGroup: string) {
    this.subAccordionChangeEvent.emit(parentGroup);
  }

  getMailToLinkForFeedback(): string {
    return `mailto:zcontrol.app.qr@gmail.com?subject=${APPS.IONIC_SETUP}%20Feedback`;
  }

  get privacyPolicyLink() {
    return ['/privacy', 'multi-language-translator', 'en'];
  }
}
