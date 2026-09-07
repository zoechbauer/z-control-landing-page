import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  IonButton,
  IonAccordion,
  IonAccordionGroup,
  IonItem,
  IonLabel,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
} from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';

import { APPS, AppKey } from '@app/shared/GitHubConstants';
import { Tab } from '@app/shared/enums';
import { QrCodeGeneratorSectionParameters } from '@app/shared/app-interfaces';
import { UtilsService } from '@app/services/utils.service';
import { OpenSourceAppsComponent } from '@ui/shared/open-source-apps/open-source-apps.component';
import { HelpAppsComponent } from '@ui/shared/help-apps/help-apps.component';
import { FeedbackAppsComponent } from '@ui/shared/feedback-apps/feedback-apps.component';
import { PrivacyPolicyAppsComponent } from '@ui/shared/privacy-policy-apps/privacy-policy-apps.component';
import { ChangeLogAppsComponent } from '@ui/shared/change-log-apps/change-log-apps.component';
import { SourceCodeAppsComponent } from '@ui/shared/source-code-apps/source-code-apps.component';
import { FirebaseAnalyticsService } from '@app/services/firebase-analytics.service';
@Component({
  selector: 'app-qr-code-generator-section',
  templateUrl: './qr-code-generator-section.component.html',
  styleUrls: ['./qr-code-generator-section.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    IonIcon,
    IonCard,
    IonButton,
    IonAccordion,
    IonAccordionGroup,
    IonItem,
    IonLabel,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    TranslatePipe,
    OpenSourceAppsComponent,
    HelpAppsComponent,
    FeedbackAppsComponent,
    PrivacyPolicyAppsComponent,
    ChangeLogAppsComponent,
    SourceCodeAppsComponent,
  ],
})
export class QrCodeGeneratorSectionComponent {
  private readonly utilsService = inject(UtilsService);
  private readonly fa = inject(FirebaseAnalyticsService);

  @Input() parameters?: QrCodeGeneratorSectionParameters;
  @Input() isAnalyticsEnabled = false;
  @Output() accordionChange = new EventEmitter<CustomEvent>();

  selectedSubAccordion: string = '';
  Tab = Tab;

  /**
   * Opens the Play Store link for the selected accordion in a new tab and logs the event.
   */
  onDownloadNative() {
    const url = this.utilsService.getPlayStoreLinkPathForAccordion(
      this.parameters!.appSectionParameters.selectedAccordion,
    );
    globalThis.window.open(url, '_blank');

    this.fa.logEvent('download_native', {
      platform: 'android',
      url: url,
      app: APPS.LANDING_PAGE,
    });
  }

  /**
   * Opens the web link for the selected accordion in a new tab and logs the event.
   */
  onOpenWebApp() {
    const url = this.utilsService.getWebLinkPathForAccordion(
      this.parameters!.appSectionParameters.selectedAccordion,
    );
    globalThis.window.open(url, '_blank');
    
    this.fa.logEvent('open_web_app', {
      url: url,
      app: APPS.LANDING_PAGE,
    });
  }

  /**
   * Handles the change event for a sub-accordion.
   * @param event The custom event triggered when a sub-accordion changes.
   */
  subAccordionChange(event?: CustomEvent) {
    this.selectedSubAccordion = event?.detail?.value || '';
  }

  /**
   * Gets the tooltip text for an accordion or sub-accordion.
   * @param value The value of the accordion or sub-accordion.
   * @param isSubAccordion Indicates whether the tooltip is for a sub-accordion (default: true).
   * @returns The tooltip text for the specified accordion or sub-accordion.
   */
  getAccordionTooltip(value: string, isSubAccordion: boolean = true): string {
    if (!isSubAccordion) {
      return this.utilsService.getAccordionTooltip(
        this.parameters?.appSectionParameters?.selectedLanguage || 'en',
        APPS.QR_CODE_GENERATOR,
        this.parameters?.appSectionParameters?.currentMainAccordion || '',
        value,
      );
    }
    return this.utilsService.getSubAccordionTooltip(
      this.parameters?.appSectionParameters?.selectedLanguage || 'en',
      this.selectedSubAccordion,
      value,
    );
  }
}
