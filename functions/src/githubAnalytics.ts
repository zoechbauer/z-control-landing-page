import { https, scheduler } from 'firebase-functions/v2';
import * as logger from 'firebase-functions/logger';
import * as admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { REPOS, COLLECTION } from './shared/GitHubConstants';

interface GithubTrafficEntry {
  timestamp?: string;
  date?: string;
  count?: number;
  uniques?: number;
}

// Temporary logs for debugging
let logInfo: {
  calledBy?: string;
  repo?: string;
  analyticsData?: unknown;
  updateData?: unknown;
} = {};

// Load dotenv for local test with firebase emulators
// GITHUB_TOKEN for production must be defined as environment variable in https://console.cloud.google.com/functions
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  path: require('node:path').resolve(__dirname, '../../.env.local'),
});

admin.initializeApp();

/**
 * Fetches traffic analytics data from GitHub for the specified
 * repository and endpoint.
 * @param {string} owner - Repository owner (GitHub username).
 * @param {string} repo - Repository name.
 * @param {string} endpoint - Traffic endpoint ('views' or 'clones').
 * @return {Promise<unknown>} Resolves to the traffic data as a JSON object.
 */
const fetchTraffic = async (
  owner: string,
  repo: string,
  endpoint: string
): Promise<unknown> => {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
  if (!GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN is not defined');
  }
  const url = `https://api.github.com/repos/${owner}/${repo}/traffic/${endpoint}`;
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });
    if (!response.ok) {
      throw new Error(
        `GitHub API error: ${response.status} ${response.statusText}`
      );
    }
    return await response.json();
  } catch (error) {
    logger.error(
      `Failed to fetch traffic for ${owner}/${repo} (${endpoint}):`,
      error
    );
    throw error;
  }
};

/**
 * Fetches GitHub analytics traffic data (views and clones) for each repository
 * in `REPOS`,  * optionally updates the Firestore collection with the latest
 * traffic data, and saves the traffic history for each repository.
 *
 * @param {boolean} updateTraffic - If `true`,
 *        updates the Firestore collection with the latest traffic data.
 * @param {number} [repoIndex] - Optional index of the repository in `REPOS`
 * @return {Promise<void>} A Promise that resolves
 *        when all analytics data has been fetched and processed.
 */
export const runGitHubAnalyticsFetch = async (
  updateTraffic = true,
  repoIndex?: number
): Promise<void> => {
  // If repoIndex is a valid number, process only that repo
  if (
    typeof repoIndex === 'number' &&
    repoIndex >= 0 &&
    repoIndex < REPOS.length
  ) {
    const { owner, repo } = REPOS[repoIndex];
    await processRepo(owner, repo, updateTraffic);
    // If repoIndex is missing or invalid, process all repos
  } else {
    for (const { owner, repo } of REPOS) {
      await processRepo(owner, repo, updateTraffic);
    }
  }
};

const processRepo = async (
  owner: string,
  repo: string,
  updateTraffic: boolean
): Promise<void> => {
  try {
    const views = await fetchTraffic(owner, repo, 'views');
    const clones = await fetchTraffic(owner, repo, 'clones');
    if (updateTraffic) {
      await admin
        .firestore()
        .collection(COLLECTION.GITHUB_ANALYTICS_TRAFFIC)
        .doc(repo)
        .set({
          timestamp: new Date().toISOString(),
          views,
          clones,
        });
    }
    await saveGithubAnalyticsTrafficHistory(owner, repo);
  } catch (error) {
    logger.error(`Error fetching analytics for ${repo}:`, error);
  }
};

/**
 * Persists daily GitHub analytics data in Firestore.
 * The 'githubAnalyticsTrafficHistory' collection holds historical data
 * for each day, appending new entries to an array in each repo document.
 * Each document in 'githubAnalyticsTrafficHistory' matches the structure of
 * 'githubAnalyticsTraffic', but contains a 'views' and 'clones' array with all
 * daily entries since the function started.
 * @param {string} owner - GitHub repository owner.
 * @param {string} repo - GitHub repository name.
 */
export const saveGithubAnalyticsTrafficHistory = async (
  owner: string,
  repo: string
): Promise<void> => {
  try {
    // Get latest analytics snapshot for the repo
    const docRef = admin
      .firestore()
      .collection(COLLECTION.GITHUB_ANALYTICS_TRAFFIC)
      .doc(repo);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      console.warn(`No analytics data found for ${repo}.`);
      return;
    }

    const analyticsData = docSnap.data();
    if (
      !analyticsData?.views ||
      !Array.isArray(analyticsData?.views.views) ||
      !analyticsData?.clones ||
      !Array.isArray(analyticsData?.clones.clones)
    ) {
      console.warn(`Invalid analytics data structure for ${repo}.`);
      return;
    }

    const docRefHistory = admin
      .firestore()
      .collection(COLLECTION.GITHUB_ANALYTICS_TRAFFIC_HISTORY)
      .doc(repo);
    const docSnapHistory = await docRefHistory.get();

    // Always set repo field and timestamp
    const updateData: Record<string, unknown> = {
      repo,
      timestamp: new Date().toISOString(),
    };

    if (docSnapHistory.exists) {
      // Subsequent runs: only append yesterday's views/clones if found
      const now = new Date();
      now.setDate(now.getDate() - 1);
      const yesterday = now.toISOString().slice(0, 10); // YYYY-MM-DD

      const yesterdayViews = analyticsData.views.views.find(
        (v: GithubTrafficEntry) =>
          v.timestamp?.slice(0, 10) === yesterday || v.date === yesterday
      );
      const yesterdayClones = analyticsData.clones.clones.find(
        (c: GithubTrafficEntry) =>
          c.timestamp?.slice(0, 10) === yesterday || c.date === yesterday
      );
      if (yesterdayViews) {
        updateData.views = FieldValue.arrayUnion(yesterdayViews);
      }
      if (yesterdayClones) {
        updateData.clones = FieldValue.arrayUnion(yesterdayClones);
      }
    } else {
      // First run: append all entries from githubAnalyticsTraffic
      updateData.views = analyticsData.views.views ?? [];
      updateData.clones = analyticsData.clones.clones ?? [];
      if (
        !(updateData.views as GithubTrafficEntry[]).length &&
        !(updateData.clones as GithubTrafficEntry[]).length
      ) {
        updateData.initialized = true;
      }
    }

    if (logInfo.calledBy === 'testGitHubAnalytics') {
      logger.log('[DEBUG] analyticsData:', analyticsData);
      logger.log('[DEBUG] updateData:', updateData);
      logInfo = {
        repo,
        analyticsData,
        updateData,
        calledBy: logInfo.calledBy,
      };
    }

    await docRefHistory.set(updateData, { merge: true });
  } catch (error) {
    logger.error(
      `[ERROR] saveGithubAnalyticsTrafficHistory for ${repo}:`,
      error
    );
  }
};

/**
 * Scheduled function to fetch GitHub analytics and store in Firestore.
 * Runs every day at 03:00 AM Europe/Vienna time to be sure that GitHub
 * has finalized the previous day's data.
 *
 * cron expression '0 3 * * *' means:
 * minute: 0
 * hour: 3
 * day: every day
 * month: every month
 * day-of-week: every day of the week
 */
export const fetchGitHubAnalytics = scheduler.onSchedule(
  {
    schedule: '0 3 * * *', // Runs at 03:00 AM local time
    timeZone: 'Europe/Vienna',
  },
  async () => {
    await runGitHubAnalyticsFetch();
  }
);

/**
 * HTTP function for testing of GitHub analytics fetch.
 * examples:
 * curl "http://localhost:5001/<project-id>/us-central1/testGitHubAnalytics
 *    ?updateTraffic=false"&repoIndex=0 -> updateTraffic=false, only first repo
 * curl "http://localhost:5001/<project-id>/us-central1/testGitHubAnalytics"
 *    -> updateTraffic=true & process all repos
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @returns {Promise<void>} Resolves when response is sent.
 */
export const testGitHubAnalytics = https.onRequest(
  async (req, res) => {
    try {
      logInfo.calledBy = 'testGitHubAnalytics';
      const updateTraffic = req.query.updateTraffic !== 'false';
      const repoIndexString = req.query.repoIndex;
      const repoIndex = repoIndexString ?
        Number.parseInt(repoIndexString as string, 10) :
        undefined;

      await runGitHubAnalyticsFetch(updateTraffic, repoIndex);

      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({
        message: 'GitHub analytics fetched and stored.',
        logInfo: logInfo,
      });
    } catch (error) {
      logger.error('Error in testGitHubAnalytics:', error);
      // Send error details in response
      res.status(500).json({
        error: `Internal Server Error: ${
          error instanceof Error ? error.message : String(error)
        }`,
      });
    }
  }
);
