import { Component, Input, inject } from '@angular/core';
import {
  IonAccordion,
  IonItem,
  IonLabel,
  IonIcon,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

import type { AppKey } from 'src/app/shared/github.constants';
import { EventEnum, LogoType, SettingsAccordion } from '@app/shared/enums';
import { LogoComponent } from '@ui/components/logo/logo.component';
import { UtilsService } from '@app/services/utils.service';
import { FirebaseFirestoreLandingPageVisitService } from '@app/services/firebase-firestore-landing-page-visit.service';
@Component({
  selector: 'app-feedback-accordion',
  templateUrl: './feedback-accordion.component.html',
  standalone: true,
  imports: [
    IonAccordion,
    IonItem,
    IonLabel,
    IonIcon,
    TranslateModule,
    LogoComponent,
    CommonModule,
  ],
})
export class FeedbackAccordionComponent {
  readonly translate = inject(TranslateService);
  readonly utilsService = inject(UtilsService);
  readonly fbLandingPageVisitService = inject(
    FirebaseFirestoreLandingPageVisitService,
  );

  @Input() lang!: string;
  @Input() appNameKey!: AppKey;
  @Input() isAnalyticsEnabled!: boolean;
  @Input() showAllAccordions!: boolean;

  LogoType = LogoType;
  SettingsAccordion = SettingsAccordion;

  get mailtoLink() {
    return 'mailto:zcontrol.app.qr@gmail.com?subject=z-control%20Landing%20Page%20Feedback';
  }

  /**
   * Logs the action of sending feedback to Firebase if analytics is disabled.
   */
  logSendFeedback() {
    if (!this.isAnalyticsEnabled) {
      this.fbLandingPageVisitService.logLandingPageVisit(
        false,
        EventEnum.SEND_FEEDBACK,
      );
    }
  }
}
