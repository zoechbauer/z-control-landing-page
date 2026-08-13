// GitHub repository constants and types

// ***********************************************
// Ensure consistency between backend and frontend
// ***********************************************
export const COLLECTION = {
  GITHUB_ANALYTICS_TRAFFIC: 'githubAnalyticsTraffic',
  GITHUB_ANALYTICS_TRAFFIC_HISTORY: 'githubAnalyticsTrafficHistory',
};

export const REPO = {
  Z_CONTROL_IMAGE_TO_TEXT: 'z-control-image-to-text',
  Z_CONTROL_IONIC_SETUP: 'z-control-ionic-setup',
  Z_CONTROL_MULTI_LANGUAGE_TRANSLATOR: 'z-control-multi-language-translator',
  Z_CONTROL_BACKEND_FUNCTIONS: 'z-control-backend-functions',
  Z_CONTROL_QR_CODE_GENERATOR: 'z-control-qr-code-generator',
  Z_CONTROL_BACKUP_SCRIPTS: 'z-control-Backup-scripts',
  Z_CONTROL_LANDING_PAGE: 'z-control-landing-page',
  IONIC_ANGULAR21_VITEST_SETUP: 'ionic-angular21-vitest-setup',
  COPILOT_LEARNING_CALCULATOR: 'copilot-learning-calculator',
};

// order by creation date descending (newest first) - used for GitHub analytics history
export const REPOS = [
  { owner: 'zoechbauer', repo: REPO.Z_CONTROL_IMAGE_TO_TEXT },
  { owner: 'zoechbauer', repo: REPO.Z_CONTROL_IONIC_SETUP },
  { owner: 'zoechbauer', repo: REPO.Z_CONTROL_MULTI_LANGUAGE_TRANSLATOR },
  { owner: 'zoechbauer', repo: REPO.Z_CONTROL_BACKEND_FUNCTIONS },
  { owner: 'zoechbauer', repo: REPO.Z_CONTROL_QR_CODE_GENERATOR },
  { owner: 'zoechbauer', repo: REPO.Z_CONTROL_BACKUP_SCRIPTS },
  { owner: 'zoechbauer', repo: REPO.Z_CONTROL_LANDING_PAGE },
  { owner: 'zoechbauer', repo: REPO.IONIC_ANGULAR21_VITEST_SETUP },
  { owner: 'zoechbauer', repo: REPO.COPILOT_LEARNING_CALCULATOR },
];

// ***********************************************
// Frontend-only constants and types
// ***********************************************
export interface GithubArrayTrafficEntry {
  timestamp: string;
  count: number;
  uniques: number;
};

export interface GithubAnalyticsTrafficDocument {
  collection: (typeof COLLECTION)[keyof typeof COLLECTION];
  repo: (typeof REPO)[keyof typeof REPO];
  timestamp: string;
  views: {
    count: number;
    uniques: number;
    views: GithubArrayTrafficEntry[];
  };
  clones: {
    count: number;
    uniques: number;
    clones: GithubArrayTrafficEntry[];
  };
};

export enum TrafficType {
  VIEWS = 'views',
  CLONES = 'clones',
};

// used for privacy policy
export const ALL_REPOS = 'all';
export const APPS = {
  LANDING_PAGE: 'z-control Landing Page App',
  QR_CODE_GENERATOR: 'z-control QR Code Generator App',
  BACKUP_SCRIPTS: 'z-control Backup Scripts',
  MULTI_LANGUAGE_TRANSLATOR: 'z-control Translator App',
  IONIC_SETUP: 'z-control Ionic Setup App',
  IMAGE_TO_TEXT: 'z-control Image to Text App',
  BACKEND_FUNCTIONS: 'z-control Backend Functions',
  IONIC_ANGULAR21_VITEST_SETUP: 'ionic-angular21-vitest-setup',
};
