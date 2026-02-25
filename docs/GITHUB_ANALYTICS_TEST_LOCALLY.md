# Local Testing Guide: GitHub Analytics with Firebase Emulator Suite

This guide describes how to test the GitHub analytics Cloud Function locally using the Firebase Emulator Suite.

---

## Prerequisites

- Node.js (v20 recommended)
- Java 11+ installed
- Firebase CLI installed (`volta install firebase-tools` or `npm install -g firebase-tools`)
- `.env.local` file in your project root with a valid GitHub token:

  ```text
  GITHUB_TOKEN=your_github_token_here
  ```

---

## Steps

### 1. Install Dependencies

```bash
cd functions
npm install
npm install node-fetch dotenv
```

### 2. Configure Environment Variables

- Ensure `.env.local` is in your project root.
- Use LF line endings and no quotes or comments.

### 3. Update Function Code to Load `.env.local`

At the top of your function file (e.g., `githubAnalytics.ts`):

```typescript
import * as dotenv from "dotenv";
import * as path from "node:path";
dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });
```

### 4. Build Functions

```bash
npm run build
```

### 5. Start the Emulator Suite

```bash
firebase emulators:start
```

### 6. Trigger the Function

- Use the HTTP endpoint for manual testing:

  ```bash
  http://localhost:5001/YOUR_PROJECT_ID/us-central1/testGitHubAnalytics
  ```

- **Query Parameters:**
  - `updateTraffic=false` — skips updating Firestore with the latest traffic data.
  - `repoIndex=0` — processes only the first repository (use `1` or `2` for others).

- **Examples:**
  - Process all repos and update Firestore:

    ```bash
    curl "http://localhost:5001/YOUR_PROJECT_ID/us-central1/testGitHubAnalytics"
    ```

  - Process only the first repo and skip Firestore update:

    ```bash
    curl "http://localhost:5001/YOUR_PROJECT_ID/us-central1/testGitHubAnalytics?updateTraffic=false&repoIndex=0"
    ```

### 7. View Firestore Data

- Open [http://localhost:4000/firestore](http://localhost:4000/firestore)
- Check the `githubAnalytics` collection for new documents.

**Summary:**

- The HTTP test function now supports `updateTraffic` and `repoIndex` query parameters for flexible local and remote testing.

- Logging works both locally and after deployment.

---

## Troubleshooting

- **Internal Server Error:** Check logs for missing environment variables or API errors.
- **No Data in Emulator UI:** Ensure Firestore writes use `new Date().toISOString()` for timestamps.
- **Port Conflicts:** Use `netstat -ano | findstr :8080` and `taskkill /PID <PID> /F` to free ports.
- **Environment Variables Not Loaded:** Check `.env.local` formatting and encoding (UTF-8, LF).

---

## Debugging Firebase Functions (VS Code + Emulator)

You can debug your Firebase Functions running in the emulator and set breakpoints in your TypeScript/JavaScript code using VS Code.

### 1. Start the Emulator in Debug Mode

Stop any running emulator process. Then start the emulator with debugging enabled (use a free port, e.g., 9229):

```sh
firebase emulators:start --inspect-functions=9229
```

You should see a line like:

```
Debugger listening on ws://127.0.0.1:9229/...
```

### 2. Add a VS Code Debug Configuration

Create or update `.vscode/launch.json` in your project root with:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "attach",
      "name": "Attach to Firebase Functions Emulator",
      "port": 9229,
      "restart": true
    }
  ]
}
```

Make sure the `port` matches the one you used above.

### 3. Set Breakpoints

- Open your TypeScript file (e.g., `githubAnalytics.ts`) in VS Code.
- Set breakpoints where you want to pause execution (e.g., inside your function handler).

### 4. Start Debugging

- In VS Code, go to the Run & Debug panel.
- Select **Attach to Firebase Functions Emulator** and click the green play button.
- You should see "Connected" in the debug console.

### 5. Trigger Your Function

- **Important:** The first time after starting the emulator (or after clearing data), you must call your function with `updateTraffic=true` (the default) to fetch and store the latest analytics data in Firestore. If you use `updateTraffic=false` before any data exists, no analytics will be available for processing.

- Use your browser or `curl` to call your function, e.g.:
  ```
  http://localhost:5001/z-control-4070/us-central1/testGitHubAnalytics?repoIndex=0
  ```
- The emulator will hit your breakpoints and VS Code will pause execution, allowing you to inspect variables, step through code, etc.

### 6. Notes

- If you use TypeScript, make sure `"sourceMap": true` is set in your `tsconfig.json` and your code is built (`npm run build` or `tsc --watch`).
- If you see "breakpoints ignored because generated code not found," check that your `outDir` and `sourceMap` settings are correct and that VS Code is opening the built files with source maps.

---

## Adding a New Repository to GitHub Analytics

This section describes the procedure for adding a new repository to GitHub analytics tracking.

### 1. Update Configuration Files in functions and landing page

Add the new repository to the `REPOS` and `REPO` array in `shared/GitHubConstants.ts:

### 2. Test Locally with Emulator

**Important:** Always test with the emulator before deploying to production.

1. Build the functions:

   ```bash
   cd functions
   npm run build
   ```

2. Start the Firebase Emulator Suite:

   ```bash
   firebase emulators:start
   ```

3. Test the new repository:

   ```bash
   curl "http://localhost:5001/YOUR_PROJECT_ID/us-central1/testGitHubAnalytics"
   ```

4. Verify in Firestore Emulator UI ([http://localhost:4000/firestore](http://localhost:4000/firestore))

5. Check the landing page in development mode to see if the new repository's analytics are displayed correctly.
- change `useFirebaseEmulator` to `true` in `.env.local` to fetch analytics from the emulator.
- run `npm run generate-env` to update environment variables in the landing page.
- restart the development server.
- check the analytics section for the new repository.
- if test succeeds, change `useFirebaseEmulator` back to `false` for production testing.
- run `npm run generate-env` to update environment variables in the landing page.

### 4. Deploy to Production

- deploy functions
- deploy landing page

### 5. Test on Hosted Version

After deployment, test the function on the hosted version before the scheduled run at 18:00:

```bash
curl "https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/testGitHubAnalytics"

curl "http://localhost:5001/YOUR_PROJECT_ID/us-central1/testGitHubAnalytics"
```

#### Why You Can Call It Multiple Times Safely

You can safely call the function multiple times before 18:00 without causing duplicate data:

1. **First Manual Test (e.g., at 14:00):**
   - Creates the history document for the new repo
   - Saves all current traffic entries including yesterday's data
   - Result: ✅ Initial history created

2. **Second Manual Test (e.g., at 16:00):**
   - Tries to add yesterday's entry using `FieldValue.arrayUnion()`
   - Detects the entry already exists (exact object match)
   - Result: ⏭️ No duplicate created, only `timestamp` updated

3. **Scheduled Run (at 18:00):**
   - Same behavior as second test
   - Yesterday's data already exists, not added again
   - Result: ⏭️ No duplicate created

**Key Protection Mechanism:**

`FieldValue.arrayUnion()` prevents duplicates by comparing entire objects. If yesterday's data hasn't changed (which is normal since GitHub finalizes previous day's data), the exact same object already exists in the array and won't be added again.

**Only Risk:** Duplicates would occur only if GitHub updates yesterday's counts between your runs (extremely rare during maintenance). Running at 18:00 ensures GitHub has finalized the data.

### 6. Verify on Landing Page

- Check that the new repository's analytics are displayed correctly

---

**Maintained by:** Hans Zöchbauer  
**Last Updated:** February 25, 2026
