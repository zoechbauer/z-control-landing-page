import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonToolbar, IonButton, IonButtons, IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-consent-banner',
  templateUrl: './consent-banner.component.html',
  styleUrls: ['./consent-banner.component.scss'],
  standalone: true,
  imports: [CommonModule, IonToolbar, IonButton, IonButtons, IonText],
})
export class ConsentBannerComponent {
  @Output() consent = new EventEmitter<boolean>();

  accept() {
    this.consent.emit(true);
  }

  decline() {
    this.consent.emit(false);
  }
}