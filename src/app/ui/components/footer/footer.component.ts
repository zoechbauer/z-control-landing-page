import { Component, OnDestroy, OnInit } from '@angular/core';
import { addIcons } from 'ionicons';
import {
  personOutline,
  mailOutline,
  locationOutline,
  chevronUpOutline,
  chevronDownOutline,
  listOutline,
  downloadOutline,
  documentTextOutline,
  logoGithub,
} from 'ionicons/icons';
import {
  IonFooter,
  IonToolbar,
  IonIcon,
  IonButton,
  IonToggle,
  ModalController,
} from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Subscription } from 'rxjs';

import { FirebaseAnalyticsService } from 'src/app/services/firebase-analytics.service';
import { environment } from 'src/environments/environment';
import { UtilsService } from 'src/app/services/utils.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { APPS } from 'src/app/shared/GitHubConstants';
import { ToastService } from 'src/app/services/toast-EN.service';
import { ToastAnchor } from 'src/app/shared/enums';

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
  enableAnalytics = false;
  private readonly sub = new Subscription();

  constructor(
    public readonly fa: FirebaseAnalyticsService,
    private readonly modalController: ModalController,
    private readonly utilsService: UtilsService,
    private readonly localStorageService: LocalStorageService,
    private readonly toastService: ToastService,
  ) {
    this.registerIcons();
  }

  ngOnInit(): void {
    this.sub.add(
      this.fa.enabled$.subscribe((enabled) => {
        this.enableAnalytics = enabled;
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

  get versionInfo() {
    const { major, minor, date } = {
      major: environment.version.major,
      minor: environment.version.minor,
      date: environment.version.date,
    };
    return `Version ${major}.${minor} (${date})`;
  }

  get mailtoLink() {
    return 'mailto:zcontrol.app.qr@gmail.com?subject=z-control%20Landing%20Page%20Feedback';
  }

  get privacyPolicyLink() {
    return ['/privacy', 'landing-page', 'en'];
  }

  private registerIcons() {
    addIcons({
      'person-outline': personOutline,
      'mail-outline': mailOutline,
      'location-outline': locationOutline,
      'chevron-up-outline': chevronUpOutline,
      'chevron-down-outline': chevronDownOutline,
      'list-outline': listOutline,
      'download-outline': downloadOutline,
      'document-text-outline': documentTextOutline,
      'logo-github': logoGithub,
    });
  }

  onChangeEnableAnalytics(enabled: boolean) {
    const eventName = 'toggle_analytics_footer';
    const eventValue = enabled ? 'enabled' : 'disabled';

    if (this.enableAnalytics && !enabled) {
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
    if (!this.enableAnalytics) {
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
    if (!this.enableAnalytics) {
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
    if (!this.enableAnalytics) {
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
