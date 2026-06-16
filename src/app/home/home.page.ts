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
  cloudyOutline,
  cloudCircleOutline
} from 'ionicons/icons';
import { IonContent, IonAccordionGroup } from '@ionic/angular/standalone';

import { HeaderComponent, FooterComponent } from '../ui';
import { QrCodeGeneratorSectionComponent } from '../ui/components/qr-code-generator-section/qr-code-generator-section.component';
import { BackupScriptsSectionComponent } from '../ui/components/backup-scripts-section/backup-scripts-section.component';
import { FirebaseAnalyticsService } from '../services/firebase-analytics.service';
import { LocalStorageService } from '../services/local-storage.service';
import { CommonModule } from '@angular/common';
import { APPS } from 'shared/GitHubConstants';
import { MultiLanguageTranslatorSectionComponent } from '../ui/components/multi-language-translator-section/multi-language-translator-section.component';
import {
  AppSectionParameters,
  BackupScriptsSectionParameters,
  MultipleLanguageTranslatorSectionParameters,
  QrCodeGeneratorSectionParameters,
  IonicSetupSectionParameters,
  BackendFunctionsSectionParameters,
} from 'shared/app-interfaces';
import { environment } from 'src/environments/environment';
import { IonicSetupSectionComponent } from '../ui/components/ionic-setup-section/ionic-setup-section.component';
import { BackendFunctionsSectionComponent } from '../ui/components/backend-functions-section/backend-functions-section.component';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonContent,
    IonAccordionGroup,
    RouterModule,
    CommonModule,
    HeaderComponent,
    FooterComponent,
    QrCodeGeneratorSectionComponent,
    BackupScriptsSectionComponent,
    MultiLanguageTranslatorSectionComponent,
    IonicSetupSectionComponent,
    BackendFunctionsSectionComponent,
  ],
})
export class HomePage implements AfterViewInit {
  @ViewChild('accordionGroup') accordionGroup!: IonAccordionGroup;

  selectedAccordion: string = APPS.LANDING_PAGE;
  currentMainAccordion: string = '';
  subAccordionOpened: boolean = false;
  qrCodeGeneratorSectionParams?: QrCodeGeneratorSectionParameters;
  backupScriptsSectionParams?: BackupScriptsSectionParameters;
  multiLanguageTranslatorSectionParams?: MultipleLanguageTranslatorSectionParameters;
  ionicSetupSectionParams?: IonicSetupSectionParameters;
  backendFunctionsSectionParams?: BackendFunctionsSectionParameters;

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
      'cloudy-outline': cloudyOutline,
      'cloud-circle-outline': cloudCircleOutline,
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
    if (value?.startsWith('QR')) {
      this.currentMainAccordion = 'QR'; // qr code generator
      this.setSelectedAccordion('QR');
      this.subAccordionOpened = false;
    } else if (value?.startsWith('BS')) {
      // backup scripts
      this.currentMainAccordion = 'BS';
      this.setSelectedAccordion('BS');
      this.subAccordionOpened = false;
    } else if (value?.startsWith('MLT')) {
      // multi-language translator
      this.currentMainAccordion = 'MLT';
      this.setSelectedAccordion('MLT');
      this.subAccordionOpened = false;
    } else if (value?.startsWith('IS')) {
      // ionic setup
      this.currentMainAccordion = 'IS';
      this.setSelectedAccordion('IS');
      this.subAccordionOpened = false;
    } else if (value?.startsWith('BF')) {
      // backup functions
      this.currentMainAccordion = 'BF';
      this.setSelectedAccordion('BF');
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
      this.selectedAccordion = APPS.LANDING_PAGE;
    }
  }

  subAccordionChange(parentGroup?: string) {
    this.subAccordionOpened = true;
  }

  setSelectedAccordion(group: string) {
    switch (group) {
      case 'QR':
        this.selectedAccordion = APPS.QR_CODE_GENERATOR;
        this.setQrCodeGeneratorParameters();
        break;
      case 'BS':
        this.selectedAccordion = APPS.BACKUP_SCRIPTS;
        this.setBackupScriptsParameters();
        break;
      case 'MLT':
        this.selectedAccordion = APPS.MULTI_LANGUAGE_TRANSLATOR;
        this.setMultiLanguageTranslatorParameters();
        break;
      case 'IS':
        this.selectedAccordion = APPS.IONIC_SETUP;
        this.setIonicSetupParameters();
        break;
      case 'BF':
        this.selectedAccordion = APPS.BACKEND_FUNCTIONS;
        this.setBackendFunctionsParameters();
        break;
      case undefined:
      case '':
        this.selectedAccordion = APPS.LANDING_PAGE;
        break;
      default:
        this.selectedAccordion = APPS.LANDING_PAGE;
    }
  }

  get isAnalyticsAllowed(): boolean {
    return this.localStorageService.getAnalyticsConsent() === true;
  }

  private openQRCodeGeneratorAccordion() {
    (this.accordionGroup as any).value = 'QR: QR Code Generator';
    this.currentMainAccordion = 'QR';
    this.setSelectedAccordion('QR');
  }

  private setBackupScriptsParameters() {
    this.backupScriptsSectionParams = {
      appSectionParameters: this.getAppParameters(),
    };
  }

  private setQrCodeGeneratorParameters() {
    this.qrCodeGeneratorSectionParams = {
      appSectionParameters: this.getAppParameters(),
      maxInputLength: environment.appSection.QR.maxInputLength,
    };
  }

  private setMultiLanguageTranslatorParameters() {
    this.multiLanguageTranslatorSectionParams = {
      appSectionParameters: this.getAppParameters(),
      maxInputLength: environment.appSection.MLT.maxInputLength,
      maxTargetLanguages: environment.appSection.MLT.maxTargetLanguages,
      maxTranslateCharsTotalPerMonth:
        environment.appSection.MLT.maxFreeTranslateCharsPerMonth,
      maxTranslateCharsUserPerMonth:
        environment.appSection.MLT.maxFreeTranslateCharsPerMonthForUser,
    };
  }

  private setIonicSetupParameters() {
    this.ionicSetupSectionParams = {
      appSectionParameters: this.getAppParameters(),
      maxFeatureCharsTotalPerMonth:
        environment.appSection.IS.maxFeatureCharsTotalPerMonth,
      maxFeatureCharsUserPerMonth:
        environment.appSection.IS.maxFeatureCharsUserPerMonth,
    };
  }

  private setBackendFunctionsParameters() {
    this.backendFunctionsSectionParams = {
      appSectionParameters: this.getAppParameters(),
    };
  }

  private getAppParameters(): AppSectionParameters {
    return {
      selectedAccordion: this.selectedAccordion,
      currentMainAccordion: this.currentMainAccordion,
      subAccordionOpened: this.subAccordionOpened,
      isAnalyticsAllowed: this.isAnalyticsAllowed,
    };
  }
}
