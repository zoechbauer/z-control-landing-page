# GitHub Analytics Architecture for z-control Projects

This document describes the architecture for automated fetching and storage of GitHub traffic analytics (views and clones) for the following repositories:

- `zoechbauer/copilot-learning-calculator`
- `zoechbauer/z-control-qr-code-generator`
- `zoechbauer/z-control-landing-page`

The analytics data is retrieved via a scheduled Firebase Cloud Function and stored in Firestore for display in the landing page app.

---

## 1. Overview

- **Purpose:** Collect daily GitHub traffic insights for multiple repositories.
- **Storage:** Data is saved in Firestore under a dedicated collection.
- **Display:** The landing page fetches and displays analytics data from Firestore.
- **Security:** GitHub Personal Access Token is stored securely in Firebase environment config.

---

## 2. Project Structure

```
functions/
├─ src/
│  ├─ githubAnalytics.ts      # Cloud Function: fetches GitHub analytics
│  └─ index.ts                # Exports all functions
│  └─ testEnv.ts              # Test environment variable loading
├─ package.json
├─ tsconfig.json
├─ node_modules/
└─ ...
```

Firestore structure:

```
githubAnalytics/
  ├─ copilot-learning-calculator/
  │    └─ latest
  ├─ z-control-qr-code-generator/
  │    └─ latest
  └─ z-control-landing-page/
       └─ latest
```

---

## 3. Cloud Function Implementation

- **Scheduled Trigger:** Runs once every 24 hours.
- **Repositories:** Iterates over all target repos.
- **API Calls:** Uses GitHub REST API endpoints:
  - `/repos/{owner}/{repo}/traffic/views`
  - `/repos/{owner}/{repo}/traffic/clones`
- **Storage:** Saves results under `githubAnalytics/{repo}/latest` in Firestore.

### Example: `githubAnalytics.ts`

```typescript
import * as dotenv from 'dotenv';
import * as path from 'node:path';
import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

admin.initializeApp();

const REPOS = [
  { owner: 'zoechbauer', repo: 'copilot-learning-calculator' },
  { owner: 'zoechbauer', repo: 'z-control-qr-code-generator' },
  { owner: 'zoechbauer', repo: 'z-control-landing-page' },
];

// For both production and emulators:
const config: any = functions.config;
const GITHUB_TOKEN: string | undefined =
  process.env['GITHUB_TOKEN'] ||
  (config.github && typeof config.github.github_token === 'string'
    ? config.github.github_token
    : undefined);
if (!GITHUB_TOKEN) {
  throw new Error('GITHUB_TOKEN is not defined');
}

/**
 * Fetches traffic analytics data from GitHub for the specified
 * repository and endpoint.
 */
const fetchTraffic = async (
  owner: string,
  repo: string,
  endpoint: string
): Promise<unknown> => {
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
 */
export const fetchGitHubAnalytics = functions.pubsub
  .schedule('1 0 * * *')
  .timeZone('Europe/Vienna')
  .onRun(async () => {
    await runGitHubAnalyticsFetch();
  });

/**
 * HTTP function for local testing or manual update.
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

- The scheduled function runs automatically every day at **00:01 AM Europe/Vienna time**.
- You can trigger a manual update by calling the HTTP endpoint `/testGitHubAnalytics`:
  - Locally: `http://localhost:5001/YOUR_PROJECT_ID/us-central1/testGitHubAnalytics`
  - On Firebase: `https://REGION-PROJECT_ID.cloudfunctions.net/testGitHubAnalytics`
---

## 4. Environment Setup

- **Install dependencies:**
  ```bash
  cd functions
  npm install node-fetch
  npm install firebase-functions@latest firebase-admin@latest --save
  ```
- **Set GitHub token in Firebase config:**
  ```bash
  firebase functions:config:set github.token="YOUR_GITHUB_TOKEN"
  ```
- **Deploy function:**
  ```bash
  firebase deploy --only functions
  ```

---

## 5. Frontend Integration Example (Landing Page)

The landing page fetches analytics data from Firestore and displays it.

```typescript
// Example: Fetching analytics for z-control-landing-page
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

- **Token Security:** Store GitHub token only in Firebase config, never in source code.
- **Error Handling:** Log errors for each repo fetch; do not halt the entire function on a single failure.
- **Data Retention:** Only the latest analytics snapshot is stored; extend as needed for historical data.

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
   import * as dotenv from 'dotenv';
   import * as path from 'node:path';
   dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });
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
   - Open [http://localhost:4000/firestore](http://localhost:4000/firestore) and check the `githubAnalytics` collection.

7. **Troubleshooting:**
   - Ensure ports are free before starting the emulator.
   - Use LF line endings in `.env.local`.
   - Check logs for errors and verify environment variables are loaded.

---

**See also:** [GITHUB_ANALYTICS_TEST_LOCALLY.md](GITHUB_ANALYTICS_TEST_LOCALLY.md)

---

**Maintained by:** Hans Zöchbauer  
**Last Updated:** November 19, 2025