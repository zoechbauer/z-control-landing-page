import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import {
  IonAccordion,
  IonAccordionGroup,
  IonItem,
  IonLabel,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
} from '@ionic/angular/standalone';

import { APPS } from '@app/shared/GitHubConstants';
import { Tab } from '@app/shared/enums';
import { MultipleLanguageTranslatorSectionParameters } from '@app/shared/app-interfaces';
import { UtilsService } from '@app/services/utils.service';
import { OpenSourceAppsComponent } from '@ui/shared/open-source-apps/open-source-apps.component';
import { FeedbackAppsComponent } from '@ui/shared/feedback-apps/feedback-apps.component';
import { PrivacyPolicyAppsComponent } from '@ui/shared/privacy-policy-apps/privacy-policy-apps.component';
import { ChangeLogAppsComponent } from '@ui/shared/change-log-apps/change-log-apps.component';
import { SourceCodeAppsComponent } from '@ui/shared/source-code-apps/source-code-apps.component';
import { MobileAppAppsComponent } from '@ui/shared/mobile-app-apps/mobile-app-apps.component';
import { HelpAppsComponent } from '@ui/shared/help-apps/help-apps.component';
import { WebAppAppsComponent } from '../../shared/web-app-apps/web-app-apps.component';

@Component({
  selector: 'app-multi-language-translator-section',
  templateUrl: './multi-language-translator-section.component.html',
  styleUrls: ['./multi-language-translator-section.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    IonIcon,
    IonCard,
    IonAccordion,
    IonAccordionGroup,
    IonItem,
    IonLabel,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    TranslatePipe,
    OpenSourceAppsComponent,
    FeedbackAppsComponent,
    PrivacyPolicyAppsComponent,
    ChangeLogAppsComponent,
    MobileAppAppsComponent,
    HelpAppsComponent,
    SourceCodeAppsComponent,
    WebAppAppsComponent,
  ],
})
export class MultiLanguageTranslatorSectionComponent {
  readonly utilsService = inject(UtilsService);

  @Input() parameters?: MultipleLanguageTranslatorSectionParameters;
  @Input() isAnalyticsEnabled = false;
  @Output() accordionChange = new EventEmitter<CustomEvent>();

  selectedSubAccordion: string = '';
  Tab = Tab;
  APPS = APPS;

  /**
   * Set the currently selected sub-accordion.
   * @param event The custom event emitted when a sub-accordion changes.
   */
  subAccordionChange(event?: CustomEvent) {
    this.selectedSubAccordion = event?.detail?.value || '';
  }

  /**
   * Gets the tooltip text for an accordion or sub-accordion.
   * @param value The value of the accordion or sub-accordion.
   * @param isSubAccordion Indicates whether the tooltip is for a sub-accordion (default: true).
   * @returns The tooltip text for the specified accordion or sub-accordion.
   */
  getAccordionTooltip(value: string, isSubAccordion: boolean = true): string {
    if (!isSubAccordion) {
      return this.utilsService.getAccordionTooltip(
        this.parameters?.appSectionParameters?.selectedLanguage || 'en',
        APPS.MULTI_LANGUAGE_TRANSLATOR,
        this.parameters?.appSectionParameters?.currentMainAccordion || '',
        value,
      );
    }
    return this.utilsService.getSubAccordionTooltip(
      this.parameters?.appSectionParameters?.selectedLanguage || 'en',
      this.selectedSubAccordion,
      value,
    );
  }
}
