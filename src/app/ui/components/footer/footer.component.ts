import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  IonFooter,
  IonToolbar,
  IonIcon,
  IonButton,
  IonToggle,
} from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Subscription } from 'rxjs';

import { FirebaseAnalyticsService } from '@app/services/firebase-analytics.service';
import { environment } from '@env/environment';
import { UtilsService } from '@app/services/utils.service';
import { LocalStorageService } from '@app/services/local-storage.service';
import { APPS } from '@app/shared/GitHubConstants';
import { ToastService } from '@app/services/toast-EN.service';
import { ToastAnchor } from '@app/shared/enums';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [
    IonFooter,
    IonToolbar,
    IonIcon,
    IonButton,
    RouterModule,
    IonToggle,
    AsyncPipe,
  ],
})
export class FooterComponent implements OnInit, OnDestroy {
  showDetails = false;
  isAnalyticsEnabled = false;
  private readonly sub = new Subscription();

  constructor(
    public readonly fa: FirebaseAnalyticsService,
    private readonly utilsService: UtilsService,
    private readonly localStorageService: LocalStorageService,
    private readonly toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.sub.add(
      this.fa.enabled$.subscribe((enabled) => {
        this.isAnalyticsEnabled = enabled;
      }),
    );
    this.sub.add(
      this.utilsService.logoClicked$.subscribe((clicked) => {
        if (clicked) {
          this.fa.logEvent('logo_clicked', {
            app: APPS.LANDING_PAGE,
          });
        }
        this.showDetails = !this.showDetails;
      }),
    );
  }

  toggleFooterDetails() {
    if (!this.showDetails) {
      this.fa.logEvent('open_footer', {
        app: APPS.LANDING_PAGE,
      });
    }
    this.showDetails = !this.showDetails;
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

  get mailtoLink() {
    return 'mailto:zcontrol.app.qr@gmail.com?subject=z-control%20Landing%20Page%20Feedback';
  }

  get privacyPolicyLink() {
    return ['/privacy', 'landing-page', 'en'];
  }

  onChangeEnableAnalytics(enabled: boolean) {
    const eventName = 'toggle_analytics_footer';
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
        return;
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

  async onOpenGitHubAnalytics() {
    if (!this.isAnalyticsEnabled) {
      this.toastService.showToast(
        'Analytics is disabled. Please enable it to view GitHub Analytics Dashboard.',
        ToastAnchor.MainPage,
      );
      return;
    }
    const selectedAccordion = APPS.LANDING_PAGE as keyof typeof APPS;
    await this.utilsService.openGitHubAnalytics(selectedAccordion);
  }

  async onOpenChangelog() {
    if (!this.isAnalyticsEnabled) {
      this.toastService.showToast(
        'Analytics is disabled. Please enable it to view the Release Notes.',
        ToastAnchor.MainPage,
      );
      return;
    }
    const selectedAccordion = APPS.LANDING_PAGE as keyof typeof APPS;
    this.utilsService.openChangelog(selectedAccordion);
  }

  onGetSourceCode() {
    if (!this.isAnalyticsEnabled) {
      this.toastService.showToast(
        'Analytics is disabled. Please enable it to view the source code.',
        ToastAnchor.MainPage,
      );
      return;
    }
    globalThis.window.open(
      'https://github.com/zoechbauer/z-control-landing-page',
      '_blank',
    );

    this.fa.logEvent('get_source_code', {
      repo: APPS.LANDING_PAGE,
      app: APPS.LANDING_PAGE,
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
