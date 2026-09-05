import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgIf, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  imports: [NgIf, NgTemplateOutlet],
})
export class WelcomeComponent  {
  @Input() selectedLanguage!: string;
  @Input() isAnalyticsEnabled: boolean = false;
  @Output() isAnalyticsEnabledClicked: EventEmitter<void> = new EventEmitter<void>();

  onAnalyticsEnabledClick(): void {
    this.isAnalyticsEnabledClicked.emit();
  }
}
