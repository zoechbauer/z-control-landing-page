# GitHub Traffic Insights API Usage (TypeScript Example)

You can retrieve traffic insights (views and clones) for your GitHub repository programmatically using the GitHub REST API.

## Endpoints

- **Views:**  
  `GET /repos/{owner}/{repo}/traffic/views`
- **Clones:**  
  `GET /repos/{owner}/{repo}/traffic/clones`

> **Note:** The API only returns data for the last 14 days.

## TypeScript Example

```typescript
import fetch from 'node-fetch';

const owner = 'zoechbauer';
const repo = 'z-control-qr-code-generator';
const token = process.env.GITHUB_TOKEN; // Set your GitHub personal access token in env

async function getTraffic(endpoint: string) {
  const url = `https://api.github.com/repos/${owner}/${repo}/traffic/${endpoint}`;
  const res = await fetch(url, {
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });
  if (!res.ok) throw new Error(`GitHub API error: ${res.statusText}`);
  return res.json();
}

(async () => {
  try {
    const views = await getTraffic('views');
    const clones = await getTraffic('clones');
    console.log('Views:', views);
    console.log('Clones:', clones);
  } catch (err) {
    console.error(err);
  }
})();
```

## Setup

1. Install `node-fetch`:
   ```
   npm install node-fetch
   ```
2. Set your GitHub personal access token (with `repo` scope):
   ```
   export GITHUB_TOKEN=your_token_here
   ```
3. Run the script:
   ```
   node scripts/getTrafficInsights.ts
   ```

## Output

The script will print your traffic insights for views and clones.

## References

- [GitHub API Docs: Traffic](https://docs.github.com/en/rest/metrics/traffic)