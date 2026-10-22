import { Injectable, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';

import {
  ALL_REPOS,
  COLLECTION,
  GithubAnalyticsTrafficDocument,
  GithubArrayTrafficEntry,
  REPO,
  REPOS,
  TrafficType,
} from 'src/app/shared/github.constants';
import { FirebaseFirestoreAdapterService } from './firebase-firestore-adapter.service';

@Injectable({
  providedIn: 'root',
})
export class FirebaseFirestoreGithubService {
  private readonly firebaseFirestoreAdapter = inject(FirebaseFirestoreAdapterService);

  private readonly firestore = inject(Firestore);

  private collection: (typeof COLLECTION)[keyof typeof COLLECTION] =
    COLLECTION.GITHUB_ANALYTICS_TRAFFIC_HISTORY;
  private useFirebaseEmulator = false;

  /**
   * Retrieves analytics data for a specified collection and repository from Firestore.
   * If the repository is set to ALL_REPOS, it fetches analytics data for each repository in the REPOS list.
   * Otherwise, it fetches analytics data for the specified repository.
   *
   * @param collection - The Firestore collection to query, as defined in COLLECTION.
   * @param repo - The repository to fetch analytics for, as defined in REPO. Use ALL_REPOS to fetch for all repositories.
   * @param useFirebaseEmulator - Optional. Whether to use the Firebase emulator. Defaults to false.
   * @returns A promise that resolves to an array of GithubAnalyticsTrafficDocument objects containing analytics data.
   */
  async getAnalyticsData(
    collection: (typeof COLLECTION)[keyof typeof COLLECTION],
    repo: (typeof REPO)[keyof typeof REPO],
    useFirebaseEmulator = false,
  ): Promise<GithubAnalyticsTrafficDocument[]> {
    const analyticsDataArr: GithubAnalyticsTrafficDocument[] = [];
    this.collection = collection;
    this.useFirebaseEmulator = useFirebaseEmulator;

    if (repo === ALL_REPOS) {
      await Promise.all(
        REPOS.map(async (repoEntry) => {
          const analyticsData = await this.fetchAnalyticsForRepo(repoEntry.repo);
          analyticsDataArr.push(analyticsData);
        }),
      );
    } else {
      const analyticsData = await this.fetchAnalyticsForRepo(repo);
      analyticsDataArr.push(analyticsData);
    }

    return analyticsDataArr;
  }

  /**
   * Fetches analytics data for a specific GitHub repository from Firestore.
   *
   * If the Firebase emulator is enabled, connects to the local Firestore emulator.
   * Retrieves the analytics document for the repository and processes its data.
   *
   * Note: There is a small difference in structure between the
   * GITHUB_ANALYTICS_TRAFFIC and GITHUB_ANALYTICS_TRAFFIC_HISTORY collections:
   * - GITHUB_ANALYTICS_TRAFFIC: The 'views' and 'clones' fields are objects containing an array under 'views' and 'clones' keys, respectively (e.g., views.views, clones.clones).
   * - GITHUB_ANALYTICS_TRAFFIC_HISTORY: The 'views' and 'clones' fields are already arrays.
   * This function normalizes the data structure for downstream processing.
   *
   * Creates a repository document with empty statistics if no analytics data is found for the repository, ensuring that all repositories are represented in the results.
   *
   * @param repo - The GitHub repository for which to fetch analytics data.
   * @returns {Promise<GithubAnalyticsTrafficDocument>} A promise that resolves to the processed analytics data.
   */
  private async fetchAnalyticsForRepo(repo: string): Promise<GithubAnalyticsTrafficDocument> {
    if (this.useFirebaseEmulator) {
      console.log('Using Firebase Emulator for Firestore');
      this.firebaseFirestoreAdapter.connectEmulator('localhost', 8080);
    }

    const docSnap = await this.firebaseFirestoreAdapter.getDocSnapshot(
      this.collection,
      repo,
    );

    if (docSnap.exists()) {
      const data = docSnap.data();
      let processingData = data;

      if (this.collection === COLLECTION.GITHUB_ANALYTICS_TRAFFIC) {
        // there is a small difference in structure between TRAFFIC and TRAFFIC_HISTORY
        processingData = {
          views: data['views']['views'] || [],
          clones: data['clones']['clones'] || [],
          timestamp: data['timestamp'] || '',
        };
      }

      return this.processData(repo, processingData);
    }
    // If no analytics data is found, create a repository with empty statistics.
    return this.createRepoWithEmptyStatistics(repo);
  }

  /**
   * Processes analytics data and logs results.
   * @param repo - The GitHub repository for which the analytics data is being processed.
   * @param data - Raw analytics data from Firestore.
   * @private
   */
  private processData(repo: string, data: any): GithubAnalyticsTrafficDocument {
    try {
      const viewsArr = data?.views ?? [];
      const clonesArr = data?.clones ?? [];
      const timestamp = data?.timestamp ?? '';

      const viewsDoc = this.processStatistics(
        repo,
        TrafficType.VIEWS,
        viewsArr,
        timestamp,
      );
      const clonesDoc = this.processStatistics(
        repo,
        TrafficType.CLONES,
        clonesArr,
        timestamp,
      );

      return this.mergeDocuments(repo, viewsDoc, clonesDoc);
    } catch (error) {
      console.error('Error processing analytics data:', error);
      throw error;
    }
  }

  /**
   * Aggregates statistics for views or clones.
   * @param repo - The GitHub repository for which to aggregate statistics.
   * @param type - Traffic type (views or clones).
   * @param data - Array of traffic entries.
   * @param timestamp - Timestamp for the analytics document.
   * @returns Aggregated analytics document.
   * @private
   */
  private processStatistics(
    repo: string,
    type: TrafficType,
    data: GithubArrayTrafficEntry[],
    timestamp: string,
  ): GithubAnalyticsTrafficDocument {
    let totalCount = 0;
    let totalUniques = 0;
    const dailyEntries: GithubArrayTrafficEntry[] = [];

    // Sort entries by timestamp descending
    data.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));

    for (const entry of data) {
      totalCount += entry.count || 0;
      totalUniques += entry.uniques || 0;
      dailyEntries.push(entry);
    }

    // Build the analytics document
    return {
      collection: this.collection,
      repo,
      timestamp,
      views: {
        count: type === TrafficType.VIEWS ? totalCount : 0,
        uniques: type === TrafficType.VIEWS ? totalUniques : 0,
        views: type === TrafficType.VIEWS ? dailyEntries : [],
      },
      clones: {
        count: type === TrafficType.CLONES ? totalCount : 0,
        uniques: type === TrafficType.CLONES ? totalUniques : 0,
        clones: type === TrafficType.CLONES ? dailyEntries : [],
      },
    };
  }

  /**
   * Merges two analytics documents into one.
   * @param doc1 - First analytics document.
   * @param doc2 - Second analytics document.
   * @returns Merged analytics document.
   * @private
   */
  private mergeDocuments(
    repo: string,
    doc1: GithubAnalyticsTrafficDocument,
    doc2: GithubAnalyticsTrafficDocument,
  ): GithubAnalyticsTrafficDocument {
    return {
      collection: this.collection,
      repo: repo,
      timestamp: doc2.timestamp,
      views: {
        count: doc1.views.count + doc2.views.count,
        uniques: doc1.views.uniques + doc2.views.uniques,
        views: [...doc1.views.views, ...doc2.views.views],
      },
      clones: {
        count: doc1.clones.count + doc2.clones.count,
        uniques: doc1.clones.uniques + doc2.clones.uniques,
        clones: [...doc1.clones.clones, ...doc2.clones.clones],
      },
    };
  }

  private createRepoWithEmptyStatistics(
    repo: (typeof REPO)[keyof typeof REPO],
  ): GithubAnalyticsTrafficDocument {
    return {
      collection: this.collection,
      repo,
      timestamp: '',
      views: { count: 0, uniques: 0, views: [] },
      clones: { count: 0, uniques: 0, clones: [] },
    };
  }
}
