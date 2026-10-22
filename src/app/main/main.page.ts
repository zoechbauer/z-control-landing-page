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
  AnalyticsDisabledInfoComponent
} from '@ui';
import { APPS, APP_KEYS, AppKey } from 'src/app/shared/github.constants';
import {
  AppSectionParameters,
  BackupScriptsSectionParameters,
  MultipleLanguageTranslatorSectionParameters,
  ImageToTextSectionParameters,
  QrCodeGeneratorSectionParameters,
  IonicSetupSectionParameters,
  BackendFunctionsSectionParameters,
} from 'src/app/shared/app.interfaces';
import { environment } from '@env/environment';
import { SettingsAccordion, Tab } from '@app/shared/enums';
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
    AnalyticsDisabledInfoComponent,
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

  /**
   * Lifecycle hook that is called after the component has been initialized.
   * Sets up necessary subscriptions and initializes section parameters.
   */
  ngOnInit(): void {
    this.utilsService.showOrHideIonTabBar();
    this.setupSubscriptions();
    void this.getIsAnalyticsAllowed();
    this.initializeAllSectionParameters();
  }

  /**
   * Lifecycle hook that is called when the view is about to enter and become the active page.
   * If analytics is disabled, it closes any open main accordions.
   */
  ionViewWillEnter(){
    if (!this.isAnalyticsEnabled) {
      this.closeAccordionIfOpen();
    }
  }

  /**
   * Closes the currently open main accordion, if any.
   * Resets the component state and collapses the IonAccordionGroup UI.
   */
  
  private closeAccordionIfOpen() {
  // reset component state
  this.handlePotentialMainAccordionClose();

  // collapse the actual IonAccordionGroup UI
  // use optional chaining and timeout to avoid lifecycle race conditions
  setTimeout(() => {
    this.accordionGroup.value = '';
  }, 0);
}

  /**
   * Returns the name of the currently selected app based on the selected accordion.
   */
  get currentAppName(): string {
    return APPS[this.selectedAccordion];
  }

  private setupSubscriptions() {
    this.subscriptions.push(
      this.localStorageService.selectedLanguage$.subscribe(lang => {
        this.translate.use(lang);
        this.translate.setDefaultLang(lang);
        this.selectedLanguage = lang;
        this.isLoading = false;
        this.initializeAllSectionParameters();
      }),
      this.fa.enabled$.subscribe((enabled) => {
        this.isAnalyticsEnabled = enabled;
        if (!enabled) this.closeAccordionIfOpen();
      }),
    );
  }

  private async getIsAnalyticsAllowed() {
    this.isAnalyticsEnabled =
      (await this.localStorageService.getAnalyticsConsent()) === true;
  }

  /**
   * Handles changes in the accordion group.
   * Logs the change event to Firebase Analytics and updates the current main accordion state.
   * @param event The custom event containing the new accordion value.
   */
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

  /**
   * Sets the selected accordion based on the provided group identifier.
   * Updates the corresponding section parameters for the selected accordion.
   * @param group The identifier of the accordion group to select.
   */
  
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

  /*
   * Navigates to the Settings tab and opens the Firebase Analytics accordion.
   * Also triggers the opening of the Firebase Analytics sub-section after a short delay.
   */
  goToSettingsAndOpenFirebaseAnalytics() {
    this.utilsService.navigateToTabWithParams(Tab.Settings, {
      open: SettingsAccordion.LPS_FirebaseAnalytics,
    });
    setTimeout(() => {
      this.utilsService.openFirebaseAnalyticsSub.next(true);
    }, 500);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
