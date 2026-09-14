import { Component, Input, inject } from '@angular/core';
import { IonAccordion, IonItem, IonLabel } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { LogoType, SettingsAccordion } from '@app/shared/enums';
import { UtilsService } from '@app/services/utils.service';
import { PrivacyPolicyComponent } from '@ui/components/privacy-policy/privacy-policy.component';

@Component({
  selector: 'app-privacy-policy-accordion',
  templateUrl: './privacy-policy-accordion.component.html',
  standalone: true,
  imports: [
    IonAccordion,
    IonItem,
    IonLabel,
    TranslateModule,
    PrivacyPolicyComponent,
  ],
})
export class PrivacyPolicyAccordionComponent {
  translate = inject(TranslateService);
  readonly utilsService = inject(UtilsService);

  @Input() lang!: string;
  @Input() isAnalyticsEnabled!: boolean;
  @Input() showAllAccordions!: boolean;

  LogoType = LogoType;
  SettingsAccordion = SettingsAccordion;
}
