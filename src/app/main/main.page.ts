import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonContent, IonAccordionGroup } from '@ionic/angular/standalone';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import {
  QrCodeGeneratorSectionComponent,
  BackupScriptsSectionComponent,
  MultiLanguageTranslatorSectionComponent,
  IonicSetupSectionComponent,
  BackendFunctionsSectionComponent,
  ImageToTextSectionComponent,
  SpinnerComponent,
  HeaderComponent,
  WelcomeComponent,
} from '@ui';
import { APPS, APP_KEYS, AppKey } from '@app/shared/GitHubConstants';
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
import { Tab } from '@app/shared/enums';
import { UtilsService } from '../services/utils.service';
import { FirebaseAnalyticsService } from '../services/firebase-analytics.service';
import { LocalStorageService } from '../services/local-storage.service';

@Component({
  selector: 'app-main',
  templateUrl: 'main.page.html',
  styleUrls: ['main.page.scss'],
  imports: [
    IonContent,
    IonAccordionGroup,
    RouterModule,
    CommonModule,
    HeaderComponent,
    QrCodeGeneratorSectionComponent,
    BackupScriptsSectionComponent,
    MultiLanguageTranslatorSectionComponent,
    ImageToTextSectionComponent,
    IonicSetupSectionComponent,
    BackendFunctionsSectionComponent,
    SpinnerComponent,
    WelcomeComponent,
  ],
})
export class MainPage implements OnInit, OnDestroy {
  translate = inject(TranslateService);
  private readonly fa = inject(FirebaseAnalyticsService);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly utilsService = inject(UtilsService);

  @ViewChild('accordionGroup') accordionGroup!: IonAccordionGroup;

  Tab = Tab;
  selectedAccordion: AppKey = APP_KEYS.LANDING_PAGE as AppKey;
  currentMainAccordion: string = '';
  qrCodeGeneratorSectionParams?: QrCodeGeneratorSectionParameters;
  backupScriptsSectionParams?: BackupScriptsSectionParameters;
  multiLanguageTranslatorSectionParams?: MultipleLanguageTranslatorSectionParameters;
  imageToTextSectionParams?: ImageToTextSectionParameters;
  ionicSetupSectionParams?: IonicSetupSectionParameters;
  backendFunctionsSectionParams?: BackendFunctionsSectionParameters;
  isAnalyticsEnabled = false;
  selectedLanguage!: string;
  isLoading = true;
  private readonly subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.utilsService.showOrHideIonTabBar();
    this.setupSubscriptions();
    this.getIsAnalyticsAllowed();
    this.initializeAllSectionParameters();
  }

  get currentAppName(): string {
    return APPS[this.selectedAccordion];
  }

  private setupSubscriptions() {
    this.subscriptions.push(
      this.localStorageService.selectedLanguage$.subscribe(async (lang) => {
        this.translate.use(lang);
        this.translate.setDefaultLang(lang);
        this.selectedLanguage = lang;
        this.isLoading = false;
        this.initializeAllSectionParameters();
      }),
      this.fa.enabled$.subscribe((enabled) => {
        this.isAnalyticsEnabled = enabled;
      }),
    );
  }

  private async getIsAnalyticsAllowed() {
    this.isAnalyticsEnabled =
      (await this.localStorageService.getAnalyticsConsent()) === true;
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

  /**
   * Handles the potential closing of the main accordion.
   * Resets the current main accordion and all related section parameters.
   */
  private handlePotentialMainAccordionClose() {
    // Main accordion is actually closing
    this.currentMainAccordion = '';
    this.setSelectedAccordion('');
    this.initializeAllSectionParameters();
  }

  private initializeAllSectionParameters() {
    this.setQrCodeGeneratorParameters();
    this.setBackupScriptsParameters();
    this.setMultiLanguageTranslatorParameters();
    this.setImageToTextParameters();
    this.setIonicSetupParameters();
    this.setBackendFunctionsParameters();
  }

  setSelectedAccordion(group: string) {
    switch (group) {
      case 'QR':
        this.selectedAccordion = APP_KEYS.QR_CODE_GENERATOR as AppKey;
        this.setQrCodeGeneratorParameters();
        break;
      case 'BS':
        this.selectedAccordion = APP_KEYS.BACKUP_SCRIPTS as AppKey;
        this.setBackupScriptsParameters();
        break;
      case 'MLT':
        this.selectedAccordion = APP_KEYS.MULTI_LANGUAGE_TRANSLATOR as AppKey;
        this.setMultiLanguageTranslatorParameters();
        break;
      case 'I2T':
        this.selectedAccordion = APP_KEYS.IMAGE_TO_TEXT as AppKey;
        this.setImageToTextParameters();
        break;
      case 'IS':
        this.selectedAccordion = APP_KEYS.IONIC_SETUP as AppKey;
        this.setIonicSetupParameters();
        break;
      case 'BF':
        this.selectedAccordion = APP_KEYS.BACKEND_FUNCTIONS as AppKey;
        this.setBackendFunctionsParameters();
        break;
      default:
        this.selectedAccordion = APP_KEYS.LANDING_PAGE as AppKey;
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
      selectedLanguage: this.selectedLanguage,
    };
  }

  goToSettingsAndOpenFirebaseAnalytics() {
    this.utilsService.navigateToTabWithParams(Tab.Settings, {
      open: 'firebase-analytics',
    });
    setTimeout(() => {
      this.utilsService.openFirebaseAnalyticsSub.next(true);
    }, 500);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
