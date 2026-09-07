import { Component, inject, Input } from '@angular/core';
import { IonIcon, IonButton } from '@ionic/angular/standalone';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

import { AppKey, APPS } from '@app/shared/GitHubConstants';
import { UtilsService } from '@app/services/utils.service';
import { FirebaseAnalyticsService } from '@app/services/firebase-analytics.service';

@Component({
  selector: 'app-source-code-apps',
  templateUrl: './source-code-apps.component.html',
  styleUrls: ['./source-code-apps.component.scss'],
  imports: [IonButton, IonIcon, NgIf, NgTemplateOutlet, TranslatePipe],
})
export class SourceCodeAppsComponent {
  private readonly utilsService = inject(UtilsService);
  private readonly fa = inject(FirebaseAnalyticsService);

  @Input() selectedLanguage!: string;
  @Input() selectedAccordion!: AppKey;

  /**
   * Returns the display name of the app with 'z-control' replaced by a non-breaking variant.
   * @returns The changed App name
   */
  get appName(): string {
    return this.utilsService.getDisplayNameForAccordion(this.selectedAccordion);
  }

  /**
   * Opens the Github repository for the selected app and 
   * logs the event to Firebase Analytics.
   */
  onGetSourceCode() {
    const url = this.utilsService.getSourceLinkPathForAccordion(
      this.selectedAccordion,
    );
    globalThis.window.open(url, '_blank');

    this.fa.logEvent('get_source_code', {
      repo: this.selectedAccordion,
      app: APPS.LANDING_PAGE,
    });
  }
}
