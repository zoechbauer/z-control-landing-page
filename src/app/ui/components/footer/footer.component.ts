import { Component } from '@angular/core';
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
  ModalController,
} from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';

import { FirebaseAnalyticsService } from 'src/app/services/firebase-analytics.service';
import { MarkdownViewerComponent } from '../markdown-viewer/markdown-viewer.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [IonFooter, IonToolbar, IonIcon, IonButton, RouterModule],
})
export class FooterComponent {
  showDetails = false;
  private readonly landingPageApp = 'Landing Page';

  constructor(
    private readonly fa: FirebaseAnalyticsService,
    private readonly modalController: ModalController
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
}
