# GitHub Analytics Architecture for z-control Projects

This document describes the architecture for automated fetching and storage of GitHub traffic analytics (views and clones) for the following repositories:

- `zoechbauer/z-control-landing-page`
- `zoechbauer/z-control-qr-code-generator`
- `zoechbauer/copilot-learning-calculator`

The analytics data is retrieved via a scheduled Firebase Cloud Function and stored in Firestore for display in the landing page app.

---

## 1. Overview

- **Purpose:** Collect daily GitHub traffic insights for multiple repositories.
- **Storage:** Data is saved in Firestore under two collections:
  - `githubAnalyticsTraffic`: Stores the latest 14 days of analytics (overwrites data).
  - `githubAnalyticsTrafficHistory`: Appends each day's analytics, building a historical record.
- **Display:** The landing page fetches and displays analytics data from Firestore.
- **Security:** GitHub Personal Access Token is stored securely as a Firebase environment variable.

---

## 2. Project Structure

```text
landing-page/
├─ src/
│  ├─ app/
│  └─ ...
├─ functions/
│  ├─ src/
│  │  ├─ githubAnalytics.ts      # Cloud Function: fetches and persists GitHub analytics
│  │  ├─ index.ts                # Exports all functions
│  │  └─ shared/
│  │      └─ GitHubConstants.ts  # Copy of shared constants for backend (required for clean build output)
│  └─ ...
├─ shared/
│  └─ GitHubConstants.ts         # Shared constants for BE & FE (frontend and general use)
├─ package.json
├─ tsconfig.json
└─ ...
```

**Note:**  
A copy of `GitHubConstants.ts` is kept in both `shared/` (for frontend and general use) and `functions/src/shared/` (for backend).  
This duplication is necessary because TypeScript requires all backend source files to be inside `functions/src` for a clean build structure.  
If you import from outside `src`, TypeScript will create nested folders in the build output, which causes problems for Firebase Functions deployment and emulator usage.

Firestore structure:

```text
githubAnalyticsTraffic/
  ├─ copilot-learning-calculator
  ├─ z-control-qr-code-generator
  └─ z-control-landing-page

githubAnalyticsTrafficHistory/
  ├─ copilot-learning-calculator
  ├─ z-control-qr-code-generator
  └─ z-control-landing-page
```

Each document in both collections contains:

- `timestamp`: ISO string of last update
- `views`: Object with total and daily view entries
- `clones`: Object with total and daily clone entries

In `githubAnalyticsTrafficHistory`, the `views` and `clones` arrays accumulate all daily entries since the function started.

---

## 3. Shared Constants

A shared constants file is used for both backend and frontend to keep repository and collection names in sync:

```typescript
// filepath: shared/GitHubConstants.ts
export const REPOS = [
  { owner: 'zoechbauer', repo: 'z-control-landing-page' },
  { owner: 'zoechbauer', repo: 'z-control-qr-code-generator' },
  { owner: 'zoechbauer', repo: 'copilot-learning-calculator' },
];

export const COLLECTION = {
  GITHUB_ANALYTICS_TRAFFIC: 'githubAnalyticsTraffic',
  GITHUB_ANALYTICS_TRAFFIC_HISTORY: 'githubAnalyticsTrafficHistory',
};
```

---

## 4. Cloud Function Implementation

- **Scheduled Trigger:** Runs every day at 03:00 AM Europe/Vienna time (`0 3 * * *`).
- **Repositories:** Iterates over all target repos defined in `REPOS`.
- **API Calls:** Uses GitHub REST API endpoints:
  - `/repos/{owner}/{repo}/traffic/views`
  - `/repos/{owner}/{repo}/traffic/clones`
- **Storage:**
  - `githubAnalyticsTraffic`: Overwrites with the latest analytics snapshot.
  - `githubAnalyticsTrafficHistory`: Appends only the previous day's entries to arrays.

### Example: `githubAnalytics.ts` (with query parameters)

```typescript
export const testGitHubAnalytics = functions.https.onRequest(
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
      res.status(500).json({
        error: `Internal Server Error: ${
          error instanceof Error ? error.message : String(error)
        }`,
      });
    }
  }
);
```

**Query Parameters:**

- `updateTraffic`: Set to `false` to skip updating Firestore with the latest traffic data (default is `true`).
- `repoIndex`: Set to a valid index (e.g., `0`, `1`, `2`) to process only the selected repository. If omitted, all repositories are processed.

**Examples:**

- Process all repos and update Firestore:

  ```bash
  curl "http://localhost:5001/<project-id>/us-central1/testGitHubAnalytics"
  ```

- Process only the first repo and skip Firestore update:

  ```bash
  curl "http://localhost:5001/<project-id>/us-central1/testGitHubAnalytics?updateTraffic=false&repoIndex=0"
  ```

---

**Notes:**

- The scheduled function runs automatically every day at **03:00 AM Europe/Vienna time** to ensure GitHub statistics are finalized.
- `githubAnalyticsTraffic` stores only the latest 14 days (overwrites).
- `githubAnalyticsTrafficHistory` accumulates all daily entries for historical analysis.
- For local testing, use `.env.local` in your project root with `GITHUB_TOKEN`.
- For production, set `GITHUB_TOKEN` as an environment variable in the Cloud Console for your function.

---

## 5. Environment Setup

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

## 6. Frontend Integration Example (Landing Page)

The landing page fetches analytics data from Firestore and displays it.
Here is a simplified example of how to retrieve and log the data:

```typescript
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { REPOS, COLLECTION } from "../../shared/GitHubConstants";

const db = getFirestore();
const docRef = doc(db, COLLECTION.GITHUB_ANALYTICS_TRAFFIC_HISTORY, REPOS[0].repo);

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

## 7. Security & Best Practices

- **Token Security:** Store GitHub token only as a Cloud Function environment variable, never in source code.
- **Error Handling:** Log errors for each repo fetch; do not halt the entire function on a single failure.
- **Data Retention:** `githubAnalyticsTraffic` stores only the latest analytics snapshot; `githubAnalyticsTrafficHistory` accumulates all daily entries for historical analysis.

---

## 8. References

- [GitHub Traffic API Docs](https://docs.github.com/en/rest/metrics/traffic)
- [Firebase Functions Documentation](https://firebase.google.com/docs/functions)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)

## 9. Local Testing with Firebase Emulator Suite

To test the GitHub analytics function locally:

1. **Install dependencies:**

   ```bash
   cd functions
   npm install
   npm install node-fetch dotenv
   ```

2. **Create and configure `.env.local` in your project root:**

   ```text
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

     ```bash
     curl http://localhost:5001/YOUR_PROJECT_ID/us-central1/testGitHubAnalytics
     ```

6. **View results in the Emulator UI:**
   - Open [http://localhost:4000/firestore](http://localhost:4000/firestore) and check the `githubAnalyticsTraffic` and `githubAnalyticsTrafficHistory` collections.

7. **Troubleshooting:**
   - Ensure ports are free before starting the emulator.
   - Use LF line endings in `.env.local`.
   - Check logs for errors and verify environment variables are loaded.

---

**Maintained by:** Hans Zöchbauer  
**Last Updated:** November 22, 2025
