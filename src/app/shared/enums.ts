export enum Tab {
  Settings = 'settings',
  MainFeature = 'main',
}

export enum LogoType {
  Copyright = 'copyright',
  Company = 'company',
}

export enum ToastAnchor {
  MainPage = 'toast-anchor-main',
  SettingsPage = 'toast-anchor-settings',
}

// Single source of truth for settings accordion IDs.
// Add new accordion IDs here when extending the settings page.
// Update ID and value in templates when changing the enum.
export enum SettingsAccordion {
  LPS_ChangeLanguage = 'LPS_ChangeLanguage',
  LPS_Feedback = 'LPS_Feedback',
  LPS_FirebaseAnalytics = 'LPS_FirebaseAnalytics',
  LPS_GithubAnalytics = 'LPS_GithubAnalytics',
  LPS_PrivacyPolicy = 'LPS_PrivacyPolicy',
  LPS_ChangeLog = 'LPS_ChangeLog',
  LPS_GetSource = 'LPS_GetSource',
}

