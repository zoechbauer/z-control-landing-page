import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

// Load dotenv for local test with firebase emulators
// GITHUB_TOKEN for production must be defined as environment variable in https://console.cloud.google.com/functions
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: require('node:path')
  .resolve(__dirname, '../../.env.local') });

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
      console.log(`Analytics updated for ${repo}`);
    } catch (error) {
      console.error(`Error fetching analytics for ${repo}:`, error);
    }
  }
};

/**
 * Scheduled function to fetch GitHub analytics and store in Firestore.
 * Runs every day at 00:01 AM Europe/Vienna time.
 *
 * cron expression '1 0 * * *' means:
 * minute: 1
 * hour: 0
 * day: every day
 * month: every month
 * day-of-week: every day of the week
 */
export const fetchGitHubAnalytics = functions.pubsub
  .schedule('1 0 * * *')
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
