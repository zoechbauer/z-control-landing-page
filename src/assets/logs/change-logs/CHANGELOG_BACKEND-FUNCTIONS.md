# Changelog

All notable changes to this project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project uses [Semantic Versioning](https://semver.org/).

## [2.4] - 2026-07-08

### Added

- Added `run-firebase-emulators.cmd` to set Java 25 and run Firebase emulators for local development. Firebase emulators will drop support for Java versions below 21 in firebase-tools@15, so this script ensures a compatible runtime is used.

### Changed

- Updated package.json scripts to use the new `run-firebase-emulators.cmd` script for running Firebase emulators, ensuring that Java 25 is set before starting the emulators.
- Updated the README with instructions for running Firebase emulators using the new script.
- Added `used-java-versions.md` to document the Java versions used in this repository and linked it from the docs index.
- Marked the TODO list as complete after resolving all listed items.

## [2.3] - 2026-07-07

### Changed

- Enabled ESLint's `no-unused-vars` rule and removed unused variables across the codebase to improve maintainability.
- Enabled ESLint's `no-invalid-this` for production code. No errors were found in the production code, but tests were exempted from this rule.
- All ESLint errors have been fixed, and the linting configuration has been updated to enforce stricter rules for production code while allowing flexibility in test files.
- Removed the `userId` parameter from helper functions in `firebase-firestore.service.ts`; the current user context is used instead, simplifying function signatures.
- Renamed helper suffix `forUser` to `forCurrentUser` (e.g. `getCharCountForUser` → `getCharCountForCurrentUser`) to reflect use of the current user context.
- Expanded and refined unit tests for `firebase-firestore.service.ts` and `firebase-firestore-utils.service.ts` to increase coverage and reliability.

## [2.2] - 2026-07-04

### Added

- Reorganized the functions folder structure to separate function types and related files for easier navigation, better maintainability, and improved scalability.
- Added `loadEnv.ts` to load environment variables from `.env.local` for local development.
- Added `rimraf` as a dev dependency to provide a cross-platform way to remove files and directories.
- Added JSDoc comments to all backend functions to improve documentation and maintainability.

### Changed

- Updated `package.json` scripts to add a prebuild step that uses `rimraf` to clean the `lib` directory before building.
- Moved environment loading out of `bootstrap.ts`; it is now handled by `loadEnv.ts` in the project root.
- Updated unit test import paths to match the refactored folder structure. 220 tests cover 99.65% of the code, ensuring that all functions are thoroughly tested and validated.
- Reduced the line length limit in the ESLint configuration to 100 characters, and updated function descriptions to improve readability and maintainability.

### Fixed

- Enabled no-explicit-any for production code and resolved all related lint errors, improving type safety and maintainability. The rule remains disabled for test files to preserve flexibility in test setups.
- Enabled linting for empty functions and fixed all reported issues to enforce clearer, more intentional code.
- Enabled no-non-null-assertion and removed non-null assertions from the codebase to improve type safety and reduce potential runtime errors.

## [2.1] - 2026-06-29

### Added

- Added unit tests for GitHub analytics functions to improve correctness and reliability.
- Added unit tests for `testEnv.ts` to verify that environment variables are loaded correctly and that the script behaves as expected.
- Added `github-analytics-explanation.md` to document GitHub Analytics metrics, including clones, unique clones, visitors, and unique visitors, with examples and explanations of how GitHub counts them.
- Added the `isLogging` parameter to `processRepo` in `traffic.ts` to control logging behavior during testing and production runs. It defaults to `false`, reducing noise in production while still allowing detailed logging during testing and debugging.

### Removed

- Removed the `logInfo` property from the `testGitHubAnalytics` response because logging is now handled internally and no longer needs to be exposed.

## [2.0] - 2026-06-27

### Added

- Split the GitHub analytics functions into separate files to improve organization, testability, and maintainability.

### Removed

- Removed obsolete `githubAnalytics.ts` and its old spec file.

## [1.2] - 2026-06-14

### Added

- Moved the GitHub Analytics functions and documentation from **z-control Landing Page** into this repository, and updated the related documentation accordingly.
- Added a `CHANGELOG.md` file to document changes and releases in a structured format.
- Added version history and release notes for all published versions to `CHANGELOG.md`.
- Added a `tools` folder with helper scripts for backing up uncommitted files and a changelog template.

### Changed

- Updated the README to reflect the latest backend function changes and repository structure.
- Updated the TODO list to include new tasks related to the GitHub Analytics functions and documentation.

### Fixed

- Fixed unit test failures by updating tests that still expected console logs removed from the functions.

## [1.1] - 2026-06-12

### Changed

- Updated the Firebase documentation after the backend move.
- Renamed the repository reference in the Firebase document from z-control-ionic-setup to z-control-backend-functions.
- Reflected the migration of shared backend code to the new backend repository in documentation and release notes.

## [1.0] - 2026-06-11

### Added

- Added the `ZC_image_to_text_statistics` collection to `app.constants.ts`.
- Added a README with the project overview and setup instructions.
- Created a docs folder and migrated Firebase documents from z-control-ionic-setup.
- Added a TODO list for open activities.

### Changed

- Documented Android configuration in `z-control-ionic-setup-usage.md`.

## [0.2] - 2026-06-11

### Changed

- Added `.eslintrc.cjs` with ESLint 8 configuration compatible with ES modules.
- Temporarily deactivated strict rules for test files (`no-explicit-any`, `require-jsdoc`, `no-invalid-this`).
- Fixed auto-fixable lint errors such as line breaks, indentation, and spacing.
- Ignored Vitest config files to prevent parsing errors.
- Verified that linting and Firebase deployment run successfully.

## [0.1] - 2026-06-11

### Added

- Moved the entire functions directory from z-control-ionic-setup.
- Preserved all Firebase functions, services, and tests.
- Maintained package.json dependencies and configuration.
- Prepared the repository for unified backend management.
