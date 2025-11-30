import { setGlobalOptions } from 'firebase-functions/v2';

// Set global options for all v2 functions (only call once per deployment)
setGlobalOptions({ maxInstances: 2 });

export * from './githubAnalytics';
