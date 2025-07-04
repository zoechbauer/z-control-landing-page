# What's New

All recent updates and improvements to our landing page.

## [1.3] - July 3, 2025

### 🐛 Fixes

- **QR Code App: Email Client Issue on mobile devices when using the Wep App**
  - **Issue**: In the web app, the email client does not open on mobile devices when the "Mail Code" button is used
  - **Solution**: new user experience flow for e-mail sending

    - ***Native Apps (iOS/Android)***

      1. User clicks "Mail Code"
      2. QR code downloads automatically
      3. Email client opens with pre-filled recipients, content and attachments
      4. User sends email

    - ***Desktop Web***

      1. User clicks "Mail Code"
      2. QR code downloads to Downloads folder
      3. Alert shows instruction to manually attach files
      4. Email client opens via mailto: with recipients and content pre-filled
      5. User manually attaches downloaded files and sends

    - ***Mobile Web (iOS/Android browsers)***

      1. User clicks "Mail Code"
      2. QR code downloads to Downloads folder
      3. Options dialog appears with choices:
         - **Copy QR Text**: Copies text to clipboard with success feedback
         - **Try Email App**: Attempts to open email client (may not work)
         - **Manual Instructions**: Shows detailed step-by-step guide
         - **Cancel**: Closes dialog

### 🚀 Improvements

- **What's New Dialog**
  - **ngx-markdown Integration**: Replaced custom changelog parser with ngx-markdown viewer for more reliable rendering
  - **WYSIWYG Display**: Markdown content now displays exactly as written, ensuring consistent formatting
  - **Improved Reliability**: No more parsing errors from formatting variations or extra spaces
  - **Better Maintainability**: Supports all standard markdown features without custom regex patterns

## [1.2] - July 2, 2025

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
