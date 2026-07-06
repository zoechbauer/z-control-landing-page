# What's New?

Welcome to the latest updates for the **z-control Ionic Setup** app.

## Versioning

This project uses a simplified major.minor versioning scheme:

- Major versions indicate significant milestones or breaking changes.
- Minor versions indicate new features, improvements, and bug fixes.
- Patch numbers are intentionally omitted; all changes are released as major or minor versions.

## [2.2] - 2026-07-05

### 🔧 Internal

- Updated TypeScript configuration (tsconfig.json and tsconfig.spec.json) to remove the deprecated baseUrl option and use paths instead, improving compatibility with newer TypeScript and Angular versions while keeping existing relative import paths unchanged.
- Updated the import path of the environment file in all TypeScript files to use the new `@env` alias, ensuring consistent and maintainable imports across the project.
- Updated the import path of the `createTranslateServiceMock` function in all unit test files to use the new `@testing` alias, improving test code organization and maintainability.
- Updated the import path `src/app/...` to `@app` in all TypeScript files, standardizing import paths and improving code readability and maintainability.

## [2.1] - 2026-06-30

### 🔧 Internal

- Removed the 3-second fallback from `waitForAuthReady()` in the Firestore service and now rely on Firebase Auth state restoration to complete before continuing.
- Normalize line endings in git to LF to ensure consistent formatting across different operating systems and development environments.

## [2.0] - 2026-06-11

### ✨ New Architecture

- **Refactor of the z-control Ionic Setup project** to remove all Backend code and Backend documentation and move it to the new  **z-control Backend Functions** app. Otherwise, all cloned apps would have to remove the functions folder, as the functions are shared by all apps and are not app-specific. This refactor allows the z-control Ionic Setup project to focus exclusively on frontend code and shared configurations, while the z-control Backend Functions project manages all backend logic and functions for multiple apps.
- Removed functions folder from the project because functions are never implemented in frontend projects but only in the backend functions project. This cleanup ensures that the frontend project remains focused on UI and client-side logic, while all backend functionality is centralized in the new z-control Backend Functions project.
- Updated the README to reflect the new app structure and provide instructions for using the z-control Backend Functions project for backend functionality.
- Removed backend-related documentation from the docs folder, as the backend code is now mangaged in the separate z-control Backend Functions project. This cleanup ensures that the documentation remains relevant to the frontend app and directs users to the appropriate resources for backend development.

### ✨ New Features

- Added an Android Configuration section to `z-control-ionic-setup-usage.md` to document the required native Android changes when creating a new app from the setup project.

## [1.1] - 2026-06-09

### 🚀 Improvements

- The long and short app names are now sourced exclusively from the environment configuration, ensuring consistent naming throughout the application and simplifying maintenance.
- Updated the user help page with a notice explaining why the demo feature "Search Related Words" is not documented in detail and how it can be used to explore the quota management system.
- Added guidance directing users to the "How do I use the app?" section for information about monitoring monthly quota usage.
- Changed IONIC to Ionic in the changelog and app for consistent branding.

## [1.0] - 2026-06-07

### 🚀 Improvements

- Improved wording, styling, and code comments on the feature page for better clarity and usability.
- Restyled the statistics display mode toggle for improved visual consistency and user experience.
- Updated the link to the source code in the settings page to point to the correct GitHub repository for this setup app.
- Added a note about the license information in the settings page to reflect that in future app the example license has to be replaced with your own privacy policy.
- Replaced Ionic icons with z-control branded icons.
- Updated splash screen and launcher icons across multiple resolutions.
- Added native Android support services and comprehensive unit tests.
- Configured Gradle auto-signing for Android builds using a `keystore.properties` file.
- Maintained high test quality with 99.25% backend coverage (172 tests) and 99.65% frontend coverage (526 tests).

### 📦 Deployment

- Hosted the application on Firebase Hosting.
- Successfully published and tested the Android application through the Google Play Internal Testing track.
- Verified successful operation on both Firebase Hosting and physical Android devices.

## [0.7] - 2026-06-05

### ✨ New Features

- Added Capacitor integration to the setup app, including installation and configuration of the Splash Screen plugin.
- Added documentation for integrating Capacitor plugins into the setup app, covering installation, configuration, and usage within the z-control Ionic Setup project.
- Added documentation for publishing the setup app to Google Play Store, including build preparation, application signing, and release workflow.
- Resolved Android installation and build issues documented in `mobile-problem-fixed.md`:
  - Updated Android Gradle Plugin to version 8.10.1 for Capacitor 8 compatibility.
  - Standardized the Java runtime to version 17 to resolve the `invalid source release: 21` build error.
  - Expanded troubleshooting documentation with detailed resolution steps.
- Successfully deployed and tested the application on a physical Android device, confirming that installation and runtime issues have been resolved.

## [0.6] - 2026-06-04

### 🚀 Improvements

- Added a visible notice that the help page is still a draft and should be updated when this setup app is used to create a new app.

### 🔧 Internal

- Added missing function documentation in frontend and backend services to improve readability and maintainability.
- Applied minor formatting, code, and comment refinements for better consistency across the codebase.

## [0.5] - 2026-06-03

### ✨ New Features

- Added a loading spinner on the feature page to improve feedback during async requests.
- Removed `targetLanguages` from feature quota/statistics flows because it is no longer required.
- Expanded project documentation with clearer setup guidance, backend ownership rules, and integration workflow notes.
- Migrated cloud functions from the z-control Translator app into this setup app as the shared backend owner.

### 🔧 Internal

- Added `addConsumedFeatureChars` usage for `secure-feature` to align backend quota tracking with the new feature model.
- Improved emulator host detection to better handle local emulator and production environments.
- Updated frontend/backend tests and docs to reflect the latest backend structure and deployment ownership policy.

## [0.4] – 2026-06-01

### 🐛 Fixes

- Renamed "Translator" to "Feature" across the UI to better reflect that this app demonstrates feature implementation in the z-control Ionic Setup project, rather than acting as a standalone translator.

### 🔧 Internal

- Renamed "Translation statistics" to "Feature statistics" across the app.
- Updated feature usage/statistics handling and related limits to match the new terminology.
- Updated English and German translations for consistent wording.
- Updated frontend tests and added backend tests for secure-feature.
- Maintained high test quality with 100% backend coverage (133 tests) and 99.55% frontend coverage (504 tests).


## [0.3] – 2026-05-30

### 🔧 Internal

- Refactored and updated tests to support the new appId parameters, ensuring continued app stability after major changes.
- Achieved 100% backend test coverage (118 tests) and 99.55% frontend test coverage (498 tests), maintaining high reliability and code quality.

## [0.2] – 2026-05-23

### ✨ New Features

- Added Firebase Functions to store quota usage data in Firestore.
- Implemented the Search Related Words feature using the Datamuse API, with results shown on the Main page. This feature demonstrates how to implement functionality in the z-control Ionic Setup project.
- Added quota usage tracking for the Search Related Words feature, including monthly quota management.
- Added relevant documentation for Firebase Functions and unit testing based on the z-control Translator app.

### 🔧 Internal

- Removed targetLanguages from getCharCountForUser in the Firestore service, as it is no longer required for quota tracking.

## [0.1] – 2026-05-20

### ✨ New Features

- Initial release of the Ionic setup app with a Main page and a Settings page, built with Angular 20 and Ionic 8.
- Added test infrastructure with Jasmine and Karma.
- Main page now includes a feature-call simulation button with toast feedback.
- Settings page now includes:
  - Language selection
  - Feedback option for z-control
  - Monthly usage/statistics overview
  - Privacy information
  - App version and release notes
  - Mobile app installation info
  - Source code link to GitHub
- Established a maintainable foundation for future z-control Ionic app features.

### 🛡 Security

- Your data stays on your device and is not shared with third parties.
- Only the used features send data to the backend for processing.
