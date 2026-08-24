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

import { FirebaseAnalyticsService } from 'src/app/services/firebase-analytics.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Tab } from 'src/app/shared/enums';
import { APPS } from 'src/app/shared/GitHubConstants';

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
  private readonly localStorageService = inject(LocalStorageService);

  @Input() lang?: string;

  isAnalyticsEnabled = false;
  Tab = Tab;
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
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
