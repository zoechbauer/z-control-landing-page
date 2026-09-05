import { Component, Input, inject } from '@angular/core';
import {
  IonAccordion,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { GetSourceCodeComponent } from '@ui/components/get-source-code/get-source-code.component';
import { AppKey } from '@app/shared/GitHubConstants';


@Component({
  selector: 'app-get-source-accordion',
  templateUrl: './get-source-accordion.component.html',
  standalone: true,
  imports: [
    IonAccordion,
    IonItem,
    IonLabel,
    TranslateModule,
    GetSourceCodeComponent
  ],
})
export class GetSourceAccordionComponent {
  translate = inject(TranslateService);

  @Input() lang!: string;
  @Input() appNameKey!: AppKey;
  @Input() disableAccordion = true;

}
