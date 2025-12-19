# z-control Landing Page

A modern, mobile-first landing page built with Ionic and Angular, highlighting the z-control open-source applications and developer tools. Designed for responsiveness, accessibility, and seamless user experience across all devices.

## 🌟 Features

- **Modern Design**: Clean, professional interface following Ionic design principles
- **Dark Mode Support**: Automatic light/dark theme switching with proper contrast
- **Mobile Responsive**: Optimized for all devices from mobile to desktop
- **Multi-language Support for Privacy**: Privacy policies available in German and English
- **Version Management**: Built-in changelog system with user-friendly updates
- **Firebase Ready**: Configured for Firebase hosting and deployment with Firebase Analytics
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support
- **Firebase Analytics**: Integrated event tracking and consent management ([see details](./docs/FIREBASE_ANALYTICS_USED_IN_APP.md))
- **GitHub Analytics**: Automated fetching and display of repository traffic ([see details](./docs/GITHUB_ANALYTICS_ARCHITECTURE.md))

## 🚀 Live Demo

🔗 **[View Live Site](https://z-control-4070.web.app)** on Google Firebase

## 📱 Showcased Applications

### z-control QR Code App

- **Web App**: [Try directly in browser](https://z-control-qr-code.web.app) without installation
- **Android App**: [Available on Google Play Store](https://play.google.com/apps/internaltest/4700763022412481257)
- **Source Code**: [GitHub Repository](https://github.com/zoechbauer/z-control-qr-code-generator)
- **Features**: QR code generation, offline functionality, multi-language support, qr code settings, configured e-mail sending

## 🛠️ Tech Stack

- **Framework**: Ionic 8 with Angular 18
- **Language**: TypeScript
- **Styling**: SCSS with Ionic CSS Variables
- **Hosting**: Firebase Hosting
- **Build Tool**: Angular CLI
- **Icons**: Ionicons
- **Firebase Analytics**: Event tracking, consent management
- **Firebase Storage**
- **GitHub Analytics API**: Automated traffic data collection and display

## 📁 Project Structure

```
landing-page/
├─ .angular/
├─ .browserslistrc
├─ .editorconfig
├─ .env.local                   # local secrets (do NOT commit)
├─ .eslintrc.json
├─ .gitignore
├─ .vscode/
├─ angular.json
├─ capacitor.config.ts
├─ firebase-example.json
├─ ionic.config.json
├─ karma.conf.js
├─ LICENSE
├─ package-lock.json
├─ package.json
├─ README.md
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.spec.json
├─ docs/                        # technical documentation
│  ├─ FIREBASE_ANALYTICS.md
│  ├─ FIREBASE_ANALYTICS_USED_IN_APP.md
│  ├─ FIREBASE_CONFIG_ENVIRONMENT_FILES.md
│  ├─ FIREBASE_DEPLOYMENT_GUIDE.md
│  ├─ FIREBASE_SECURITY.md
│  ├─ GITHUB_ANALYTICS_ARCHITECTURE.md
│  ├─ GITHUB_ANALYTICS_TEST_LOCALLY.md
│  ├─ PRIVACY_POLICY_ARCHITECTURE.md
│  ├─ unit-tests/
│  │  ├─ FIREBASE_ANALYTICS_SERVICE_TESTS.md
│  │  └─ UNIT_TESTING_PLAN.md
│  └─ ...other docs...
├─ functions/                   # Firebase Cloud Functions (GitHub Analytics)
│  ├─ lib/
│  ├─ node_modules/
│  ├─ src/
│  │  ├─ shared/
│  │  │  └─ GitHubConstants.ts
│  │  ├─ GitHubAnalytics.ts
│  │  ├─Index.ts
│  │  └─ testEnv.ts
│  └─ ...other files, like package.json, tsconfig.json...
├─ node_modules/
├─ scripts/
│  └─ generate-env.js
├─ shared/
│  └─ GitHubConstants.ts
├─ tools/
│  ├─ backup_non_committed_files.ps1
│  ├─ backup_non_committed_files.txt
│  ├─ CHANGELOG_template.md
│  ├─ CHANGELOG_template DE.md
│  └─ README.md
└─ src/
   ├─ index.html
   ├─ index_DEBUG_FIREBASE-config.html  # local debug index (do NOT commit)
   ├─ global.scss
   ├─ main.html
   ├─ environments/
   │  ├─ environment.ts
   │  └─ environment.prod.ts
   ├─ assets/
   │  ├─ icon/
   │  ├─ logs/
   │  │  └─ change-logs/
   │  │        ├─ CHANGELOG_LANDING-PAGE.md
   │  │        └─ CHANGELOG_QR-CODE.md
   │  └─ privacy/
   │     └─ policies/
   │        ├─ premium/
   │        │  ├─ premium-en.html
   │        │  └─ premium-de.html
   │        ├─ landing-page/
   │        │  ├─ landing-page-en.html
   │        │  └─ landing-page-de.html
   │        └─ qr-code-generator/
   │           ├─ qr-code-generator-en.html
   │           └─ qr-code-generator-de.html
   └─ app/
      ├─ app.component.ts
      ├─ app.component.html
      ├─ app.component.scss
      ├─ app.routes.ts
      ├─ home/                    # main landing page sources
      ├─ privacy/                 # privacy policy system
      │  ├─ components/
      │  │  └─ privacy-viewer/
      │  │     ├─ privacy-viewer.component.ts
      │  │     └─ privacy-viewer.component.html
      │  ├─ policies/
      │  │  └─ README.md     
      │  └─ services/
      │     └─ privacy.service.ts
      ├─ services/                # app-wide / cross-cutting services
      │  ├─ firebase-analytics.service.ts
      │  ├─ firebase-firestore.service.ts
      │  ├─ local-storage.service.ts
      │  ├─ utils.service.ts
      ├─ ui/
      │  └─ components/
      │     ├─ footer/
      │     │  ├─ footer.component.ts
      │     │  ├─ footer.component.scss
      │     │  └─ footer.component.html
      │     ├─ markdown-viewer/
      │     │  ├─ markdown-viewer.component.ts
      │     │  ├─ markdown-viewer.component.scss
      │     │  └─ markdown-viewer.component.html
      │     ├─ header/
      │     │  ├─ header.component.ts
      │     │  ├─ header.component.scss
      │     │  └─ header.component.html
      │     └─ github-analytics/
      │        ├─ github-analytics.component.ts
      │        ├─ github-analytics.component.scss
      │        └─ github-analytics.component.html
      └─ theme/                    # global styling (variables, global.scss)
```

**Notes:**
- Real Firebase config and local debug index are not committed (`.env.local`, `index_DEBUG_FIREBASE-config.html`).
- Privacy policy HTML templates are in `src/assets/privacy/policies` and loaded dynamically.
- GitHub analytics architecture and Firestore integration are described in [docs/GITHUB_ANALYTICS_ARCHITECTURE.md](./docs/GITHUB_ANALYTICS_ARCHITECTURE.md).

## 🔧 Development

### Available Scripts

```bash
# generate environment files
npm run generate-env

# Development server
ionic serve

# Build for production
ionic build

# Run tests
ng test

# Lint code
ng lint

# Build and preview
ionic build && ionic serve --prod
```

### Environment Configuration

Update version information and firebase config in `.env.local and run npm run generate-env`:

```typescript
export const environment = {
  production: __PRODUCTION__,
  version: {
    major: __MAJOR__,
    minor: __MINOR__,
    date: "__DATE__",
  },
  firebase: {
    apiKey: "__FIREBASE_API_KEY__",
    authDomain: "__FIREBASE_AUTH_DOMAIN__",
    projectId: "__FIREBASE_PROJECT_ID__",
    storageBucket: "__FIREBASE_STORAGE_BUCKET__",
    messagingSenderId: "__FIREBASE_MESSAGING_SENDER_ID__",
    appId: "__FIREBASE_APP_ID__",
    measurementId: "__FIREBASE_MEASUREMENT_ID__",
  },
};
```

**Important: do NOT commit generated files**

- Keep real Firebase config in `.env.local` (listed in .gitignore).
- Run `npm run generate-env` locally or in CI to create `src/environments/environment*.ts`.
- Do not commit `src/environments/environment*.ts` or an index.html with real measurement ID.

## 🚀 Deployment

### Firebase Hosting

1. **Install Firebase CLI**

   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**

   ```bash
   firebase login
   ```

3. **Initialize project** (first time only)

   ```bash
   firebase init hosting
   ```

4. **Build and deploy**
   ```bash
   ionic build
   firebase deploy
   ```

For detailed deployment instructions, see [docs/FIREBASE_DEPLOYMENT_GUIDE.md](./docs/FIREBASE_DEPLOYMENT_GUIDE.md).

## 🎨 Customization

### Theming

The app uses Ionic CSS Variables for consistent theming. Main theme files:

- `src/theme/variables.scss` - Color definitions
- `src/global.scss` - Global styles
- Component-specific SCSS files for custom styling

### Adding New Content

1. **Update changelog**: Modify `src/services/changelog-simple.service.ts`
2. **Add new apps**: Update home page content and routing
3. **Customize styling**: Use Ionic CSS variables for theme consistency

## 📚 Documentation & Changelogs

Technical documentation is available in the `/docs` folder:

- **[Dark Mode Guide](./docs/IONIC_DARK_MODE_COLOR_GUIDE.md)** - Implementation details for dark mode support
- **[Firebase Security](./docs/FIREBASE_SECURITY.md)** - Security configuration and best practices
- **[Firebase Analytics Usage](./docs/FIREBASE_ANALYTICS_USED_IN_APP.md)** - Analytics integration and event tracking
- **[Firebase Analytics Architecture](./docs/FIREBASE_ANALYTICS.md)** - Service architecture and implementation
- **[GitHub Analytics Architecture](./docs/GITHUB_ANALYTICS_ARCHITECTURE.md)** - Automated traffic data collection and Firestore integration
- **[Privacy Policy Architecture](./docs/PRIVACY_POLICY_ARCHITECTURE.md)** - Multi-language privacy system details
- **[Firebase Deployment Guide](./docs/FIREBASE_DEPLOYMENT_GUIDE.md)** - Deployment procedures
- **[Firebase Config Environment Files](./docs/FIREBASE_CONFIG_ENVIRONMENT_FILES.md)** - Environment setup and secrets management
- **[Unit Testing Plan](./docs/unit-tests/UNIT_TESTING_PLAN.md)** - Comprehensive testing strategy
- **[Firebase Analytics Service Tests](./docs/unit-tests/FIREBASE_ANALYTICS_SERVICE_TESTS.md)** - Detailed test documentation

Changelogs for each app are stored in `src/assets/logs/change-logs/`:

- `CHANGELOG_LANDING-PAGE.md` — for the landing page
- `CHANGELOG_QR-CODE.md` — for the z-control QR Code Generator app

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Check code coverage
npm run test:coverage
```

## 📱 Mobile App Development

This landing page showcases the z-control mobile application. The mobile app is now available on the Google Play Store. For updates and source code, see the [z-control QR Code Generator app in GitHub repository](https://github.com/zoechbauer/z-control-qr-code-generator).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Hans Zöchbauer**

- Email: hans.zoechbauer@gmail.com
- GitHub: [zoechbauer](https://github.com/zoechbauer)

## 🙏 Acknowledgments

- Built with [Ionic Framework](https://ionicframework.com/)
- Icons by [Ionicons](https://ionic.io/ionicons)
- Hosted on [Firebase](https://firebase.google.com/)
- Hosted on [Google Play](https://play.google.com/)

## 📊 Project Status

- 🔄 Landing Page: working on unit-tests
- ✅ Firebase Hosting Landing page: Complete
- ✅ Firebase Hosting z-control QR Code Generator: Complete
- ✅ Google Play z-control QR Code Generator: Complete

---

**Built with ❤️ using Ionic and Angular**