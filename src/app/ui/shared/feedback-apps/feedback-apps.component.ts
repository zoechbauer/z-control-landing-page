import { Component, inject, Input } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { NgIf, NgTemplateOutlet } from '@angular/common';

import { APPS, AppKey } from '@app/shared/GitHubConstants';
import { UtilsService } from '@app/services/utils.service';

@Component({
  selector: 'app-feedback-apps',
  templateUrl: './feedback-apps.component.html',
  styleUrls: ['./feedback-apps.component.scss'],
  imports: [IonIcon, NgIf, NgTemplateOutlet],
})
export class FeedbackAppsComponent {
  private readonly utilsService = inject(UtilsService);

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
   * Constructs the mailto link for providing feedback for the selected app.
   * @returns The mailto link 
   */
  getMailToLinkForFeedback(): string {
    const appName = APPS[this.selectedAccordion];

    return `mailto:zcontrol.app.qr@gmail.com?subject=${appName}%20Feedback`;
  }
}
