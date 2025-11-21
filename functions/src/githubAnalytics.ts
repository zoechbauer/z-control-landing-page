import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

// Load dotenv for local test with firebase emulators
// GITHUB_TOKEN for production must be defined as environment variable in https://console.cloud.google.com/functions
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  path: require('node:path').resolve(__dirname, '../../.env.local'),
});

admin.initializeApp();

const REPOS = [
  { owner: 'zoechbauer', repo: 'copilot-learning-calculator' },
  { owner: 'zoechbauer', repo: 'z-control-qr-code-generator' },
  { owner: 'zoechbauer', repo: 'z-control-landing-page' },
];

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
    console.error(
      `Failed to fetch traffic for ${owner}/${repo} (${endpoint}):`,
      error
    );
    throw error;
  }
};

/**
 * Runs the GitHub analytics fetch and stores results in Firestore.
 * Used by both scheduled and HTTP functions.
 */
export const runGitHubAnalyticsFetch = async (): Promise<void> => {
  for (const { owner, repo } of REPOS) {
    try {
      const views = await fetchTraffic(owner, repo, 'views');
      const clones = await fetchTraffic(owner, repo, 'clones');
      await admin.firestore().collection('githubAnalytics').doc(repo).set({
        timestamp: new Date().toISOString(),
        views,
        clones,
      });
      // console.log(`Analytics updated for ${repo}`);
      await saveDailyGitHubAnalyticsDetails(owner, repo);
    } catch (error) {
      console.error(`Error fetching analytics for ${repo}:`, error);
    }
  }
};

/**
 * Persists daily GitHub analytics data in Firestore.
 * The 'dailyGitHubAnalytics' collection holds historical data for each day,
 * appending new entries to an array in each repo document.
 * Each document in 'dailyGitHubAnalytics' matches the structure of
 * 'githubAnalytics', but contains a 'views' and 'clones' array with all
 * daily entries since the function started.
 * @param {string} owner - GitHub repository owner.
 * @param {string} repo - GitHub repository name.
 */
export const saveDailyGitHubAnalyticsDetails = async (
  owner: string,
  repo: string
): Promise<void> => {
  try {
    // Get latest analytics snapshot for the repo
    const docRef = admin.firestore().collection('githubAnalytics').doc(repo);
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

    const dailyDocRef = admin
      .firestore()
      .collection('dailyGitHubAnalytics')
      .doc(repo);
    const dailyDocSnap = await dailyDocRef.get();

    // Always set repo field and initialize arrays if missing
    const updateData: Record<string, any> = {
      repo,
      timestamp: new Date().toISOString(),
      views: [],
      clones: [],
    };

    if (!dailyDocSnap.exists) {
      // First run: append all entries from githubAnalytics
      updateData.views = FieldValue.arrayUnion(...analyticsData.views.views);
      updateData.clones = FieldValue.arrayUnion(...analyticsData.clones.clones);
      // If no entries, still create the document
      if (
        !analyticsData.views.views.length &&
        !analyticsData.clones.clones.length
      ) {
        updateData.initialized = true;
      }
    } else {
      // Subsequent runs: append only yesterday's entries
      const now = new Date();
      now.setDate(now.getDate() - 1); // Move to yesterday
      const yesterday = now.toISOString().slice(0, 10); // YYYY-MM-DD
      const yesterdayViews = analyticsData.views.views.find(
        (v: any) => v.timestamp?.slice(0, 10) === yesterday ||
        v.date === yesterday
      );
      const yesterdayClones = analyticsData.clones.clones.find(
        (c: any) => c.timestamp?.slice(0, 10) === yesterday ||
        c.date === yesterday
      );
      if (yesterdayViews) {
        updateData.views = FieldValue.arrayUnion(yesterdayViews);
      }
      if (yesterdayClones) {
        updateData.clones = FieldValue.arrayUnion(yesterdayClones);
      }
    }

    // console.log('[DEBUG] analyticsData:', analyticsData);
    // console.log('[DEBUG] updateData:', updateData);

    await dailyDocRef.set(updateData, { merge: true });
  } catch (error) {
    console.error(
      `[ERROR] saveDailyGitHubAnalyticsDetails for ${repo}:`,
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
export const fetchGitHubAnalytics = functions.pubsub
  .schedule('0 3 * * *') // Runs at 03:00 AM local time
  .timeZone('Europe/Vienna')
  .onRun(async () => {
    await runGitHubAnalyticsFetch();
  });

/**
 * HTTP function for local testing of GitHub analytics fetch.
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @returns {Promise<void>} Resolves when response is sent.
 */
export const testGitHubAnalytics = functions.https.onRequest(
  async (req, res) => {
    try {
      await runGitHubAnalyticsFetch();
      res.status(200).send('GitHub analytics fetched and stored.');
    } catch (error) {
      console.error('Error in testGitHubAnalytics:', error);
      // Send error details in response
      res
        .status(500)
        .send(
          `Internal Server Error: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
    }
  }
);
