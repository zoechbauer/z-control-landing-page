import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import {
  IonButton,
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

import { APPS, AppKey } from '@app/shared/GitHubConstants';
import { BackendFunctionsSectionParameters } from '@app/shared/app-interfaces';
import { UtilsService } from '@app/services/utils.service';
import { OpenSourceAppsComponent } from '@ui/shared/open-source-apps/open-source-apps.component';
import { FeedbackAppsComponent } from '@ui/shared/feedback-apps/feedback-apps.component';
import { ChangeLogAppsComponent } from '@ui/shared/change-log-apps/change-log-apps.component';
import { SourceCodeAppsComponent } from '@ui/shared/source-code-apps/source-code-apps.component';
@Component({
  selector: 'app-backend-functions-section',
  templateUrl: './backend-functions-section.component.html',
  styleUrls: ['./backend-functions-section.component.scss'],
  imports: [
    CommonModule,
    IonIcon,
    IonCard,
    IonButton,
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
    ChangeLogAppsComponent,
    SourceCodeAppsComponent,
  ],
})
export class BackendFunctionsSectionComponent {
  readonly utilsService = inject(UtilsService);

  @Input() parameters?: BackendFunctionsSectionParameters;
  @Input() isAnalyticsEnabled = false;
  @Output() accordionChange = new EventEmitter<CustomEvent>();

  selectedSubAccordion: string = '';

  /**
   * Opens the GitHub analytics page for the currently selected accordion.
   */
  async onOpenGitHubAnalytics() {
    const lang = this.parameters?.appSectionParameters.selectedLanguage || 'en';
    const selectedAccordion = this.parameters?.appSectionParameters
      .selectedAccordion as AppKey;

    await this.utilsService.openGitHubAnalytics(selectedAccordion, lang);
  }

  /**
   * Opens the specified markdown document in a new window.
   * @param docPath The path to the markdown document to be opened.
   */
  async onOpenMarkdownDoc(docPath: string) {
    await this.utilsService.openMarkdownDoc(docPath);
  }

  /**
   * Sets the currently selected sub-accordion.
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
        APPS.BACKEND_FUNCTIONS,
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
