# Landing Page Changelog

All notable changes to the Landing Page application will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1] - 2025-07-01

### Added

- Version display in footer component
- Comprehensive changelog system
- Dark mode color guide documentation

### Fixed

- **Dark Mode Compatibility**: Fixed hardcoded colors that were unreadable in dark mode
  - Card content text now uses `var(--ion-text-color)` instead of `#000`
  - Privacy policy text properly adapts to theme
  - Accordion backgrounds use subtle `var(--ion-color-step-100)` instead of intense primary colors
  - Button links use `var(--ion-color-primary-contrast)` for proper contrast
- **Accordion Styling**: Improved visual design with border-only approach for better readability
- **Link Visibility**: All links now maintain proper contrast in both light and dark themes

### Improved

- **Color System**: Migrated to Ionic's theme-aware CSS custom properties
- **Documentation**: Added comprehensive dark mode color implementation guide
- **User Experience**: Better visual consistency across all themes

---

## [1.0] - 2025-06-30

### Added

- Initial landing page implementation
- Privacy policy system with multi-language support (DE/EN)
- Firebase hosting configuration
- Ionic Angular application structure
- Mobile-responsive design
- App showcase and download links preparation

### Features

- **Multi-language Support**: Privacy policies available in German and English
- **Responsive Design**: Optimized for mobile and desktop viewing
- **Firebase Integration**: Ready for hosting and deployment
- **Professional Layout**: Clean, modern design following Ionic design system

---

## Version History Summary

| Version | Date       | Description                       |
| ------- | ---------- | --------------------------------- |
| 1.1     | 2025-07-01 | Dark mode fixes, changelog system |
| 1.0     | 2025-06-30 | Initial release                   |

---

## Development Notes

### Color System Migration (v1.1)

- Replaced all hardcoded colors (`#000`, `#fff`, `#eaeaea`) with Ionic CSS custom properties
- Implemented theme-aware color variables for automatic light/dark mode support
- Created comprehensive color guide for future development

### Documentation Standards

- All changes follow semantic versioning
- Markdown documentation with consistent formatting
- Technical guides for maintainability
