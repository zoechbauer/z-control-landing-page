// @ts-nocheck
export const environment = {
  "production": __PRODUCTION__,
  "version": {
    "major": __MAJOR__,
    "minor": __MINOR__,
    "date": '__DATE__',
  },
  "logAnalyticsInDevMode": __LOG_ANALYTICS_IN_DEV_MODE__,
  "appSection": {
    "QR": {
      "maxInputLength": __appSection.QR.MAX_INPUT_LENGTH__
    },
    "MLT": {
      "maxTargetLanguages": __appSection.MLT.MAX_TARGET_LANGUAGES__,
      "maxFreeTranslateCharsPerMonth": __appSection.MLT.MAX_FREE_TRANSLATE_CHARS_PER_MONTH__,
      "maxFreeTranslateCharsPerMonthForUser": __appSection.MLT.MAX_FREE_TRANSLATE_CHARS_PER_MONTH_FOR_USER__,
      "maxFreeTranslateCharsBufferPerMonth": __appSection.MLT.MAX_FREE_TRANSLATE_CHARS_BUFFER_PER_MONTH__,
      "maxInputLength": __appSection.MLT.MAX_INPUT_LENGTH__
    }
  },
  "firebase": {
    "apiKey": "__FIREBASE_API_KEY__",
    "authDomain": "__FIREBASE_AUTH_DOMAIN__",
    "projectId": "__FIREBASE_PROJECT_ID__",
    "storageBucket": "__FIREBASE_STORAGE_BUCKET__",
    "messagingSenderId": "__FIREBASE_MESSAGING_SENDER_ID__",
    "appId": "__FIREBASE_APP_ID__",
    "measurementId": "__FIREBASE_MEASUREMENT_ID__",
  },
};
