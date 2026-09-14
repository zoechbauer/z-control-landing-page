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
import { SettingsAccordion, Tab } from '@app/shared/enums';
import { APPS } from '@app/shared/GitHubConstants';

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

  @Input() lang?: string;
  @Input() isAnalyticsEnabled!: boolean;
  @Input() showAllAccordions!: boolean;

  Tab = Tab;
    SettingsAccordion = SettingsAccordion;
  private readonly sub = new Subscription();

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
        this.localStorageService.setAnalyticsConsent(enabled);
        this.fa.enableCollection(enabled);
      }, 300);
    } else {
      // analytics being enabled
      this.localStorageService.setAnalyticsConsent(enabled);
      this.fa.enableCollection(enabled);
      // log event after enabling
      this.fa.logEvent(eventName, {
        app: APPS.LANDING_PAGE,
        analytics: eventValue,
      });
      this.utilsService.navigateToTab(Tab.MainFeature);
    }

    this.toastService.showToast(
      this.translate.instant(
        enabled
          ? 'SETTINGS.FIREBASE_ANALYTICS.TOAST.ANALYTICS_ENABLED'
          : 'SETTINGS.FIREBASE_ANALYTICS.TOAST.ANALYTICS_DISABLED',
      ),
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
