import { Component, Input, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { LogoComponent } from '@ui/components/logo/logo.component';
import { LogoType, EventEnum, Tab } from '@app/shared/enums';
import { FirebaseFirestoreLandingPageVisitService } from '@app/services/firebase-firestore-landing-page-visit.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
  standalone: true,
  imports: [
    IonIcon,
    NgIf,
    NgTemplateOutlet,
    LogoComponent,
    TranslateModule,
    RouterModule,
  ],
})
export class PrivacyPolicyComponent {
  private readonly fbLandingPageVisitService = inject(
    FirebaseFirestoreLandingPageVisitService,
  );

  @Input() lang!: string;
  @Input() isAnalyticsEnabled!: boolean;
  LogoType = LogoType;
  Tab = Tab;

  get privacyPolicyLink() {
    return ['/privacy', 'landing-page', this.lang];
  }

  /**
   * Logs a visit to the privacy policy page to Firebase if analytics is disabled.
   */
  async logPrivacyPolicyVisit() {
    if (!this.isAnalyticsEnabled) {
      await this.fbLandingPageVisitService.logLandingPageVisit(
        false,
        EventEnum.READ_POLICY_FROM_SETTINGS,
      );
    }
  }
}
