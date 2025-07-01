import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonBadge,
  IonIcon,
  IonButton,
  IonButtons,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, listOutline } from 'ionicons/icons';

import {
  ChangelogService,
  ChangelogEntry,
} from '../../../services/changelog-simple.service';

@Component({
  selector: 'app-changelog',
  templateUrl: './changelog.component.html',
  styleUrls: ['./changelog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonBadge,
    IonIcon,
    IonButton,
    IonButtons,
  ],
})
export class ChangelogComponent implements OnInit {
  changelogEntries: ChangelogEntry[] = [];

  constructor(
    private changelogService: ChangelogService,
    private modalController: ModalController
  ) {
    this.registerIcons();
  }

  ngOnInit() {
    this.loadChangelog();
  }

  private loadChangelog() {
    this.changelogService.getLatestChanges(5).subscribe({
      next: (entries: ChangelogEntry[]) => {
        this.changelogEntries = entries;
      },
      error: (error: any) => {
        console.error('Error loading changelog:', error);
      },
    });
  }

  openChangelog() {
    // Not needed for modal presentation
  }

  closeChangelog() {
    this.modalController.dismiss();
  }

  private registerIcons() {
    addIcons({
      'close-outline': closeOutline,
      'list-outline': listOutline,
    });
  }
}
