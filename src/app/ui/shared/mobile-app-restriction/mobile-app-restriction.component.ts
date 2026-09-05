import { Component, Input } from '@angular/core';
import { CommonModule, NgIf, NgTemplateOutlet } from '@angular/common';

import { APPS, AppKey } from '@app/shared/GitHubConstants';

@Component({
  selector: 'app-mobile-app-restriction',
  templateUrl: './mobile-app-restriction.component.html',
  styleUrls: ['./mobile-app-restriction.component.scss'],
  imports: [CommonModule, NgIf, NgTemplateOutlet],
})
export class MobileAppRestrictionComponent {
  @Input() selectedLanguage!: string;
  @Input() selectedAccordion!: AppKey;
  @Input() maxProcessingTotalPerMonth!: number;

  readonly APPS = APPS;
}
