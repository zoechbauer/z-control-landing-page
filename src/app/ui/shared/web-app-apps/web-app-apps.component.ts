import { Component, inject, Input } from '@angular/core';
import { IonIcon, IonButton } from '@ionic/angular/standalone';
import { NgIf, NgTemplateOutlet } from '@angular/common';

import { UtilsService } from '@app/services/utils.service';
import { AppKey } from '@app/shared/GitHubConstants';

@Component({
  selector: 'app-web-app-apps',
  templateUrl: './web-app-apps.component.html',
  styleUrls: ['./web-app-apps.component.scss'],
  imports: [IonButton, IonIcon, NgIf, NgTemplateOutlet],
})
export class WebAppAppsComponent {
  readonly utilsService = inject(UtilsService);

  @Input() selectedLanguage!: string;
  @Input() selectedAccordion!: AppKey;

  /**
   * Opens the web app in a new browser tab and emits an analytics event.
   */
  onOpenWebApp() {
    this.utilsService.onOpenWebApp(this.selectedAccordion);
  }
}
