# Local Testing Guide: GitHub Analytics with Firebase Emulator Suite

This guide describes how to test the GitHub analytics Cloud Function locally using the Firebase Emulator Suite.

---

## Prerequisites

- Node.js (v20 recommended)
- Java 11+ installed
- Firebase CLI installed (`volta install firebase-tools` or `npm install -g firebase-tools`)
- `.env.local` file in your project root with a valid GitHub token:
  ```
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
import * as dotenv from 'dotenv';
import * as path from 'node:path';
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });
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
  ```
  http://localhost:5001/YOUR_PROJECT_ID/us-central1/testGitHubAnalytics
  ```
- You should see a success message if the function runs correctly.

### 7. View Firestore Data

- Open [http://localhost:4000/firestore](http://localhost:4000/firestore)
- Check the `githubAnalytics` collection for new documents.

---

## Troubleshooting

- **Internal Server Error:** Check logs for missing environment variables or API errors.
- **No Data in Emulator UI:** Ensure Firestore writes use `new Date().toISOString()` for timestamps.
- **Port Conflicts:** Use `netstat -ano | findstr :8080` and `taskkill /PID <PID> /F` to free ports.
- **Environment Variables Not Loaded:** Check `.env.local` formatting and encoding (UTF-8, LF).

---

**Maintained by:** Hans Zöchbauer  
**Last Updated:** November 19, 2025
