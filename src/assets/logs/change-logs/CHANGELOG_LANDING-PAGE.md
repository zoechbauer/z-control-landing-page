# What's New

All recent updates and improvements to our **landing page**.

## [2.1] – YYYY-MM-DD

### 🚀 Improvements

- Require explicit consent for anonymous analytics: app access is disabled until the user opts in; if analytics consent is declined, display a clear informational message explaining the limitation.
- Disable Firebase Analytics on localhost by default; enable it only by explicitly setting the analytics logging variable.
- Updated footer feedback email subject to include contextual details for quicker identification and handling.
- Added a new ion-accordion in the z-control QR Code Generator that documents the differences between the web and mobile apps and provides an overview of the app’s structure.
- Clicking the logo toggles the footer (open/close) and records a Firebase Analytics event to track the interaction.
- Added a footer ion-toggle allowing users to opt in/out of analytics collection and updated the landing page privacy policy to reflect this choice.
- Code cleanup for improved maintainability.

## [2.0] – 2025-10-25

### 🚀 Improvements

- Added Firebase Analytics (GA4) integration with explicit user consent gating. Analytics collection is disabled by default and only enabled after user consent.
- Implemented a non‑blocking ConsentBanner to reliably request consent in production.
- Added FirebaseAnalyticsService and common analytics events:
  - page_view (on route changes)
  - accordion_change (opened sections)
  - download_native, get_source, open_web_app (CTA clicks)
- Added scripts/generate-env.js and environment templates to generate environment files from local/CI secrets; prevents committing real credentials.
- Documented DebugView testing, local debug index usage (index_DEBUG_FIREBASE-config.html), and deployment guidance in docs/FIREBASE_ANALYTICS.md and README.
- Created a dedicated privacy policy for the Landing Page (DE/EN) and updated the z-control QR Code Generator privacy page for improved layout and clarity.
- Minor README and documentation updates describing env generation, testing steps, and opt‑out instructions.

## [1.20] – 2025-09-25

### 📦 Installations

- **z-control QR Code Generator App: web installaton updated**: You can see the changes in the z-control QR Code Generator app in the section What's new? (Release Notes)

## [1.19] – 2025-09-06

### 🚀 Improvements

- Increased the height of the changelog dialog to display more information at once.
- The feedback email sent from the privacy policy page now includes a relevant subject line for easier identification.

### 📦 Installations

- **z-control QR Code Generator App: web installaton updated**: You can see the changes in the z-control QR Code Generator app in the section What's new? (Release Notes)

## [1.18] – 2025-08-31

### 🚀 Improvements

- Updated the download link for the z-control QR Code Generator app to point directly to Google Play.
- Enhanced the footer design for a consistent look and feel with the z-control QR Code Generator app.
- Added a new section in "What are CQ Codes and how can you use them?" detailing the features and capabilities of the z-control QR Code Generator app.

### 📦 Installations

- **z-control QR Code Generator App: web installaton updated**: You can see the changes in the z-control QR Code Generator app in the section What's new? (Release Notes)

## [1.17] – 2025-08-24

### 📦 Installations

- **z-control QR Code Generator App: web installaton updated**: You can see the changes in the z-control QR Code Generator app in the section What's new? (Release Notes)

## [1.16] – 2025-08-20

### 📦 Installations

- **z-control QR Code Generator App: web installaton updated**: You can see the changes in the z-control QR Code Generator app in the section What's new? (Release Notes)

## [1.15] – 2025-08-13

### 📦 Installations

- **z-control QR Code Generator App: web installaton updated**: You can see the changes in the z-control QR Code Generator app in the section What's new? (Release Notes)

## [1.14] – 2025-08-05

### 📦 Installations

- **z-control QR Code Generator App: web installaton updated**: You can see the changes in the z-control QR Code Generator app in the section What's new? (Release Notes)

## [1.13] – 2025-08-04

### 📦 Installations

- **z-control QR Code Generator App: web installaton updated**: You can see the changes in the z-control QR Code Generator app in the section What's new? (Release Notes)

## [1.12] – 2025-08-02

### 🚀 Improvements

- Updated Inline Help section with FAQ info

### 📦 Installations

- **z-control QR Code Generator App: web installaton updated**: You can see the changes in the z-control QR Code Generator app in the section What's new? (Release Notes)

## [1.11] – 2025-07-30

### 🚀 Improvements

- Updated the z-control support email address.

### 📦 Installations

- **z-control QR Code Generator App: web installaton updated**: You can see the changes in the z-control QR Code Generator app in the section What's new? (Release Notes)

## [1.10] – 2025-07-27

### 🚀 Improvements

- Unified footer styling across desktop and mobile for a consistent appearance.
- Enhanced ion-card design for improved contrast and readability.
- Code cleanup: ion-icon usage order standardized for improved maintainability

### 🐛 Fixes

- Fixed incorrect link to GitHub source code on the privacy policy page.
- Updated browser title to "z-control-4070" for better identification.

## [1.9] – 2025-07-26

### 🚀 Improvements

- A new accordion entry for QR code use cases has been added
- Copied icons have been replaced by ion-icon usages
- Layout improvements of the landing page when accessed from mobile devices

### 📦 Installations

- **z-control QR Code Generator App: web installaton updated**: You can see the changes in the z-control QR Code Generator app in the section What's new? (Release Notes)

## [1.8] – 2025-07-24

### 📦 Installations

- **z-control QR Code Generator App: web installaton updated**: You can see the changes in the z-control QR Code Generator app in the section What's new? (Release Notes)

## [1.7] – 2025-07-22

### 🚀 Improvements

- Improved header layout: Logo now correctly positioned on mobile and desktop and avoids overlapping with the back button

### 📦 Installations

- **z-control QR Code Generator App: web installaton updated**: You can see the changes in the z-control QR Code Generator app in the section What's new? (Release Notes)

## [1.6] – 2025-07-21

### 🚀 Improvements

- Improved header layout: Logo now correctly positioned on mobile and desktop and avoids overlapping with the back button

### 📦 Installations

- **z-control QR Code Generator App: web installaton updated**: You can see the changes in the z-control QR Code Generator app in the section What's new? (Release Notes)

## [1.5] - 2025-07-19

### 🚀 Improvements

- **wording improved**: QR code in brand name z-control QR Code Generator changed

### 📦 Installations

- **z-control QR Code Generator App: web installaton updated**: You can see the changes in the z-control QR Code Generator app in the section What's new? (Release Notes)

## [1.4] - 2025-07-17

### ✨ New Features

- **Separate change logs for each application**
  - z-control QR Code Generator app has a new accordion entry for change log

### 📦 Installations

- **z-control QR Code Generator App: web installaton updated**: You can see the changes in the z-control QR Code Generator app in the section What's new? (Release Notes)

## [1.3] - 2025-07-03

### ✨ New Features

- **What's New Dialog**

  - **ngx-markdown Integration**: Replaced custom changelog parser with ngx-markdown viewer for more reliable rendering
  - **WYSIWYG Display**: Markdown content now displays exactly as written, ensuring consistent formatting
  - **Improved Reliability**: No more parsing errors from formatting variations or extra spaces
  - **Better Maintainability**: Supports all standard markdown features without custom regex patterns

### 🐛 Fixes

- Email Client Issue on mobile devices when **using the Wep App of z-control QR Code Generator**

  - **Issue**: In the web app, the email client does not open on mobile devices when the "Mail Code" button is used

  - **Solution**: new user experience flow for e-mail sending

    - **_Native Apps (Android)_**

      1. User clicks "Mail Code"
      2. QR code downloads automatically
      3. Email client opens with pre-filled recipients, content and attachments
      4. User sends email

    - **_Desktop Web_**

      1. User clicks "Mail Code"
      2. QR code downloads to Downloads folder
      3. Alert shows instruction to manually attach files
      4. Email client opens via mailto: with recipients and content pre-filled
      5. User manually attaches downloaded files and sends

    - **_Mobile Web_**

      - **Android browsers**: Full functionality with options dialog (Try Email App,
        Copy QR Text, Manual Instructions, Cancel)

      - **iOS Safari/browsers**: ⚠️ **Limited functionality** - QR code downloads but email options dialog may not appear due to iOS browser restrictions

### 📦 Installations

- **z-control QR Code Generator App: web installaton updated**: You can see the changes in the z-control QR Code Generator app in the section What's new? (Release Notes)

## [1.2] - 2025-07-02

### 🚀 Improvements

- **What's New Dialog Redesign**

  - **Markdown Structure Support**: Changelog now properly displays nested markdown lists with visual hierarchy
  - **Enhanced Readability**: Main topics and sub-points are now clearly distinguished with proper indentation
  - **Improved Information Architecture**: Complex changelog entries are organized in a user-friendly, scannable format
  - **Better Content Presentation**: Multi-level markdown documents are now displayed with professional styling

### 📦 Installations

- **z-control QR Code Generator App: web installaton updated**: You can see the changes in the z-control QR Code Generator app in the section What's new? (Release Notes)

## [1.1] - 2025-07-01

### ✨ New Features

- **Version Information**: You can now see the current version in the footer
- **What's New Dialog**: Click "What's New" in the footer to see recent updates

### 🚀 Improvements

- **Consistent Design**: Unified visual style throughout the application
- **Performance**: Faster loading and smoother navigation
- **Accessibility**: Better support for screen readers and keyboard navigation
- **Better Documentation**: Improved help and guidance throughout the site

### 🐛 Fixes

- **Dark Mode Support**: Fixed text visibility issues when using dark mode
- **Better Readability**: Improved contrast and text clarity across all pages
- **Mobile Experience**: Enhanced display on mobile devices and tablets

## [1.0] - 2025-06-30

### 📦 Installations

- **Landing Page**: Complete showcase for our applications
- **Privacy Policy**: Comprehensive privacy information in German and English
- **App Information**: Details about z-control QR Code Generator app and download options
- **Mobile Ready**: Fully responsive design for all devices
- **Professional Design**: Clean, modern interface following best practices

---

Thank you for using our applications!
