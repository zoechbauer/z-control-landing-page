import { Component, ViewChild } from '@angular/core';
import { addIcons } from 'ionicons';
import {
  personOutline,
  mailOutline,
  locationOutline,
  chevronUpOutline,
  chevronDownOutline,
  listOutline,
} from 'ionicons/icons';
import {
  IonFooter,
  IonToolbar,
  IonIcon,
  IonButton,
  ModalController,
} from '@ionic/angular/standalone';

import { environment } from 'src/environments/environment';
import { MarkdownViewerComponent } from '../markdown-viewer/markdown-viewer.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [IonFooter, IonToolbar, IonIcon, IonButton],
})
export class FooterComponent {
  showDetails = false;

  constructor(private modalController: ModalController) {
    this.registerIcons();
  }

  toggleFooterDetails() {
    this.showDetails = !this.showDetails;
  }

  async openChangelog() {
    const modal = await this.modalController.create({
      component: MarkdownViewerComponent,
    });

    await modal.present();
  }

  get versionInfo() {
    const { major, minor, date } = {
      major: environment.version.major,
      minor: environment.version.minor,
      date: environment.version.date,
    };
    return `Version ${major}.${minor} (${date})`;
  }

  private registerIcons() {
    addIcons({
      'person-outline': personOutline,
      'mail-outline': mailOutline,
      'location-outline': locationOutline,
      'chevron-up-outline': chevronUpOutline,
      'chevron-down-outline': chevronDownOutline,
      'list-outline': listOutline,
    });
  }
}
