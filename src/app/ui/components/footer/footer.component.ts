import { Component } from '@angular/core';
import { addIcons } from 'ionicons';
import {
  personOutline,
  mailOutline,
  locationOutline,
  chevronUpOutline,
  chevronDownOutline,
} from 'ionicons/icons';
import {
  IonFooter,
  IonToolbar,
  IonIcon,
  IonButton,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [IonFooter, IonToolbar, IonIcon, IonButton],
})
export class FooterComponent {
  showDetails = false;

  constructor() {
    this.registerIcons();
  }

  toggleFooterDetails() {
    this.showDetails = !this.showDetails;
  }

  private registerIcons() {
    addIcons({
      'person-outline': personOutline,
      'mail-outline': mailOutline,
      'location-outline': locationOutline,
      'chevron-up-outline': chevronUpOutline,
      'chevron-down-outline': chevronDownOutline,
    });
  }
}
