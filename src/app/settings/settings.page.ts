import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { IonContent, IonicModule } from '@ionic/angular';
import { NgIf } from '@angular/common';

import { environment } from '@env/environment';
import { LogoType, Tab } from '@app/shared/enums';
import { APP_KEYS, AppKey, APPS } from '@app/shared/GitHubConstants';
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
} from '@ui';
import { LocalStorageService } from '../services/local-storage.service';
import { UtilsService } from '../services/utils.service';
import { FirebaseAnalyticsService } from '../services/firebase-analytics.service';

// Single source of truth for settings accordion IDs.
// Add new accordion IDs here when extending the settings page.
const ACCORDION_VALUES = [
  'language',
  'z-control',
  'firebase-analytics',
  'github-analytics',
  'privacy-policy',
  'change-log',
  'get-source',
] as const;

type AccordionValue = (typeof ACCORDION_VALUES)[number];

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
  ],
})
export class SettingsPage implements OnInit, OnDestroy {
  translate = inject(TranslateService);
  readonly localStorageService = inject(LocalStorageService);
  readonly utilsService = inject(UtilsService);
  private readonly fa = inject(FirebaseAnalyticsService);

  private readonly validAccordionValues = new Set<AccordionValue>(
    ACCORDION_VALUES,
  );
  readonly LANDING_PAGE_APP_KEY = APP_KEYS.LANDING_PAGE;
  openAccordion: AccordionValue | null = null;
  showAllAccordions = true;
  selectedLanguage!: string;
  selectedLanguageName?: string;
  LogoType = LogoType;
  Tab = Tab;
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

  ngOnInit() {
    this.isLoading = true;
    this.showAllAccordions = true;
    this.setupSubscriptions();
    this.utilsService.showOrHideIonTabBar();
    this.getIsAnalyticsAllowed();
  }

  private setupSubscriptions() {
    this.subscriptions.push(
      this.localStorageService.selectedLanguage$.subscribe(async (lang) => {
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
      }),
    );
  }

  private openFeedbackAccordion() {
    this.openAccordion = null;
    this.openAccordion = 'z-control';
  }

  private openFirebaseAnalyticsAccordion() {
    this.openAccordion = null;
    this.openAccordion = 'firebase-analytics';
  }

  private async getIsAnalyticsAllowed() {
    this.isAnalyticsEnabled =
      (await this.localStorageService.getAnalyticsConsent()) === true;
  }

  onAccordionGroupChange(event: CustomEvent, content: IonContent) {
    const value = this.normalizeAccordionValue(event?.detail?.value);

    // Ignore bubbled value-change events from nested controls (e.g. radio groups).
    if (value === undefined) {
      return;
    }

    this.openAccordion = value;
    this.showAllAccordions = this.openAccordion === null;
  }

  private normalizeAccordionValue(
    rawValue: unknown,
  ): AccordionValue | null | undefined {
    // Header toggle close can emit undefined, null, or empty string.
    if (rawValue === undefined || rawValue === null || rawValue === '') {
      return null;
    }

    if (
      typeof rawValue === 'string' &&
      this.validAccordionValues.has(rawValue as AccordionValue)
    ) {
      return rawValue as AccordionValue;
    }

    return undefined;
  }

  onLanguageChange(event: any) {
    const lang = event.detail?.value;
    if (lang) {
      this.localStorageService.saveSelectedLanguage(lang);
      this.translate.use(lang);
      this.translate.setDefaultLang(lang);
    }
  }

  showAll() {
    this.openAccordion = null;
    this.showAllAccordions = true;
  }

  async openChangelog() {
    const selectedAccordion = APP_KEYS.LANDING_PAGE as AppKey;
    this.utilsService.openChangelog(selectedAccordion);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
