# What's New

All recent updates and improvements to our landing page.

## [1.2] - July 2, 2025

### 🐛 Fixes

- **QR Code App: Email Client Issue on iPad Fixed**
  - **Issue**: Email client was not opening on iPad/Safari when using the "Mail code" button
  - **Root Cause**: Safari on iOS blocks `mailto:` actions when triggered simultaneously with file downloads, treating multiple programmatic actions as potentially suspicious
  - **Solution**: Added user interaction requirement - users now see a confirmation dialog after files download, then can manually trigger the email client
  - **Result**: Email functionality now works reliably across all iOS devices and browsers

### 🚀 Improvements

- **What's New Dialog**

  - **Markdown Structure Support**: Changelog now properly displays nested markdown lists with visual hierarchy
  - **Enhanced Readability**: Main topics and sub-points are now clearly distinguished with proper indentation
  - **Improved Information Architecture**: Complex changelog entries are organized in a user-friendly, scannable format
  - **Better Content Presentation**: Multi-level markdown documents are now displayed with professional styling

- **QR Code App: Code Quality & Reliability**

  - Enhanced error handling throughout the application
  - Added input validation service to prevent circular dependencies
  - Refactored email utilities for better maintainability

- **QR Code App: Accessibility Enhancements**

  - Added keyboard navigation support (`Enter` and `Space` keys) for all interactive elements
  - Improved screen reader compatibility

- **QR Code App: Developer Experience**
  - Eliminated SonarQube warnings for better code quality
  - Improved TypeScript type safety

---

## [1.1] - July 1, 2025

### ✨ New Features

- **Version Information**: You can now see the current version in the footer
- **What's New Dialog**: Click "What's New" in the footer to see recent updates
- **Better Documentation**: Improved help and guidance throughout the site

### 🐛 Fixes

- **Dark Mode Support**: Fixed text visibility issues when using dark mode
- **Better Readability**: Improved contrast and text clarity across all pages
- **Mobile Experience**: Enhanced display on mobile devices and tablets

### 🚀 Improvements

- **Consistent Design**: Unified visual style throughout the application
- **Performance**: Faster loading and smoother navigation
- **Accessibility**: Better support for screen readers and keyboard navigation

---

## [1.0] - June 30, 2025

### 🎉 Initial Release

- **Landing Page**: Complete showcase for our applications
- **Privacy Policy**: Comprehensive privacy information in German and English
- **App Information**: Details about z-control QR Code app and download options
- **Mobile Ready**: Fully responsive design for all devices
- **Professional Design**: Clean, modern interface following best practices

---

## What's Coming Next

We're continuously working to improve your experience. Future updates will include:

- Additional language support
- New app showcases
- Enhanced mobile features
- Performance improvements

Thank you for using our applications!
