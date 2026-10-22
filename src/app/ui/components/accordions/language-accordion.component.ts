import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonAccordion,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UtilsService } from '@app/services/utils.service';
import { EventEnum, SettingsAccordion } from '@app/shared/enums';
import { FirebaseFirestoreLandingPageVisitService } from 'src/app/services/firebase-firestore-landing-page-visit.service';

@Component({
  selector: 'app-language-accordion',
  templateUrl: './language-accordion.component.html',
  standalone: true,
  imports: [
    IonAccordion,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    TranslateModule,
    CommonModule,
    FormsModule,
  ],
})
export class LanguageAccordionComponent {
  translate = inject(TranslateService);
  readonly utilsService = inject(UtilsService);
  private readonly fbLandingPageVisitService = inject(
    FirebaseFirestoreLandingPageVisitService,
  );

  @Input() lang!: string;
  @Input() isAnalyticsEnabled!: boolean;
  @Input() showAllAccordions!: boolean;

  SettingsAccordion = SettingsAccordion;

  /**
   * Calls logLanguageChange when there is a change in language selection.
   * @param event The event object containing the new language selection.
   */
  async onLanguageChange(event: any) {
    await this.logLanguageChange(this.lang);
  }

  /**
   * Logs a language change if analytics is disabled for the given language.
   * @param lang The language code for which to log the language change.
   */
  private async logLanguageChange(lang: string) {
    if (!this.isAnalyticsEnabled) {
      const event =
        lang === 'de' ? EventEnum.LANG_CHG_DE : EventEnum.LANG_CHG_EN;
      await this.fbLandingPageVisitService.logLandingPageVisit(false, event);
    }
  }
}
