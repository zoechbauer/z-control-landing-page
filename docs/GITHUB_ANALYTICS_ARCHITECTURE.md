# GitHub Analytics Architecture for z-control Projects

## Table of Contents

- [1. Overview](#1-overview)
- [2. Project Structure](#2-project-structure)
- [3. Shared Constants](#3-shared-constants)
- [4. Cloud Function Implementation](#4-cloud-function-implementation)
- [5. Frontend Integration Example (Landing Page)](#5-frontend-integration-example-landing-page)
- [6. Security & Best Practices](#6-security--best-practices)
- [7. References](#7-references)
- [8. Local Testing with Firebase Emulator Suite when adding new repos](#8-local-testing-with-firebase-emulator-suite-when-adding-new-repos)


This document describes the architecture for automated fetching and storage of GitHub traffic analytics (views and clones) for the following repositories:

- `zoechbauer/z-control-landing-page`
- `zoechbauer/z-control-qr-code-generator`
- `zoechbauer/z-control-multi-language-translator`
- `zoechbauer/z-control-Backup-scripts`
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
├─ shared/
│  └─ GitHubConstants.ts         # Shared constants for BE & FE (frontend and general use)
├─ package.json
├─ tsconfig.json
└─ ...
```

Firestore structure:

```text
githubAnalyticsTraffic/
  ├─ copilot-learning-calculator
  ├─ z-control-multi-language-translator
  ├─ z-control-Backup-scripts
  ├─ z-control-qr-code-generator
  └─ z-control-landing-page

githubAnalyticsTrafficHistory/
  ├─ copilot-learning-calculator
  ├─ z-control-multi-language-translator
  ├─ z-control-Backup-scripts
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
  { owner: 'zoechbauer', repo: 'z-control-Backup-scripts' },
  { owner: 'zoechbauer', repo: 'z-control-multi-language-translator' },
  { owner: 'zoechbauer', repo: 'copilot-learning-calculator' },
];

export const COLLECTION = {
  GITHUB_ANALYTICS_TRAFFIC: "githubAnalyticsTraffic",
  GITHUB_ANALYTICS_TRAFFIC_HISTORY: "githubAnalyticsTrafficHistory",
};
```

---

## 4. Cloud Function Implementation

see document **github-analytics-architecture.md** in the docs folder of **z-control-backend-functions** repository.

---

## 5. Frontend Integration Example (Landing Page)

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
    console.log("Views:", data.views);
    console.log("Clones:", data.clones);
  } else {
    console.log("No analytics data found.");
  }
}
```

> **Note:**  
> In Firestore, the `views` and `clones` collections may include entries with zero values. However, the frontend filters out these zero-value entries, displaying only dates where the values are greater than zero.

---

## 6. Security & Best Practices

- **Token Security:** Store GitHub token only as a Cloud Function environment variable, never in source code.
- **Error Handling:** Log errors for each repo fetch; do not halt the entire function on a single failure.
- **Data Retention:** `githubAnalyticsTraffic` stores only the latest analytics snapshot; `githubAnalyticsTrafficHistory` accumulates all daily entries for historical analysis.

---

## 7. References

- [GitHub Traffic API Docs](https://docs.github.com/en/rest/metrics/traffic)
- [Firebase Functions Documentation](https://firebase.google.com/docs/functions)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)

## 8. Local Testing with Firebase Emulator Suite when adding new repos

For detailed instructions, refer to [GITHUB_ANALYTICS_TEST_LOCALLY.md](GITHUB_ANALYTICS_TEST_LOCALLY.md).

