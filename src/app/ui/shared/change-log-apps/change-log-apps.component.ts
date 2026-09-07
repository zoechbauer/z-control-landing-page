import { Component, inject, Input } from '@angular/core';
import { IonIcon, IonButton } from '@ionic/angular/standalone';
import { NgIf, NgTemplateOutlet } from '@angular/common';

import { UtilsService } from '@app/services/utils.service';
import { AppKey } from '@app/shared/GitHubConstants';

@Component({
  selector: 'app-change-log-apps',
  templateUrl: './change-log-apps.component.html',
  styleUrls: ['./change-log-apps.component.scss'],
  imports: [IonButton, IonIcon, NgIf, NgTemplateOutlet],
})
export class ChangeLogAppsComponent {
  readonly utilsService = inject(UtilsService);

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
   * Opens the changelog for the currently selected accordion.
   */
  async onOpenChangelog() {
    await this.utilsService.openChangelog(this.selectedAccordion);
  }
}
