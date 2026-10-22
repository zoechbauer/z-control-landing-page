import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  IonAccordion,
  IonItem,
  IonLabel,
  IonIcon,
  IonToggle,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { FirebaseAnalyticsService } from '@app/services/firebase-analytics.service';
import { LocalStorageService } from '@app/services/local-storage.service';
import { ToastService } from '@app/services/toast-EN.service';
import { UtilsService } from '@app/services/utils.service';
import { FirebaseFirestoreLandingPageVisitService } from 'src/app/services/firebase-firestore-landing-page-visit.service';
import { EventEnum, SettingsAccordion, Tab } from '@app/shared/enums';
import { APPS } from 'src/app/shared/github.constants';

@Component({
  selector: 'app-firebase-analytics-accordion',
  templateUrl: './firebase-analytics-accordion.component.html',
  standalone: true,
  imports: [
    IonAccordion,
    IonItem,
    IonLabel,
    IonIcon,
    IonToggle,
    TranslateModule,
    CommonModule,
    FormsModule,
    RouterModule,
  ],
})
export class FirebaseAnalyticsAccordionComponent implements OnInit, OnDestroy {
  translate = inject(TranslateService);
  readonly fa = inject(FirebaseAnalyticsService);
  readonly utilsService = inject(UtilsService);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly toastService = inject(ToastService);
  private readonly fbLandingPageVisitService = inject(
    FirebaseFirestoreLandingPageVisitService,
  );

  @Input() lang?: string;
  @Input() isAnalyticsEnabled!: boolean;
  @Input() showAllAccordions!: boolean;

  Tab = Tab;
  SettingsAccordion = SettingsAccordion;
  private readonly sub = new Subscription();

  /**
   * Initializes the component and sets up subscriptions.
   */
  ngOnInit(): void {
    this.sub.add(
      this.fa.enabled$.subscribe((enabled) => {
        this.isAnalyticsEnabled = enabled;
      }),
    );
  }

  get privacyPolicyLink() {
    return ['/privacy', 'landing-page', this.lang || 'en'];
  }

  get enableAnalyticsLabel() {
    return this.isAnalyticsEnabled
      ? this.translate.instant('SETTINGS.FIREBASE_ANALYTICS.DISABLE_ANALYTICS')
      : this.translate.instant('SETTINGS.FIREBASE_ANALYTICS.ENABLE_ANALYTICS');
  }

  /**
   * Handles the change in analytics enablement.
   * Logs the appropriate events and updates the local storage and Firebase settings.
   * @param enabled Whether analytics should be enabled or disabled.
   */
  onChangeEnableAnalytics(enabled: boolean) {
    const eventName = 'toggle_analytics';
    const eventValue = enabled ? 'enabled' : 'disabled';

    if (this.isAnalyticsEnabled && !enabled) {
      // log event before disabling otherwise it won't be sent
      this.fa.logEvent(eventName, {
        app: APPS.LANDING_PAGE,
        analytics: eventValue,
      });
      setTimeout(() => {
        (async () => {
          await this.localStorageService.setAnalyticsConsent(enabled);
          await this.fbLandingPageVisitService.logLandingPageVisit(
            enabled,
            EventEnum.ANALYTICS_CHG_DISABLED,
          );
          this.fa.enableCollection(enabled);
        })().catch((err) =>
          console.error('Error during disabling analytics flow:', err),
        );
      }, 300);
    } else {
      (async () => {
        // analytics being enabled
        await this.localStorageService.setAnalyticsConsent(enabled);
        await this.fbLandingPageVisitService.logLandingPageVisit(
          enabled,
          EventEnum.ANALYTICS_CHG_ENABLED,
        );
        this.fa.enableCollection(enabled);
        // log event after enabling
        this.fa.logEvent(eventName, {
          app: APPS.LANDING_PAGE,
          analytics: eventValue,
        });
        await this.utilsService.navigateToTab(Tab.MainFeature);
      })().catch((err) =>
        console.error('Error during enabling analytics flow:', err),
      );
    }

    this.toastService.showToast(
      this.translate.instant(
        enabled
          ? 'SETTINGS.FIREBASE_ANALYTICS.TOAST.ANALYTICS_ENABLED'
          : 'SETTINGS.FIREBASE_ANALYTICS.TOAST.ANALYTICS_DISABLED',
      ),
    );
  }

  /**
   * Logs a visit to the privacy policy if analytics is disabled.
   */
  async logPrivacyPolicyVisit() {
    if (!this.isAnalyticsEnabled) {
      await this.fbLandingPageVisitService.logLandingPageVisit(
        false,
        EventEnum.READ_POLICY_FROM_ANALYTICS,
      );
    }
  }

  /**
   * Cleans up subscriptions when the component is destroyed.
   */
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
