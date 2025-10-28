import { Component, OnInit } from '@angular/core';
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

import { FirebaseAnalyticsService } from 'src/app/services/firebase-analytics.service';
import { MarkdownViewerComponent } from '../markdown-viewer/markdown-viewer.component';
import { environment } from 'src/environments/environment';
import { UtilsService } from 'src/app/services/utils.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [IonFooter, IonToolbar, IonIcon, IonButton, RouterModule, IonToggle, AsyncPipe],
})
export class FooterComponent implements OnInit {
  showDetails = false;
  private readonly landingPageApp = 'Landing Page';

  constructor(
    public readonly fa: FirebaseAnalyticsService,
    private readonly modalController: ModalController,
    private readonly utilsService: UtilsService,
    private readonly localStorageService: LocalStorageService
  ) {
    this.registerIcons();
  }

  toggleFooterDetails() {
    if (!this.showDetails) {
      this.fa.logEvent('open_footer', {
        app: this.landingPageApp,
      });
    }
    this.showDetails = !this.showDetails;
  }

  async openChangelog() {
    this.fa.logEvent('open_changelog', {
      changelog_for: this.landingPageApp,
      app: this.landingPageApp,
    });
    const modal = await this.modalController.create({
      component: MarkdownViewerComponent,
      componentProps: {
        fullChangeLogPath: 'assets/logs/change-logs/CHANGELOG_LANDING-PAGE.md',
      },
      cssClass: 'change-log-modal',
    });

    await modal.present();
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
    });
  }

  ngOnInit(): void {
    this.utilsService.logoClicked$.subscribe(() => {
      this.fa.logEvent('logo_clicked', {
        app: this.landingPageApp,
      });
      this.showDetails = !this.showDetails;
    });
  }

  onChangeEnableAnalytics(enabled: boolean) {
    const eventName = enabled ? 'enable_analytics_footer' : 'disable_analytics_footer';
    this.fa.logEvent(eventName, {
      app: this.landingPageApp,
    });

    this.localStorageService.setAnalyticsConsent(enabled);
    this.fa.enableCollection(enabled);
  }
}
