import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  book,
  checkmark,
  cloud,
  construct,
  contrastOutline,
  documentTextOutline,
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
  searchOutline,
  sunny,
  trashOutline,
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
  BackupScripts = 'z-control Backup Scripts',
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

  // z-control QR Code Generator App
  nativeDownloadUrlQrCodeGenerator =
    'https://play.google.com/store/apps/details?id=at.zcontrol.zoe.qrcodeapp';
  sourceCodeUrlQrCodeGenerator =
    'https://github.com/zoechbauer/z-control-qr-code-generator';
  webAppUrlQrCodeGenerator = 'https://z-control-qr-code.web.app';

  // z-control Backup Scripts
  sourceCodeUrlBackupScripts =
    'https://github.com/zoechbauer/z-control-backup-scripts';

  maxInputLength = 1000;
  selectedAccordion: string = '';
  currentMainAccordion: string = '';
  subAccordionOpened: boolean = false;
  App = App;

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
      'cloud-upload-outline': cloud,
      'search-outline': searchOutline,
      'trash-outline': trashOutline,
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
      'document-text': documentTextOutline,
    });
  }

  ngAfterViewInit() {
    // do not open accordion automatically as we have now 2 accordions
    // this.openQRCodeGeneratorAccordion();
  }

  onDownloadQrCodeGeneratorNative() {
    globalThis.window.open(this.nativeDownloadUrlQrCodeGenerator, '_blank');
    this.fa.logEvent('download_native', {
      platform: 'android',
      url: this.nativeDownloadUrlQrCodeGenerator,
      app: APPS.LANDING_PAGE,
    });
  }

  onGetQrCodeGeneratorSource() {
    globalThis.window.open(this.sourceCodeUrlQrCodeGenerator, '_blank');
    this.fa.logEvent('get_source_code', {
      repo: App.qrCode,
      app: APPS.LANDING_PAGE,
    });
  }

  onOpenQrCodeGeneratorWebApp() {
    globalThis.window.open(this.webAppUrlQrCodeGenerator, '_blank');
    this.fa.logEvent('open_web_app', {
      url: this.webAppUrlQrCodeGenerator,
      app: APPS.LANDING_PAGE,
    });
  }

  onGetBackupScriptsSource() {
    globalThis.window.open(this.sourceCodeUrlBackupScripts, '_blank');
    this.fa.logEvent('get_source_code', {
      repo: App.BackupScripts,
      app: APPS.LANDING_PAGE,
    });
  }

  async openMarkdownDoc(docPath: string) {
    const docFileName = docPath.split('/').pop();
    this.fa.logEvent('open_markdown_document', {
      document: docFileName,
      app: APPS.LANDING_PAGE,
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
    } else if (value?.startsWith('group 3')) {
      this.currentMainAccordion = 'group 3';
      this.setSelectedAccordion('group 3');
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
      case 'group 3':
        this.selectedAccordion = App.BackupScripts;
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

  getMailToLinkForFeedback(app: App): string {
    return `mailto:zcontrol.app.qr@gmail.com?subject=${app}%20Feedback`;
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
