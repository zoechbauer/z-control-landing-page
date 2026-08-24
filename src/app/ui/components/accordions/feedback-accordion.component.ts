import { Component, Input, inject } from '@angular/core';
import {
  IonAccordion,
  IonItem,
  IonLabel,
  IonIcon,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

import { LogoType } from '@app/shared/enums';
import { LogoComponent } from '../logo/logo.component';
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
  translate = inject(TranslateService);

  @Input() lang!: string;
  @Input() disableAccordion = true;

  LogoType = LogoType;

  get mailtoLink() {
    return 'mailto:zcontrol.app.qr@gmail.com?subject=z-control%20Landing%20Page%20Feedback';
  }
}
