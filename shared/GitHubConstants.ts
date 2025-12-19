// GitHub repository constants and types

// ***********************************************
// Ensure consistency between backend and frontend
// ***********************************************
export const COLLECTION = {
  GITHUB_ANALYTICS_TRAFFIC: 'githubAnalyticsTraffic',
  GITHUB_ANALYTICS_TRAFFIC_HISTORY: 'githubAnalyticsTrafficHistory',
};

export const REPO = {
  Z_CONTROL_LANDING_PAGE: 'z-control-landing-page',
  Z_CONTROL_QR_CODE_GENERATOR: 'z-control-qr-code-generator',
  Z_CONTROL_BACKUP_SCRIPTS: 'z-control-Backup-scripts',
  COPILOT_LEARNING_CALCULATOR: 'copilot-learning-calculator',
};

export const REPOS = [
  { owner: 'zoechbauer', repo: REPO.Z_CONTROL_LANDING_PAGE },
  { owner: 'zoechbauer', repo: REPO.Z_CONTROL_QR_CODE_GENERATOR },
  { owner: 'zoechbauer', repo: REPO.Z_CONTROL_BACKUP_SCRIPTS },
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
  LANDING_PAGE: 'Landing Page',
  QR_CODE_GENERATOR: 'QR Code Generator',
}