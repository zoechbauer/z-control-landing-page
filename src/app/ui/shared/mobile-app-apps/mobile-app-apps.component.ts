import { Component, inject, Input } from '@angular/core';
import { IonIcon, IonButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

import { UtilsService } from '@app/services/utils.service';
import { APPS, AppKey } from '@app/shared/GitHubConstants';
import { FirebaseAnalyticsService } from '@app/services/firebase-analytics.service';
import { MobileAppRestrictionComponent } from '../mobile-app-restriction/mobile-app-restriction.component';

@Component({
  selector: 'app-mobile-app-apps',
  templateUrl: './mobile-app-apps.component.html',
  styleUrls: ['./mobile-app-apps.component.scss'],
  imports: [
    CommonModule,
    IonButton,
    IonIcon,
    TranslatePipe,
    MobileAppRestrictionComponent,
  ],
})
export class MobileAppAppsComponent {
  readonly utilsService = inject(UtilsService);
  private readonly fa = inject(FirebaseAnalyticsService);

  @Input() selectedLanguage!: string;
  @Input() selectedAccordion!: AppKey;
  @Input() maxImageProcessingTotalPerMonth!: number;

  onDownloadNative() {
    const url = this.utilsService.getPlayStoreLinkPathForAccordion(
      this.selectedAccordion,
    );
    globalThis.window.open(url, '_blank');

    this.fa.logEvent('download_native', {
      eventName: 'download_native',
      params: {
        platform: 'android',
        url: url,
        app: APPS.LANDING_PAGE,
      },
    });
  }
}
