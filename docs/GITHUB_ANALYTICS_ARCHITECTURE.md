# GitHub Analytics Architecture for z-control Projects

This document describes the architecture for automated fetching and storage of GitHub traffic analytics (views and clones) for the following repositories:

- `zoechbauer/copilot-learning-calculator`
- `zoechbauer/z-control-qr-code-generator`
- `zoechbauer/z-control-landing-page`

The analytics data is retrieved via a scheduled Firebase Cloud Function and stored in Firestore for display in the landing page app.

---

## 1. Overview

- **Purpose:** Collect daily GitHub traffic insights for multiple repositories.
- **Storage:** Data is saved in Firestore under two collections:
  - `githubAnalytics`: Stores the latest 14 days of analytics (overwrites data).
  - `dailyGitHubAnalytics`: Appends each day's analytics, building a historical record.
- **Display:** The landing page fetches and displays analytics data from Firestore.
- **Security:** GitHub Personal Access Token is stored securely as a Firebase environment variable.

---

## 2. Project Structure

```
functions/
├─ src/
│  ├─ githubAnalytics.ts      # Cloud Function: fetches and persists GitHub analytics
│  └─ index.ts                # Exports all functions
├─ package.json
├─ tsconfig.json
├─ node_modules/
└─ ...
```

Firestore structure:

```
githubAnalytics/
  ├─ copilot-learning-calculator
  ├─ z-control-qr-code-generator
  └─ z-control-landing-page

dailyGitHubAnalytics/
  ├─ copilot-learning-calculator
  ├─ z-control-qr-code-generator
  └─ z-control-landing-page
```

Each document in both collections contains:
- `timestamp`: ISO string of last update
- `views`: Object with total and daily view entries
- `clones`: Object with total and daily clone entries

In `dailyGitHubAnalytics`, the `views` and `clones` arrays accumulate all daily entries since the function started.

---

## 3. Cloud Function Implementation

- **Scheduled Trigger:** Runs every day at 03:00 AM Europe/Vienna time (`0 3 * * *`).
- **Repositories:** Iterates over all target repos defined in `REPOS`.
- **API Calls:** Uses GitHub REST API endpoints:
  - `/repos/{owner}/{repo}/traffic/views`
  - `/repos/{owner}/{repo}/traffic/clones`
- **Storage:**
  - `githubAnalytics`: Overwrites with the latest analytics snapshot.
  - `dailyGitHubAnalytics`: Appends only the previous day's entries to arrays.

### Example: `githubAnalytics.ts`

```typescript
import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

// Load dotenv for local test with firebase emulators
require('dotenv').config({
  path: require('node:path').resolve(__dirname, '../../.env.local'),
});

admin.initializeApp();

const REPOS = [
  { owner: 'zoechbauer', repo: 'copilot-learning-calculator' },
  { owner: 'zoechbauer', repo: 'z-control-qr-code-generator' },
  { owner: 'zoechbauer', repo: 'z-control-landing-page' },
];

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
};

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
 */
export const saveDailyGitHubAnalyticsDetails = async (
  owner: string,
  repo: string
): Promise<void> => {
  try {
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

    const dailyDocRef = admin.firestore().collection('dailyGitHubAnalytics').doc(repo);
    const dailyDocSnap = await dailyDocRef.get();

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
 */
export const fetchGitHubAnalytics = functions.pubsub
  .schedule('0 3 * * *') // Runs at 03:00 AM local time
  .timeZone('Europe/Vienna')
  .onRun(async () => {
    await runGitHubAnalyticsFetch();
  });

/**
 * HTTP function for local testing of GitHub analytics fetch.
 */
export const testGitHubAnalytics = functions.https.onRequest(
  async (req, res) => {
    try {
      await runGitHubAnalyticsFetch();
      res.status(200).send('GitHub analytics fetched and stored.');
    } catch (error) {
      console.error('Error in testGitHubAnalytics:', error);
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
```

---

**Notes:**

- The scheduled function runs automatically every day at **03:00 AM Europe/Vienna time** to ensure GitHub statistics are finalized.
- `githubAnalytics` stores only the latest 14 days (overwrites).
- `dailyGitHubAnalytics` accumulates all daily entries for historical analysis.
- For local testing, use `.env.local` in your project root with `GITHUB_TOKEN`.
- For production, set `GITHUB_TOKEN` as an environment variable in the Cloud Console for your function.

---

## 4. Environment Setup

- **Install dependencies:**
  ```bash
  cd functions
  npm install node-fetch
  npm install firebase-functions@latest firebase-admin@latest --save
  ```
- **Set GitHub token as environment variable in Cloud Console:**
  - Go to Cloud Functions in the Firebase or Google Cloud Console.
  - Edit your function and add `GITHUB_TOKEN` in the environment variables section.
- **Deploy function:**
  ```bash
  firebase deploy --only functions
  ```

---

## 5. Frontend Integration Example (Landing Page)

The landing page fetches analytics data from Firestore and displays it.

```typescript
import { getFirestore, doc, getDoc } from "firebase/firestore";

const db = getFirestore();
const docRef = doc(db, "githubAnalytics", "z-control-landing-page");

async function fetchAnalytics() {
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    // Display data in your app
    console.log('Views:', data.views);
    console.log('Clones:', data.clones);
  } else {
    console.log("No analytics data found.");
  }
}
```

---

## 6. Security & Best Practices

- **Token Security:** Store GitHub token only as a Cloud Function environment variable, never in source code.
- **Error Handling:** Log errors for each repo fetch; do not halt the entire function on a single failure.
- **Data Retention:** `githubAnalytics` stores only the latest analytics snapshot; `dailyGitHubAnalytics` accumulates all daily entries for historical analysis.

---

## 7. References

- [GitHub Traffic API Docs](https://docs.github.com/en/rest/metrics/traffic)
- [Firebase Functions Documentation](https://firebase.google.com/docs/functions)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)

## 8. Local Testing with Firebase Emulator Suite

To test the GitHub analytics function locally:

1. **Install dependencies:**
   ```bash
   cd functions
   npm install
   npm install node-fetch dotenv
   ```

2. **Create and configure `.env.local` in your project root:**
   ```
   GITHUB_TOKEN=your_github_token_here
   ```

3. **Ensure your function code loads environment variables:**
   ```typescript
   require('dotenv').config({ path: require('node:path').resolve(__dirname, '../../.env.local') });
   ```

4. **Start the Firebase Emulator Suite:**
   ```bash
   firebase emulators:start
   ```

5. **Trigger the function manually for testing:**
   - Use the HTTP endpoint (e.g., `/testGitHubAnalytics`) in your browser or with curl:
     ```
     curl http://localhost:5001/YOUR_PROJECT_ID/us-central1/testGitHubAnalytics
     ```

6. **View results in the Emulator UI:**
   - Open [http://localhost:4000/firestore](http://localhost:4000/firestore) and check the `githubAnalytics` and `dailyGitHubAnalytics` collections.

7. **Troubleshooting:**
   - Ensure ports are free before starting the emulator.
   - Use LF line endings in `.env.local`.
   - Check logs for errors and verify environment variables are loaded.

---

**Maintained by:** Hans Zöchbauer  
**Last Updated:** November 21, 2025