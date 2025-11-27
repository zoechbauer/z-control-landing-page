import { Component, OnInit } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonAccordionGroup,
  ModalController,
  IonItem,
  IonLabel,
  IonAccordion,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, logoGithub, alertCircleOutline } from 'ionicons/icons';
import {
  COLLECTION,
  REPO,
  GithubAnalyticsTrafficDocument,
  ALL_REPOS,
} from 'shared/GitHubConstants';

import { FirebaseAnalyticsService } from 'src/app/services/firebase-analytics.service';
import { FirebaseFirestoreService } from 'src/app/services/firebase-firestore.service';

@Component({
  selector: 'app-github-analytics',
  templateUrl: './github-analytics.component.html',
  styleUrls: ['./github-analytics.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonAccordion,
    IonAccordionGroup,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonTitle,
    IonToolbar,
    JsonPipe,
  ],
})
export class GithubAnalyticsComponent implements OnInit {
  analyticsData: GithubAnalyticsTrafficDocument[] = [];
  isMobilePortrait = false;

  constructor(
    private readonly fa: FirebaseAnalyticsService,
    private readonly firestoreService: FirebaseFirestoreService,
    private readonly modalController: ModalController
  ) {
    addIcons({ closeOutline, alertCircleOutline, logoGithub });
  }

  ngOnInit() {
    this.registerIcons();
    this.showAnalyticsData();
    this.checkOrientation();
    window.addEventListener('resize', () => this.checkOrientation());
  }

  /**
   * Returns the total views count for a repository.
   * @param item - The analytics document for the repository.
   * @returns Total views count.
   */
  getViewsTotalCount(item: GithubAnalyticsTrafficDocument): number {
    return item.views.views.reduce((sum, v) => sum + v.count, 0);
  }

  /**
   * Returns the total unique views for a repository.
   * @param item - The analytics document for the repository.
   * @returns Total unique views count.
   */
  getViewsTotalUniques(item: GithubAnalyticsTrafficDocument): number {
    return item.views.views.reduce((sum, v) => sum + v.uniques, 0);
  }

  /**
   * Returns the total clones count for a repository.
   * @param item - The analytics document for the repository.
   * @returns Total clones count.
   */
  getClonesTotalCount(item: GithubAnalyticsTrafficDocument): number {
    return item.clones.clones.reduce((sum, c) => sum + c.count, 0);
  }

  /**
   * Returns the total unique clones for a repository.
   * @param item - The analytics document for the repository.
   * @returns Total unique clones count.
   */
  getClonesTotalUniques(item: GithubAnalyticsTrafficDocument): number {
    return item.clones.clones.reduce((sum, c) => sum + c.uniques, 0);
  }

  /**
   * Gets the oldest timestamp from views and clones data.
   * @param item - The analytics document for the repository.
   * @returns The oldest Date or null if no data.
   */
  getOldestItem(item: GithubAnalyticsTrafficDocument): Date | null {
    const allTimestamps = [
      ...item.views.views.map((v) => v.timestamp),
      ...item.clones.clones.map((c) => c.timestamp),
    ];
    if (allTimestamps.length === 0) return null;
    const oldest = allTimestamps.reduce(
      (min, ts) => (new Date(ts) < new Date(min) ? ts : min),
      allTimestamps[0]
    );
    return new Date(oldest);
  }

  /**
   * Gets the most recent timestamp from views and clones data.
   * @param item - The analytics document for the repository.
   * @returns The most recent Date or null if no data.
   */
  getMostRecentItem(item: GithubAnalyticsTrafficDocument): Date | null {
    const allTimestamps = [
      ...item.views.views.map((v) => v.timestamp),
      ...item.clones.clones.map((c) => c.timestamp),
    ];
    if (allTimestamps.length === 0) return null;
    const newest = allTimestamps.reduce(
      (max, ts) => (new Date(ts) > new Date(max) ? ts : max),
      allTimestamps[0]
    );
    return new Date(newest);
  }

  /**
   * Closes the modal dialog.
   */
  closeModal() {
    this.modalController.dismiss();
  }

  /**
   * Opens the GitHub source code page for the given repository in a new tab and logs the event.
   * @param repo - The repository name.
   */
  onGetSourceCode(repo: (typeof REPO)[keyof typeof REPO]) {
    try {
      globalThis.window.open(this.getSourceCodeUrl(repo), '_blank');
      this.fa.logEvent('get_source_code', {
        repo: repo,
        app: REPO.Z_CONTROL_LANDING_PAGE,
      });
    } catch (error) {
      console.error('Error opening source code URL:', error);
    }
  }

  /**
   * Checks if the device is in portrait mode and has a small screen width.
   * Sets isMobilePortrait to true if so.
   */
  private checkOrientation(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    // Consider mobile if width <= 600px and portrait
    this.isMobilePortrait = width <= 600 && height > width;
  }

  private getSourceCodeUrl(repo: (typeof REPO)[keyof typeof REPO]): string {
    return `https://github.com/zoechbauer/${repo}`;
  }

  private registerIcons() {
    addIcons({
      'close-outline': closeOutline,
      'logo-github': logoGithub,
      'alert-circle-outline': alertCircleOutline,
    });
  }

  private async showAnalyticsData() {
    const collection = COLLECTION.GITHUB_ANALYTICS_TRAFFIC_HISTORY;
    const repo = ALL_REPOS;
    const useFirebaseEmulator = false;

    this.analyticsData = await this.firestoreService.getAnalyticsData(
      collection,
      repo,
      useFirebaseEmulator
    );
  }
}
