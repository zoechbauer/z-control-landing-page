import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  book,
  checkmark,
  cloud,
  construct,
  contrastOutline,
  download,
  eyeOutline,
  globe,
  help,
  home,
  information,
  library,
  list,
  lockClosed,
  logoFirebase,
  logoGithub,
  logoGooglePlaystore,
  mail,
  person,
  phonePortrait,
  rocket,
  sunny,
  warning,
} from 'ionicons/icons';
import {
  IonContent,
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

import { HeaderComponent, FooterComponent } from '../ui';
import { MarkdownViewerComponent } from '../ui/components/markdown-viewer/markdown-viewer.component';
import { FirebaseAnalyticsService } from '../services/firebase-analytics.service';
import { LocalStorageService } from '../services/local-storage.service';
import { CommonModule } from '@angular/common';
import { APPS } from 'shared/GitHubConstants';

enum App {
  qrCode = 'z-control QR Code Generator App',
  other = 'Other Apps ',
}
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonIcon,
    IonCard,
    IonButton,
    IonContent,
    IonAccordion,
    IonAccordionGroup,
    IonItem,
    IonLabel,
    RouterModule,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    HeaderComponent,
    FooterComponent,
    CommonModule,
  ],
})
export class HomePage implements AfterViewInit {
  @ViewChild('accordionGroup') accordionGroup!: IonAccordionGroup;

  nativeDownloadUrl =
    'https://play.google.com/store/apps/details?id=at.zcontrol.zoe.qrcodeapp';
  sourceCodeUrl = 'https://github.com/zoechbauer/z-control-qr-code-generator';
  webAppUrl = 'https://z-control-qr-code.web.app';

  maxInputLength = 1000;
  selectedAccordion: string = '';
  currentMainAccordion: string = '';
  subAccordionOpened: boolean = false;

  constructor(
    private readonly modalController: ModalController,
    private readonly fa: FirebaseAnalyticsService,
    private readonly localStorageService: LocalStorageService
  ) {
    this.registerIcons();
  }

  private registerIcons() {
    addIcons({
      book: book,
      checkmark: checkmark,
      'cloud-download': cloud,
      construct: construct,
      download: download,
      globe: globe,
      help: help,
      home: home,
      information: information,
      library: library,
      list: list,
      'lock-closed': lockClosed,
      'logo-firebase': logoFirebase,
      'logo-github': logoGithub,
      'logo-google-playstore': logoGooglePlaystore,
      mail: mail,
      person: person,
      'phone-portrait': phonePortrait,
      rocket: rocket,
      sunny: sunny,
      warning: warning,
      'eye-outline': eyeOutline,
      'contrast-outline': contrastOutline,
    });
  }

  ngAfterViewInit() {
    this.openQRCodeGeneratorAccordion();
  }

  onDownloadNative() {
    globalThis.window.open(this.nativeDownloadUrl, '_blank');
    this.fa.logEvent('download_native', {
      platform: 'android',
      url: this.nativeDownloadUrl,
      app: APPS.LANDING_PAGE,
    });
  }

  onGetSourceCode() {
    globalThis.window.open(this.sourceCodeUrl, '_blank');
    this.fa.logEvent('get_source_code', {
      repo: 'z-control-qr-code-generator',
      app: APPS.LANDING_PAGE,
    });
  }

  onOpenWebApp() {
    globalThis.window.open(this.webAppUrl, '_blank');
    this.fa.logEvent('open_web_app', {
      url: this.webAppUrl,
      app: APPS.LANDING_PAGE,
    });
  }

  accordionGroupChange(event: CustomEvent) {
    const value: string = event.detail.value;
    this.fa.logEvent('accordion_change', {
      accordion_value: value,
      app: APPS.LANDING_PAGE,
    });

    // Only handle main accordion changes
    if (value?.startsWith('group 1')) {
      this.currentMainAccordion = 'group 1';
      this.setSelectedAccordion('group 1');
      this.subAccordionOpened = false;
    } else if (value?.startsWith('group 2')) {
      this.currentMainAccordion = 'group 2';
      this.setSelectedAccordion('group 2');
      this.subAccordionOpened = false;
    } else if (value === undefined || value === '' || value === null) {
      // it could be main accordion closing or sub-accordion activity
      // only clear if main accordion is closed
      this.handlePotentialMainAccordionClose();
    }
    // For all other values (sub-accordion values like '1a', '1b', '1c', '1e', etc.)
    // we do nothing - keep the current header text
  }

  private handlePotentialMainAccordionClose() {
    if (this.subAccordionOpened) {
      // This was triggered by sub-accordion activity - keep header
      // Reset the flag for next time
      this.subAccordionOpened = false;
    } else {
      // Main accordion is actually closing
      this.currentMainAccordion = '';
      this.selectedAccordion = '';
    }
  }

  subAccordionChange(parentGroup?: string) {
    this.subAccordionOpened = true;
  }

  setSelectedAccordion(group: string) {
    switch (group) {
      case 'group 1':
        this.selectedAccordion = App.qrCode;
        break;
      case 'group 2':
        this.selectedAccordion = App.other;
        break;
      case undefined:
      case '':
        this.selectedAccordion = '';
        break;
      default:
        this.selectedAccordion = '';
    }
  }

  private getFullChangeLogPath(): string {
    const changeLogPath = 'assets/logs/change-logs';

    switch (this.selectedAccordion) {
      case App.qrCode:
        return `${changeLogPath}/CHANGELOG_QR-CODE.md`;
      // Add more cases for future apps here
      default:
        console.error(`No changelog available for ${this.selectedAccordion}`);
        return '';
    }
  }

  async openChangelog() {
    this.fa.logEvent('open_changelog', {
      changelog_for: this.selectedAccordion,
      app: APPS.LANDING_PAGE,
    });

    const modal = await this.modalController.create({
      component: MarkdownViewerComponent,
      componentProps: {
        fullChangeLogPath: this.getFullChangeLogPath(),
      },
      cssClass: 'change-log-modal',
    });

    await modal.present();
  }

  get mailtoLinkForQRCodeApp() {
    return 'mailto:zcontrol.app.qr@gmail.com?subject=z-control%20QR%20Code%20Generator%20App%20Feedback';
  }

  get isAnalyticsAllowed(): boolean {
    return this.localStorageService.getAnalyticsConsent() === true;
  }

  private openQRCodeGeneratorAccordion() {
    (this.accordionGroup as any).value = 'group 1: QR Code Generator';
    this.currentMainAccordion = 'group 1';
    this.setSelectedAccordion('group 1');
  }
}
