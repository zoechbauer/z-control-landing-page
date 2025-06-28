import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  personOutline,
  mailOutline,
  locationOutline,
  logoGooglePlaystore,
} from 'ionicons/icons';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonButton,
  IonAccordion,
  IonAccordionGroup,
  IonItem,
  IonLabel,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonFooter,
} from '@ionic/angular/standalone';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonCard,
    IonButton,
    IonIcon,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonAccordion,
    IonAccordionGroup,
    IonItem,
    IonLabel,
    RouterModule,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonFooter,
  ],
})
export class HomePage implements AfterViewInit {
  @ViewChild('accordionGroup') accordionGroup!: IonAccordionGroup;
  maxInputLength = 1000;
  selectedAccordion: string = '';
  currentMainAccordion: string = '';
  subAccordionOpened: boolean = false;

  constructor() {
    this.registerIcons();
  }

  private registerIcons() {
    addIcons({
      'person-outline': personOutline,
      'mail-outline': mailOutline,
      'location-outline': locationOutline,
      'logo-google-playstore': logoGooglePlaystore,
    });
  }

  ngAfterViewInit() {
    if (this.accordionGroup) {
      this.accordionGroup.value = 'group 1';
      this.setSelectedAccordion('group 1');
    }
  }

  accordionGroupChange(event: CustomEvent) {
    const value = event.detail.value;

    // Only handle main accordion changes
    if (value === 'group 1') {
      this.currentMainAccordion = 'group 1';
      this.setSelectedAccordion('group 1');
      this.subAccordionOpened = false;
    } else if (value === 'group 2') {
      this.currentMainAccordion = 'group 2';
      this.setSelectedAccordion('group 2');
      this.subAccordionOpened = false;
    } else if (value === undefined || value === '' || value === null) {
      // it could be main accordion closing or sub-accordion activity
      // only clear if main accordion is closed
      this.handlePotentialMainAccordionClose();
    }
    // For all other values (sub-accordion values like '1a', '1b', '1c', '1e', etc.)
    // we do nothing - keep the current header text
  }

  private handlePotentialMainAccordionClose() {
    if (!this.subAccordionOpened) {
      // Main accordion is actually closing
      this.currentMainAccordion = '';
      this.selectedAccordion = '';
    } else {
      // This was triggered by sub-accordion activity - keep header
      // Reset the flag for next time
      this.subAccordionOpened = false;
    }
  }

  subAccordionChange(parentGroup?: string) {
    this.subAccordionOpened = true;
    console.log(`Sub-accordion changed, parent: ${parentGroup}`);
  }

  setSelectedAccordion(group: string) {
    switch (group) {
      case 'group 1':
        this.selectedAccordion = 'z-control QR Code App';
        break;
      case 'group 2':
        this.selectedAccordion = 'Other Apps';
        break;
      case undefined:
      case '':
        this.selectedAccordion = '';
        break;
      default:
        this.selectedAccordion = '';
    }
  }
}
