import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonIcon, IonButton } from '@ionic/angular/standalone';
import { Tab } from '@app/shared/enums';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  imports: [IonButton, IonIcon, NgIf, NgTemplateOutlet, RouterModule],
})
export class WelcomeComponent {
  private readonly utilsService = inject(UtilsService);
  
  @Input() selectedLanguage!: string;
  @Input() isAnalyticsEnabled: boolean = false;
  @Output() isAnalyticsEnabledClicked: EventEmitter<void> =
    new EventEmitter<void>();

  Tab = Tab;

  /**
   * Returns the link to the privacy policy page based on the selected language.
   */
  get privacyPolicyLink() {
    return ['/privacy', 'landing-page', this.selectedLanguage || 'en'];
  }

  /**
   * Splits the given text into two parts with a line break after the first period if on a large screen.
   *
   * @param text The text to be split into two parts
   * @returns The transformed text with a line break after the first period if on a large screen, otherwise the original text.
   */
  splitText(text: string): string {
    if (!this.utilsService.isSmallScreen) {
      const point = text.indexOf('.');
      const part1 = text.slice(0, point);
      const part2 = text.slice(point + 1);
      return part1 + '.<br />' + part2;
    }
    return text;
  }

  /**
   * Handles the click event when the user enables analytics.
   */
  onAnalyticsEnabledClick(): void {
    this.isAnalyticsEnabledClicked.emit();
  }
}
