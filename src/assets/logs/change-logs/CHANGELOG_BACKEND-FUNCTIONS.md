# Changelog

All notable changes to this project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project uses [Semantic Versioning](https://semver.org/).

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