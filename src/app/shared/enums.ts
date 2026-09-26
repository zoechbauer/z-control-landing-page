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

export enum LocalStorage {
  SelectedLanguage = 'selectedLanguage',
  AnalyticsEnabled = 'analytics_enabled',
}

export enum DeviceTypeEnum {
  // Apple devices
  iPhone = 'iPhone',
  iPad = 'iPad',
  Mac = 'Mac',

  // Android devices
  AndroidPhone = 'android-phone',
  AndroidPad = 'android-pad',
  WinPhone = 'win-phone',

  // Web platforms
  WebMobile = 'web-mobile',
  WebDesktop = 'web-desktop',
}

export enum EventEnum {
  APP_START = 'app_start',
  ANALYTICS_CHG_ENABLED = 'analytics_chg_enabled',
  ANALYTICS_CHG_DISABLED = 'analytics_chg_disabled',
  LANG_CHG_DE = 'lang_chg_DE',
  LANG_CHG_EN = 'lang_chg_EN',
  READ_POLICY_FROM_SETTINGS = 'policy_from_settings',
  READ_POLICY_FROM_ANALYTICS = 'policy_from_analytics',
  SEND_FEEDBACK = 'send_feedback'
}
