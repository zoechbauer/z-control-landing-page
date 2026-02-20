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
import { IonContent, IonAccordionGroup } from '@ionic/angular/standalone';

import { HeaderComponent, FooterComponent } from '../ui';
import { QrCodeGeneratorSectionComponent } from '../ui/components/qr-code-generator-section/qr-code-generator-section.component';
import { BackupScriptsSectionComponent } from '../ui/components/backup-scripts-section/backup-scripts-section.component';
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
    IonContent,
    IonAccordionGroup,
    RouterModule,
    HeaderComponent,
    FooterComponent,
    QrCodeGeneratorSectionComponent,
    BackupScriptsSectionComponent,
    CommonModule,
  ],
})
export class HomePage implements AfterViewInit {
  @ViewChild('accordionGroup') accordionGroup!: IonAccordionGroup;

  maxInputLength = 1000;
  selectedAccordion: string = '';
  currentMainAccordion: string = '';
  subAccordionOpened: boolean = false;
  App = App;

  constructor(
    private readonly fa: FirebaseAnalyticsService,
    private readonly localStorageService: LocalStorageService,
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

  handleAnalyticsEvent(event: { eventName: string; params: any }) {
    this.fa.logEvent(event.eventName, event.params);
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

  get isAnalyticsAllowed(): boolean {
    return this.localStorageService.getAnalyticsConsent() === true;
  }

  private openQRCodeGeneratorAccordion() {
    (this.accordionGroup as any).value = 'group 1: QR Code Generator';
    this.currentMainAccordion = 'group 1';
    this.setSelectedAccordion('group 1');
  }
}
