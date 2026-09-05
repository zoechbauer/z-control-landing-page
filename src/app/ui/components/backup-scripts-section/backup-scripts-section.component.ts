import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { TranslatePipe } from '@ngx-translate/core';

import { APPS } from '@app/shared/GitHubConstants';
import { BackupScriptsSectionParameters } from '@app/shared/app-interfaces';
import { UtilsService } from '@app/services/utils.service';
import { OpenSourceAppsComponent } from '@ui/shared/open-source-apps/open-source-apps.component';
import { FeedbackAppsComponent } from '@ui/shared/feedback-apps/feedback-apps.component';
import { SourceCodeAppsComponent } from '@ui/shared/source-code-apps/source-code-apps.component';

@Component({
  selector: 'app-backup-scripts-section',
  templateUrl: './backup-scripts-section.component.html',
  styleUrls: ['./backup-scripts-section.component.scss'],
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
    SourceCodeAppsComponent
  ],
})
export class BackupScriptsSectionComponent {
  readonly utilsService = inject(UtilsService);

  @Input() parameters?: BackupScriptsSectionParameters;
  @Input() isAnalyticsEnabled = false;
  @Output() accordionChange = new EventEmitter<CustomEvent>();

  selectedSubAccordion: string = '';

  /**
   * Opens a Markdown documentation file in a new tab.
   * @param docPath The path to the Markdown documentation file.
   */
  async onOpenMarkdownDoc(docPath: string) {
    await this.utilsService.openMarkdownDoc(docPath);
  }

  /**
   * Handles the change event for a sub-accordion.
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
        APPS.BACKUP_SCRIPTS,
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
