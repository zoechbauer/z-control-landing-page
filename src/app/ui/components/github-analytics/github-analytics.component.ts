import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule, JsonPipe, NgIf, NgTemplateOutlet } from '@angular/common';
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
  IonSpinner,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import {
  COLLECTION,
  GithubAnalyticsTrafficDocument,
  ALL_REPOS,
} from '@app/shared/GitHubConstants';
import { FirebaseFirestoreService } from '@app/services/firebase-firestore.service';
import { environment } from '@env/environment';
import { UtilsService } from '@app/services/utils.service';
import { GithubAnalyticsDetailsComponent } from '../github-analytics-details/github-analytics-details.component';

@Component({
  selector: 'app-github-analytics',
  templateUrl: './github-analytics.component.html',
  styleUrls: ['./github-analytics.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
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
    IonSpinner,
    NgIf,
    NgTemplateOutlet,
    GithubAnalyticsDetailsComponent,
  ],
})
export class GithubAnalyticsComponent implements OnInit {
  translate = inject(TranslateService);
  private readonly firestoreService = inject(FirebaseFirestoreService);
  private readonly modalController = inject(ModalController);
  private readonly utilsService = inject(UtilsService);

  @Input() lang!: string;

  analyticsData: GithubAnalyticsTrafficDocument[] = [];
  githubTrafficData: GithubAnalyticsTrafficDocument[] = [];
  isMobilePortrait = false;
  isRepoOpened = false;
  isLoading = true;

  ngOnInit() {
    this.init();
  }

  async init() {
    this.isLoading = true;
    this.analyticsData = await this.getAnalyticsData(
      COLLECTION.GITHUB_ANALYTICS_TRAFFIC_HISTORY,
    );
    this.githubTrafficData = await this.getAnalyticsData(
      COLLECTION.GITHUB_ANALYTICS_TRAFFIC,
    );
    this.checkOrientation();
    window.addEventListener('resize', () => this.checkOrientation());
    this.isLoading = false;
  }

  onAccordionGroupChange(event: CustomEvent) {
    const openedRepo = event.detail.value;
    this.isRepoOpened = !!openedRepo;
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
      allTimestamps[0],
    );
    return new Date(newest);
  }

  /**
   * Returns the number of days since the last access for a repository.
   * Dates are normalized to midnight to avoid partial day differences.
   * @param item - The analytics document for the repository.
   * @returns Number of days since the last access, or null if no data is available.
   */
  getLastAccessDays(item: GithubAnalyticsTrafficDocument): number | null {
    const mostRecent = this.getMostRecentItem(item);
    if (!mostRecent) return null;

    const mostRecentDate = new Date(mostRecent).setHours(0, 0, 0, 0);
    const lastUpdate = new Date(item.timestamp).setHours(0, 0, 0, 0);

    const diffTime = Math.abs(lastUpdate - mostRecentDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  /**
   * Closes the modal dialog.
   */
  closeModal() {
    this.modalController.dismiss();
  }

  /**
   * Checks if the device is in portrait mode and has a small screen width.
   * Sets isMobilePortrait to true if so.
   */
  private checkOrientation(): void {
    this.isMobilePortrait =
      this.utilsService.isSmallScreen && this.utilsService.isPortrait;
  }

  /**
   * Fetches analytics data from Firestore and keeps repositories even when they only contain
   * empty statistics.
   *
   * For each document, removes view and clone entries where both `count` and `uniques` are zero.
   * Repositories with no remaining traffic entries are still returned so they can be shown
   * with empty statistics.
   *
   * @param collection - The Firestore collection to query (e.g., GITHUB_ANALYTICS_TRAFFIC_HISTORY).
   * @returns Promise resolving to repository documents with zero-value traffic entries omitted.
   */
  private async getAnalyticsData(
    collection: (typeof COLLECTION)[keyof typeof COLLECTION],
  ): Promise<GithubAnalyticsTrafficDocument[]> {
    const repo = ALL_REPOS;
    const useFirebaseEmulator = environment.useFirebaseEmulator;

    const data: GithubAnalyticsTrafficDocument[] =
      await this.firestoreService.getAnalyticsData(
        collection,
        repo,
        useFirebaseEmulator,
      );

    // Remove zero-value traffic rows, but keep repositories even when both arrays become empty.
    return data.filter((item: GithubAnalyticsTrafficDocument) => {
      item.clones.clones = item.clones.clones.filter(
        (arrItem) => arrItem.count > 0 || arrItem.uniques > 0,
      );
      item.views.views = item.views.views.filter(
        (arrItem) => arrItem.count > 0 || arrItem.uniques > 0,
      );
      return item.views.views && item.clones.clones;
    });
  }
}
