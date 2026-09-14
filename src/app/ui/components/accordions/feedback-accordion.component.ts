import { Component, Input, inject } from '@angular/core';
import {
  IonAccordion,
  IonItem,
  IonLabel,
  IonIcon,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

import type { AppKey } from '@app/shared/GitHubConstants';
import { LogoType, SettingsAccordion } from '@app/shared/enums';
import { LogoComponent } from '@ui/components/logo/logo.component';
import { UtilsService } from '@app/services/utils.service';
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

  @Input() lang!: string;
  @Input() appNameKey!: AppKey;
  @Input() isAnalyticsEnabled!: boolean;
  @Input() showAllAccordions!: boolean;

  LogoType = LogoType;
    SettingsAccordion = SettingsAccordion;

  get mailtoLink() {
    return 'mailto:zcontrol.app.qr@gmail.com?subject=z-control%20Landing%20Page%20Feedback';
  }
}
