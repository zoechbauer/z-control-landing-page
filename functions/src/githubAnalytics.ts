// Global error handlers for uncaught exceptions and unhandled rejections
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  logger.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  logger.error('Unhandled Rejection:', reason);
});

import { https, scheduler } from 'firebase-functions/v2';
import * as logger from 'firebase-functions/logger';
import * as admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { REPOS, COLLECTION } from './shared/GitHubConstants';

type HistoryData = {
  views?: GithubTrafficEntry[];
  clones?: GithubTrafficEntry[];
};

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
  endpoint: string,
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
        `GitHub API error: ${response.status} ${response.statusText}`,
      );
    }
    return await response.json();
  } catch (error) {
    logger.error(
      `Failed to fetch traffic for ${owner}/${repo} (${endpoint}):`,
      error,
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
  repoIndex?: number,
): Promise<void> => {
  // If repoIndex is a valid number, process only that repo,
  // else process all repos
  if (
    typeof repoIndex === 'number' &&
    repoIndex >= 0 &&
    repoIndex < REPOS.length
  ) {
    const { owner, repo } = REPOS[repoIndex];
    await processRepo(owner, repo, updateTraffic);
  } else {
    for (const { owner, repo } of REPOS) {
      await processRepo(owner, repo, updateTraffic);
    }
  }
};

const processRepo = async (
  owner: string,
  repo: string,
  updateTraffic: boolean,
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
    console.error(`Error fetching analytics for ${repo}:`, error);
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
  repo: string,
): Promise<void> => {
  try {
    // Get latest analytics snapshot for the repo
    const docRef = admin
      .firestore()
      .collection(COLLECTION.GITHUB_ANALYTICS_TRAFFIC)
      .doc(repo);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      logger.warn(`No analytics data found for ${repo}.`);
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
      logger.warn(`Invalid analytics data structure for ${repo}.`);
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
          v.timestamp?.slice(0, 10) === yesterday || v.date === yesterday,
      );
      const yesterdayClones = analyticsData.clones.clones.find(
        (c: GithubTrafficEntry) =>
          c.timestamp?.slice(0, 10) === yesterday || c.date === yesterday,
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
      error,
    );
    console.error(
      `[ERROR] saveGithubAnalyticsTrafficHistory for ${repo}:`,
      error,
    );
  }
  logger.info('saveGithubAnalyticsTrafficHistory completed', { owner, repo });
  console.log('saveGithubAnalyticsTrafficHistory completed', { owner, repo });
};

/**
 * Scheduled function to fetch GitHub analytics and store in Firestore.
 * Runs every day at 18:00 Europe/Vienna time to be sure that GitHub
 * has finalized the previous day's data.
 *
 * cron expression '0 18 * * *' means:
 * minute: 0
 * hour: 18
 * day: every day
 * month: every month
 * day-of-week: every day of the week
 */
export const fetchGitHubAnalytics = scheduler.onSchedule(
  {
    schedule: '0 18 * * *', // Runs at 18:00 (6 PM) local time
    timeZone: 'Europe/Vienna',
  },
  async () => {
    await runGitHubAnalyticsFetch();
  },
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
export const testGitHubAnalytics = https.onRequest(async (req, res) => {
  logger.info('testGitHubAnalytics HTTP function started');
  console.log('testGitHubAnalytics HTTP function started');
  try {
    logInfo.calledBy = 'testGitHubAnalytics';
    const updateTraffic = req.query.updateTraffic !== 'false';
    const repoIndexString = req.query.repoIndex;
    const repoIndex = repoIndexString
      ? Number.parseInt(repoIndexString as string, 10)
      : undefined;

    await runGitHubAnalyticsFetch(updateTraffic, repoIndex);

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
      message: 'GitHub analytics fetched and stored.',
      logInfo: logInfo,
    });
  } catch (error) {
    logger.error('Error in testGitHubAnalytics:', error);
    console.error('Error in testGitHubAnalytics:', error);
    // Send error details in response
    res.status(500).json({
      error: `Internal Server Error: ${
        error instanceof Error ? error.message : String(error)
      }`,
    });
  }
  logger.info('testGitHubAnalytics HTTP function ended');
  console.log('testGitHubAnalytics HTTP function ended');
});

/**
 * HTTP function to insert missing daily analytics data from
 * githubAnalyticsTraffic into githubAnalyticsTrafficHistory for each repo.
 * Only missing dates are inserted.
 * @param req - The HTTP request object
 * @param res - The HTTP response object.
 * @returns {Promise<void>} Resolves when response is sent.
 */
export const insertMissingAnalyticsHistory = https.onRequest(
  async (req, res) => {
    logger.info('insertMissingAnalyticsHistory HTTP function started');
    console.log('insertMissingAnalyticsHistory HTTP function started');
    try {
      const reposToProcess = getReposToProcess(req);

      const inserted: Record<string, { views: string[]; clones: string[] }> =
        {};

      for (const repoObj of reposToProcess) {
        const { repo } = repoObj;
        inserted[repo] = { views: [], clones: [] };

        const analyticsData = await getAnalyticsData(repo);
        if (!analyticsData) {
          logger.warn(`No analytics data found for ${repo}.`);
          continue;
        }

        const historyData = await getHistoryData(repo);

        const { historyViews, historyClones } = getHistoryEntries(historyData);

        const historyViewDates = new Set(
          historyViews.map((v) =>
            v.timestamp ? v.timestamp.slice(0, 10) : v.date,
          ),
        );
        const historyCloneDates = new Set(
          historyClones.map((c) =>
            c.timestamp ? c.timestamp.slice(0, 10) : c.date,
          ),
        );

        const trafficViews: GithubTrafficEntry[] =
          analyticsData?.views?.views ?? [];
        const missingViews = trafficViews.filter((v) => {
          const date = v.timestamp ? v.timestamp.slice(0, 10) : v.date;
          return date && !historyViewDates.has(date);
        });

        const trafficClones: GithubTrafficEntry[] =
          analyticsData?.clones?.clones ?? [];
        const missingClones = trafficClones.filter((c) => {
          const date = c.timestamp ? c.timestamp.slice(0, 10) : c.date;
          return date && !historyCloneDates.has(date);
        });

        const updateData: Record<string, unknown> = {
          repo,
          timestamp: new Date().toISOString(),
        };
        if (missingViews.length > 0) {
          updateData.views = FieldValue.arrayUnion(...missingViews);
          inserted[repo].views = missingViews
            .map((v) => v.timestamp || v.date)
            .filter((d): d is string => typeof d === 'string');
        }
        if (missingClones.length > 0) {
          updateData.clones = FieldValue.arrayUnion(...missingClones);
          inserted[repo].clones = missingClones
            .map((c) => c.timestamp || c.date)
            .filter((d): d is string => typeof d === 'string');
        }
        if (missingViews.length > 0 || missingClones.length > 0) {
          await updateHistoryData(repo, updateData);
          logger.info('Repo:', repo, 'updateData:', updateData);
          console.log('Repo:', repo, 'updateData:', updateData);
        } else {
          logger.info('No missing analytics history to insert', { repo });
        }
      }
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({
        message: 'Insert missing analytics history completed.',
        inserted,
      });
    } catch (error) {
      logger.error('Error in insertMissingAnalyticsHistory:', error);
      res.status(500).json({
        error: `Internal Server Error: ${
          error instanceof Error ? error.message : String(error)
        }`,
      });
    }
  },
);

// Helper to get analytics data for a repo
const getAnalyticsData = async (repo: string) => {
  const docRef = admin
    .firestore()
    .collection(COLLECTION.GITHUB_ANALYTICS_TRAFFIC)
    .doc(repo);
  const docSnap = await docRef.get();
  return docSnap.exists ? docSnap.data() : undefined;
};

// Helper to get history data for a repo
const getHistoryData = async (repo: string) => {
  const docRefHistory = admin
    .firestore()
    .collection(COLLECTION.GITHUB_ANALYTICS_TRAFFIC_HISTORY)
    .doc(repo);
  const docSnapHistory = await docRefHistory.get();
  return docSnapHistory.exists ? (docSnapHistory.data() as HistoryData) : {};
};

// Helper to extract history entries
const getHistoryEntries = (historyData: HistoryData) => {
  const historyViews: GithubTrafficEntry[] = Array.isArray(historyData?.views)
    ? historyData.views
    : [];
  const historyClones: GithubTrafficEntry[] = Array.isArray(historyData?.clones)
    ? historyData.clones
    : [];
  return { historyViews, historyClones };
};

// Helper to update history data
const updateHistoryData = async (
  repo: string,
  updateData: Record<string, unknown>,
) => {
  const docRefHistory = admin
    .firestore()
    .collection(COLLECTION.GITHUB_ANALYTICS_TRAFFIC_HISTORY)
    .doc(repo);
  await docRefHistory.set(updateData, { merge: true });
};

const getReposToProcess = (
  req: https.Request,
): { owner: string; repo: string }[] => {
  const repoIndexString = req.query.repoIndex;
  const repoIndex = repoIndexString
    ? Number.parseInt(repoIndexString as string, 10)
    : undefined;
  const reposToProcess =
    typeof repoIndex === 'number' && repoIndex >= 0 && repoIndex < REPOS.length
      ? [REPOS[repoIndex]]
      : REPOS;
  return reposToProcess;
};
