export interface QrCodeGeneratorSectionParameters {
  appSectionParameters: AppSectionParameters;
  maxInputLength: number;
}
export interface BackupScriptsSectionParameters {
  appSectionParameters: AppSectionParameters;
}
export interface MultipleLanguageTranslatorSectionParameters {
  appSectionParameters: AppSectionParameters;
  maxInputLength: number;
  maxTargetLanguages: number;
  maxTranslateCharsTotalPerMonth: number;
  maxTranslateCharsUserPerMonth: number;
}
export interface AppSectionParameters {
  selectedAccordion: string;
  currentMainAccordion: string;
  subAccordionOpened: boolean;
  isAnalyticsAllowed: boolean;
}
