import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { IonContent, IonicModule } from '@ionic/angular';
import { NgIf } from '@angular/common';

import { environment } from '@env/environment';
import { LogoType, Tab, SettingsAccordion } from '@app/shared/enums';
import { APP_KEYS, AppKey, APPS } from 'src/app/shared/github.constants';
import {
  HeaderComponent,
  LanguageAccordionComponent,
  FeedbackAccordionComponent,
  ChangeLogAccordionComponent,
  GetSourceAccordionComponent,
  PrivacyPolicyAccordionComponent,
  SpinnerComponent,
  GetGithubAnalyticsAccordionComponent,
  FirebaseAnalyticsAccordionComponent,
  AnalyticsDisabledInfoComponent,
} from '@ui';
import { LocalStorageService } from '../services/local-storage.service';
import { UtilsService } from '../services/utils.service';
import { FirebaseAnalyticsService } from '../services/firebase-analytics.service';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  imports: [
    NgIf,
    IonicModule,
    TranslatePipe,
    HeaderComponent,
    LanguageAccordionComponent,
    FeedbackAccordionComponent,
    ChangeLogAccordionComponent,
    GetSourceAccordionComponent,
    PrivacyPolicyAccordionComponent,
    SpinnerComponent,
    GetGithubAnalyticsAccordionComponent,
    FirebaseAnalyticsAccordionComponent,
    AnalyticsDisabledInfoComponent,
  ],
})
export class SettingsPage implements OnInit, OnDestroy {
  translate = inject(TranslateService);
  readonly localStorageService = inject(LocalStorageService);
  readonly utilsService = inject(UtilsService);
  private readonly fa = inject(FirebaseAnalyticsService);

  readonly LANDING_PAGE_APP_KEY = APP_KEYS.LANDING_PAGE;
  openAccordion: SettingsAccordion | null = null;
  showAllAccordions = true;
  selectedLanguage!: string;
  selectedLanguageName?: string;
  LogoType = LogoType;
  Tab = Tab;
  SettingsAccordion = SettingsAccordion;
  isLoading = true;
  isAnalyticsEnabled = false;
  private readonly subscriptions: Subscription[] = [];

  /**
   * Returns the app name for the landing page.
   */
  get displayLandingPageAppName(): string {
    return APPS[APP_KEYS.LANDING_PAGE];
  }

  /**
   * The version information is retrieved from the environment configuration.
   * It constructs a string in the format "Version X.Y (Date)" where X is the major version, Y is the minor version,
   * and Date is the release date.
   * If any of the version information is missing, it returns "Version unknown (missing version information)".
   */
  get versionInfo() {
    return this.getVersionString(environment.version);
  }

  private getVersionString(version: {
    major?: number;
    minor?: number;
    date?: string;
  }): string {
    const { major, minor, date } = version;
    if (
      major === undefined ||
      major < 0 ||
      minor === undefined ||
      minor < 0 ||
      !date ||
      Number.isNaN(Date.parse(date))
    ) {
      return 'Version unknown (missing version information)';
    }
    return `Version ${major}.${minor} (${date})`;
  }

  /**
   * Sets up the initial state and subscriptions.
   */
  ngOnInit() {
    this.isLoading = true;
    this.showAllAccordions = true;
    this.setupSubscriptions();
    this.utilsService.showOrHideIonTabBar();
    void this.getIsAnalyticsAllowed();
  }

  private setupSubscriptions() {
    this.subscriptions.push(
      this.localStorageService.selectedLanguage$.subscribe((lang) => {
        this.translate.use(lang);
        this.translate.setDefaultLang(lang);
        this.selectedLanguage = lang;
        this.isLoading = false;
      }),
      this.utilsService.logoClicked$.subscribe(() => {
        this.openFeedbackAccordion();
      }),
      this.utilsService.openFirebaseAnalytics$.subscribe(() => {
          this.openFirebaseAnalyticsAccordion();
      }),
      this.fa.enabled$.subscribe((enabled) => {
        this.isAnalyticsEnabled = enabled;
        if (enabled) {
          this.showAll();
        }
      }),
    );
  }

  private openFeedbackAccordion() {
    this.openAccordion = null;
    this.openAccordion = SettingsAccordion.LPS_Feedback;
  }

  private openFirebaseAnalyticsAccordion() {
    this.openAccordion = null;
    this.openAccordion = SettingsAccordion.LPS_FirebaseAnalytics;
  }

  private async getIsAnalyticsAllowed() {
    this.isAnalyticsEnabled =
      (await this.localStorageService.getAnalyticsConsent()) === true;
  }

  /**
   * Handles the change event for the accordion group, updating the open accordion state
   * and logging the event if analytics are enabled.
   * @param event The custom event emitted by the accordion group when its value changes.
   * @param content The IonContent element associated with the accordion group.
   */
  onAccordionGroupChange(event: CustomEvent, content: IonContent) {
    const value = event?.detail?.value
      ? (event?.detail?.value as SettingsAccordion)
      : null;

    if (value) {
      this.fa.logEvent('accordion_change', {
        accordion_value: value,
        app: APPS.LANDING_PAGE,
      });
    }

    this.openAccordion = value;
    this.showAllAccordions = this.openAccordion === null;
  }

  /**
   * Handles the change event for the language selection,
   * updating the selected language and saving it to local storage.
   * @param event The custom event emitted when the language selection changes.
   */
  async onLanguageChange(event: any) {
    const lang = event.detail?.value;
    if (lang) {
      await this.localStorageService.saveSelectedLanguage(lang);
      this.translate.use(lang);
      this.translate.setDefaultLang(lang);

      this.fa.logEvent('language_change', {
        language: lang,
        app: APPS.LANDING_PAGE,
      });
    }
  }

  /**
   * Opens all accordions by setting the open accordion state to null
   * and the showAllAccordions flag to true.
   */
  showAll() {
    this.openAccordion = null;
    this.showAllAccordions = true;
  }

  /**
   * Opens the changelog for the landing page application.
   */
  async openChangelog() {
    const selectedAccordion = APP_KEYS.LANDING_PAGE as AppKey;
    await this.utilsService.openChangelog(selectedAccordion);
  }

  /**
   * Cleans up subscriptions when the component is destroyed.
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
