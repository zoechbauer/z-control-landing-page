import { Component, Input, inject } from '@angular/core';
import { IonAccordion, IonItem, IonLabel } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { GetSourceCodeComponent } from '@ui/components/get-source-code/get-source-code.component';
import { AppKey } from 'src/app/shared/github.constants';
import { SettingsAccordion } from '@app/shared/enums';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-get-source-accordion',
  templateUrl: './get-source-accordion.component.html',
  standalone: true,
  imports: [
    IonAccordion,
    IonItem,
    IonLabel,
    TranslateModule,
    GetSourceCodeComponent,
  ],
})
export class GetSourceAccordionComponent {
  translate = inject(TranslateService);
  readonly utilsService = inject(UtilsService);

  @Input() lang!: string;
  @Input() appNameKey!: AppKey;
  @Input() isAnalyticsEnabled!: boolean;
  @Input() showAllAccordions!: boolean;

  SettingsAccordion = SettingsAccordion;
}
