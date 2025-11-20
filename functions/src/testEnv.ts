/**
 * Purpose: Test loading environment variables from .env.local
 *  for local development.
 *
 * How to use:
 * 1. Build the TypeScript code: npm run build (from the functions folder)
 * 2. Run the compiled JavaScript:
 *    node lib/testEnv.js (from the functions folder)
 *
 * This script prints the value of GITHUB_TOKEN to verify correct loading.
 */

import * as dotenv from 'dotenv';
import * as path from 'node:path';

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

console.log('GITHUB_TOKEN - process.env.GITHUB_TOKEN:',
  process.env.GITHUB_TOKEN);
console.log('GITHUB_TOKEN - process.env[\'GITHUB_TOKEN\']:',
  process.env['GITHUB_TOKEN']);
