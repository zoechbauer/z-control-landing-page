import { Injectable } from '@angular/core';
import {
  getFirestore,
  doc,
  getDoc,
  connectFirestoreEmulator,
} from 'firebase/firestore';
import {
  REPO,
  REPOS,
  COLLECTION,
  GithubArrayTrafficEntry,
  GithubAnalyticsTrafficDocument,
  TrafficType,
  ALL_REPOS,
} from '../../../shared/GitHubConstants';

@Injectable({
  providedIn: 'root',
})
export class FirebaseFirestoreService {
  private repo: (typeof REPO)[keyof typeof REPO] = REPOS[0].repo; // z-control-landing-page
  private collection: (typeof COLLECTION)[keyof typeof COLLECTION] =
    COLLECTION.GITHUB_ANALYTICS_TRAFFIC_HISTORY;
  private useFirebaseEmulator: boolean = false;
  private readonly db = getFirestore();

  constructor() {}

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
    useFirebaseEmulator: boolean = false,
  ): Promise<GithubAnalyticsTrafficDocument[]> {
    let analyticsDataArr: GithubAnalyticsTrafficDocument[] = [];
    this.collection = collection;
    this.repo = repo;
    this.useFirebaseEmulator = useFirebaseEmulator;

    if (this.repo == ALL_REPOS) {
      for (const repoEntry of REPOS) {
        this.repo = repoEntry.repo;
        const analyticsData: GithubAnalyticsTrafficDocument =
          await this.fetchAnalyticsForRepo();
        analyticsDataArr.push(analyticsData);
      }
    } else {
      const analyticsData: GithubAnalyticsTrafficDocument =
        await this.fetchAnalyticsForRepo();
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
   * Throws an error if no analytics data is found.
   *
   * @returns {Promise<GithubAnalyticsTrafficDocument>} A promise that resolves to the processed analytics data.
   * @throws {Error} If no analytics data is found for the repository.
   */
  private async fetchAnalyticsForRepo(): Promise<GithubAnalyticsTrafficDocument> {
    if (this.useFirebaseEmulator) {
      console.log('Using Firebase Emulator for Firestore');
      connectFirestoreEmulator(this.db, 'localhost', 8080);
    }
    const docRef = doc(this.db, this.collection, this.repo);
    const docSnap = await getDoc(docRef);

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
      return this.processData(processingData);
    } else {
      console.error('No analytics data found.');
      throw new Error('No analytics data found.');
    }
  }

  /**
   * Processes analytics data and logs results.
   * @param data - Raw analytics data from Firestore.
   * @private
   */
  private processData(data: any): GithubAnalyticsTrafficDocument {
    // Process and log analytics data
    try {
      const viewsArr = data?.views ?? [];
      const clonesArr = data?.clones ?? [];
      const timestamp = data?.timestamp ?? '';

      const viewsDoc = this.processStatistics(
        TrafficType.VIEWS,
        viewsArr,
        timestamp,
      );

      const clonesDoc = this.processStatistics(
        TrafficType.CLONES,
        clonesArr,
        timestamp,
      );

      const mergedDoc = this.mergeDocuments(viewsDoc, clonesDoc);
      return mergedDoc;
    } catch (error) {
      console.error('Error processing analytics data:', error);
      throw error;
    }
  }

  /**
   * Aggregates statistics for views or clones.
   * @param type - Traffic type (views or clones).
   * @param data - Array of traffic entries.
   * @param timestamp - Timestamp for the analytics document.
   * @returns Aggregated analytics document.
   * @private
   */
  private processStatistics(
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
    const analyticsDoc: GithubAnalyticsTrafficDocument = {
      collection: this.collection,
      repo: this.repo,
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

    return analyticsDoc;
  }

  /**
   * Merges two analytics documents into one.
   * @param doc1 - First analytics document.
   * @param doc2 - Second analytics document.
   * @returns Merged analytics document.
   * @private
   */
  private mergeDocuments(
    doc1: GithubAnalyticsTrafficDocument,
    doc2: GithubAnalyticsTrafficDocument,
  ): GithubAnalyticsTrafficDocument {
    const mergedDoc: GithubAnalyticsTrafficDocument = {
      collection: this.collection,
      repo: this.repo,
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
    return mergedDoc;
  }
}
