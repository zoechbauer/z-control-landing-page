import { Component, inject, Input } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { NgIf, NgTemplateOutlet } from '@angular/common';

import { AppKey } from '@app/shared/GitHubConstants';
import { APPS } from 'src/app/shared/GitHubConstants';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-help-apps',
  templateUrl: './help-apps.component.html',
  styleUrls: ['./help-apps.component.scss'],
  imports: [IonIcon, NgIf, NgTemplateOutlet],
})
export class HelpAppsComponent {
  utilsService = inject(UtilsService);

  @Input() selectedLanguage!: string;
  @Input() selectedAccordion!: AppKey;

  APPS = APPS;
}
