import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonContent, IonAccordionGroup } from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';

import { HeaderComponent, FooterComponent } from '../ui';
import { QrCodeGeneratorSectionComponent } from '../ui/components/qr-code-generator-section/qr-code-generator-section.component';
import { BackupScriptsSectionComponent } from '../ui/components/backup-scripts-section/backup-scripts-section.component';
import { FirebaseAnalyticsService } from '../services/firebase-analytics.service';
import { LocalStorageService } from '../services/local-storage.service';
import { CommonModule } from '@angular/common';
import { APPS } from '@app/shared/GitHubConstants';
import { MultiLanguageTranslatorSectionComponent } from '../ui/components/multi-language-translator-section/multi-language-translator-section.component';
import {
  AppSectionParameters,
  BackupScriptsSectionParameters,
  MultipleLanguageTranslatorSectionParameters,
  ImageToTextSectionParameters,
  QrCodeGeneratorSectionParameters,
  IonicSetupSectionParameters,
  BackendFunctionsSectionParameters,
} from '@app/shared/app-interfaces';
import { environment } from '@env/environment';
import { IonicSetupSectionComponent } from '../ui/components/ionic-setup-section/ionic-setup-section.component';
import { BackendFunctionsSectionComponent } from '../ui/components/backend-functions-section/backend-functions-section.component';
import { ImageToTextSectionComponent } from '../ui/components/image-to-text-section/image-to-text-section.component';
import { Tab } from '../shared/enums';
import { UtilsService } from '../services/utils.service';

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
    ImageToTextSectionComponent,
    IonicSetupSectionComponent,
    BackendFunctionsSectionComponent,
  ],
})
export class HomePage implements OnInit, OnDestroy {
  private readonly fa = inject(FirebaseAnalyticsService);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly utilsService = inject(UtilsService);

  @ViewChild('accordionGroup') accordionGroup!: IonAccordionGroup;

  Tab = Tab;
  selectedAccordion: string = APPS.LANDING_PAGE;
  currentMainAccordion: string = '';
  qrCodeGeneratorSectionParams?: QrCodeGeneratorSectionParameters;
  backupScriptsSectionParams?: BackupScriptsSectionParameters;
  multiLanguageTranslatorSectionParams?: MultipleLanguageTranslatorSectionParameters;
  imageToTextSectionParams?: ImageToTextSectionParameters;
  ionicSetupSectionParams?: IonicSetupSectionParameters;
  backendFunctionsSectionParams?: BackendFunctionsSectionParameters;
  isAnalyticsEnabled = false;
  private readonly subscription = new Subscription();

  ngOnInit(): void {
    this.utilsService.showOrHideIonTabBar();
    this.getIsAnalyticsAllowed();

    this.subscription.add(
      this.fa.enabled$.subscribe((enabled) => {
        console.log('Analytics enabled status changed:', enabled);
        this.isAnalyticsEnabled = enabled;
      }),
    );
  }

  private async getIsAnalyticsAllowed() {
    this.isAnalyticsEnabled =
      (await this.localStorageService.getAnalyticsConsent()) === true;
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
    } else if (value?.startsWith('BS')) {
      // backup scripts
      this.currentMainAccordion = 'BS';
      this.setSelectedAccordion('BS');
    } else if (value?.startsWith('MLT')) {
      // multi-language translator
      this.currentMainAccordion = 'MLT';
      this.setSelectedAccordion('MLT');
    } else if (value?.startsWith('I2T')) {
      // image to text
      this.currentMainAccordion = 'I2T';
      this.setSelectedAccordion('I2T');
    } else if (value?.startsWith('IS')) {
      // ionic setup
      this.currentMainAccordion = 'IS';
      this.setSelectedAccordion('IS');
    } else if (value?.startsWith('BF')) {
      // backup functions
      this.currentMainAccordion = 'BF';
      this.setSelectedAccordion('BF');
    } else if (value === undefined || value === '' || value === null) {
      // it could be main accordion closing or sub-accordion activity
      // only clear if main accordion is closed
      this.handlePotentialMainAccordionClose();
    }
    // For all other values (sub-accordion values like '*QR', '*MLT', etc.)
    // we do nothing - keep the current header text
  }

  private handlePotentialMainAccordionClose() {
    // Main accordion is actually closing
    this.currentMainAccordion = '';
    this.setSelectedAccordion('');
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
      case 'I2T':
        this.selectedAccordion = APPS.IMAGE_TO_TEXT;
        this.setImageToTextParameters();
        break;
      case 'IS':
        this.selectedAccordion = APPS.IONIC_SETUP;
        this.setIonicSetupParameters();
        break;
      case 'BF':
        this.selectedAccordion = APPS.BACKEND_FUNCTIONS;
        this.setBackendFunctionsParameters();
        break;
      default:
        this.selectedAccordion = APPS.LANDING_PAGE;
    }
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

  private setImageToTextParameters() {
    this.imageToTextSectionParams = {
      appSectionParameters: this.getAppParameters(),
      maxImageProcessingTotalPerMonth:
        environment.appSection.I2T.maxImageProcessingTotalPerMonth,
      maxImageProcessingUserPerMonth:
        environment.appSection.I2T.maxImageProcessingUserPerMonth,
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
      isAnalyticsEnabled: this.isAnalyticsEnabled,
    };
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
