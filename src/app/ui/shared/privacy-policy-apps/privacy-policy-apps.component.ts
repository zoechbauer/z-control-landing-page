import { Component, Input, inject } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Tab } from '@app/shared/enums';
import { AppKey, APPS } from '@app/shared/GitHubConstants';
import { PrivacyService } from '@app/privacy/services/privacy.service';
import { UtilsService } from '@app/services/utils.service';

@Component({
  selector: 'app-privacy-policy-apps',
  templateUrl: './privacy-policy-apps.component.html',
  styleUrls: ['./privacy-policy-apps.component.scss'],
  imports: [RouterModule, IonIcon, NgIf, NgTemplateOutlet],
})
export class PrivacyPolicyAppsComponent {
  private readonly privacyService = inject(PrivacyService);
  private readonly utilsService = inject(UtilsService);

  @Input() selectedLanguage!: string;
  @Input() selectedAccordion!: AppKey;

  Tab = Tab;

  /**
   * Constructs the link to the privacy policy for the selected app and language.
   * @returns The router link array for the privacy policy page.
   */
  get privacyPolicyLink() {
    const policyName = this.privacyService.getPolicyName(
      this.selectedAccordion,
    );
    return ['/privacy', policyName, this.selectedLanguage];
  }

  /**
   * Returns the display name of the app with 'z-control' replaced by a non-breaking variant.
   * @returns The changed App name
   */
  get appName(): string {
    return this.utilsService.getDisplayNameForAccordion(this.selectedAccordion);
  }
}
