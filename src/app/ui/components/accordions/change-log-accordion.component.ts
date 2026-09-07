import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import {
  IonAccordion,
  IonItem,
  IonLabel,
  IonIcon,
  IonButton,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import type { AppKey } from '@app/shared/GitHubConstants';
import { UtilsService } from '@app/services/utils.service';
@Component({
  selector: 'app-change-log-accordion',
  templateUrl: './change-log-accordion.component.html',
  standalone: true,
  imports: [
    IonAccordion,
    IonItem,
    IonLabel,
    IonIcon,
    IonButton,
    TranslateModule,
    CommonModule,
  ],
})
export class ChangeLogAccordionComponent {
  readonly translate = inject(TranslateService);
  readonly utilsService = inject(UtilsService);

  @Input() versionInfo!: string;
  @Input() lang!: string;
  @Input() appNameKey!: AppKey;
  @Input() disableAccordion = true;
  @Output() ionChange = new EventEmitter<void>();

  openChangelog() {
    this.ionChange.emit();
  }
}
