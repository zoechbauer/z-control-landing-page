# Firebase Analytics Usage in z-control Landing Page

## Overview

This document provides a comprehensive guide to Firebase Analytics implementation and usage across the z-control Landing Page application. It covers setup, integration points, event tracking, and best practices.

## Table of Contents

- [Architecture](#architecture)
- [Service Implementation](#service-implementation)
- [Analytics Events](#analytics-events)
- [Integration Points](#integration-points)
- [Privacy & Consent](#privacy--consent)
- [Development vs Production](#development-vs-production)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

---

## Architecture

### Component Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Application Layer                     │
├─────────────────────────────────────────────────────────┤
│  AppComponent │ HomePage │ FooterComponent │ Others      │
│      ↓             ↓            ↓              ↓         │
│  ┌──────────────────────────────────────────────────┐   │
│  │      FirebaseAnalyticsService (Singleton)        │   │
│  └──────────────────────────────────────────────────┘   │
│                        ↓                                 │
│  ┌──────────────────────────────────────────────────┐   │
│  │          Firebase Analytics SDK                   │   │
│  │  (initializeApp, getAnalytics, logEvent)         │   │
│  └──────────────────────────────────────────────────┘   │
│                        ↓                                 │
│  ┌──────────────────────────────────────────────────┐   │
│  │         Google Analytics (Cloud)                  │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Service Architecture

**FirebaseAnalyticsService** provides a centralized interface for all analytics operations:

- **Singleton Pattern**: Injected at root level, shared across entire app
- **Observable State**: Exposes `enabled$` for reactive analytics state
- **Privacy-First**: Analytics disabled by default, requires user consent
- **Error Resilient**: Gracefully handles Firebase initialization and runtime errors
- **Environment Aware**: Skips logging on localhost during development

---

## Service Implementation

### Location

```
src/app/services/firebase-analytics.service.ts
src/app/services/firebase-analytics.service.spec.ts (37 unit tests)
```

### Core Methods

#### `init(): void`

Initializes Firebase app and analytics instance.

```typescript
// Called in AppComponent.ngOnInit()
this.firebaseAnalyticsService.init();
```

**Behavior**:

- Initializes Firebase app with environment config
- Creates Analytics instance if `measurementId` exists
- Sets collection to disabled by default (GDPR compliance)
- Returns silently on SSR (when `window` is undefined)
- Logs warnings on initialization errors

---

#### `logEvent(name: string, params?: { [key: string]: any }): void`

Logs custom analytics events to Firebase.

```typescript
// Log simple event
this.firebaseAnalyticsService.logEvent("button_clicked");

// Log event with parameters
this.firebaseAnalyticsService.logEvent("download_started", {
  app_name: "QR Code Generator",
  platform: "Android",
  source: "landing_page",
});
```

**Behavior**:

- Skips logging on localhost (unless `doLoggingInDevMode = true`)
- Requires analytics to be initialized and enabled
- Accepts optional parameters for detailed tracking
- Catches and logs errors without crashing app

**Development Mode**:

```typescript
// In service code:
const doLoggingInDevMode = false; // Set to true for local testing
```

---

#### `enableCollection(allow: boolean): void`

Controls whether analytics data collection is enabled.

```typescript
// Enable analytics (user gave consent)
this.firebaseAnalyticsService.enableCollection(true);

// Disable analytics (user withdrew consent)
this.firebaseAnalyticsService.enableCollection(false);
```

**Behavior**:

- Updates Firebase Analytics collection state
- Emits new state via `enabled$` observable
- Persists user choice (via LocalStorageService integration)
- Returns early if analytics not initialized

---

#### `enabled$: Observable<boolean>`

Observable stream of analytics enabled state.

```typescript
// Subscribe to analytics state changes
this.firebaseAnalyticsService.enabled$.subscribe((enabled) => {
  console.log("Analytics enabled:", enabled);
  this.analyticsEnabled = enabled;
});
```

**Use Cases**:

- Update UI to reflect analytics state
- Show/hide analytics-dependent features
- Sync state across components
- Reactive programming patterns

---

## Analytics Events

### Event Naming Convention

We follow Google Analytics 4 naming conventions:

- **Lowercase with underscores**: `button_clicked`, `page_view`, `download_started`
- **Descriptive and specific**: `privacy_policy_opened` not `link_clicked`
- **Action-based**: `qr_code_generated` not `qr_code`

### Standard Events

Events automatically logged by the application:

#### 1. **Page Views** (`page_view`)

Logged automatically on every route navigation.

**Location**: `app.component.ts`

```typescript
this.router.events.subscribe((event) => {
  if (event instanceof NavigationEnd) {
    this.firebaseAnalyticsService.logEvent("page_view", {
      page_path: event.urlAfterRedirects,
      page_title: this.getPageTitle(event.urlAfterRedirects),
    });
  }
});
```

**Parameters**:

- `page_path`: Route URL (e.g., `/privacy/basic/en`)
- `page_title`: Human-readable page title

---

#### 2. **Footer Interactions** (`footer_details_opened`)

Logged when user expands footer details.

**Location**: `footer.component.ts`

```typescript
onShowDetails(): void {
  this.showDetails = !this.showDetails;
  if (this.showDetails) {
    this.firebaseAnalyticsService.logEvent('footer_details_opened');
  }
}
```

---

#### 3. **Analytics Consent** (`analytics_enabled`, `analytics_disabled`)

Logged when user changes analytics consent.

**Location**: `footer.component.ts`

```typescript
onAnalyticsToggled(isEnabled: boolean): void {
  this.firebaseAnalyticsService.enableCollection(isEnabled);
  this.firebaseAnalyticsService.logEvent(
    isEnabled ? 'analytics_enabled' : 'analytics_disabled',
    { source: 'footer_toggle' }
  );
}
```

**Parameters**:

- `source`: Where consent was changed (e.g., `footer_toggle`, `consent_banner`)

---

### Application-Specific Events

Events specific to our landing page functionality:

#### 4. **App Downloads** (`download_native`)

Logged when user clicks native app download link.

**Location**: `home.page.ts`

```typescript
onDownloadNative() {
  globalThis.window.open(this.nativeDownloadUrl, '_blank');
  this.fa.logEvent('download_native', {
    platform: 'android',
    url: this.nativeDownloadUrl,
    app: this.landingPageApp  // 'Landing Page'
  });
}
```

**Parameters**:

- `platform`: Target platform (android)
- `url`: Google Play Store URL
- `app`: Source application ('Landing Page')

---

#### 5. **Source Code Access** (`get_source_code`)

Logged when user opens GitHub repository.

**Location**: `home.page.ts`

```typescript
onGetSourceCode() {
  globalThis.window.open(this.sourceCodeUrl, '_blank');
  this.fa.logEvent('get_source_code', {
    repo: 'z-control-qr-code-generator',
    app: this.landingPageApp
  });
}
```

**Parameters**:

- `repo`: GitHub repository name
- `app`: Source application ('Landing Page')

---

#### 6. **Web App Access** (`open_web_app`)

Logged when user opens the web application.

**Location**: `home.page.ts`

```typescript
onOpenWebApp() {
  globalThis.window.open(this.webAppUrl, '_blank');
  this.fa.logEvent('open_web_app', {
    url: this.webAppUrl,
    app: this.landingPageApp
  });
}
```

**Parameters**:

- `url`: Web app URL (Firebase Hosting)
- `app`: Source application ('Landing Page')

---

#### 7. **Accordion Changes** (`accordion_change`)

Logged when user expands/collapses accordions on home page.

**Location**: `home.page.ts`

```typescript
accordionGroupChange(event: CustomEvent) {
  const value: string = event.detail.value;
  this.fa.logEvent('accordion_change', {
    accordion_value: value,
    app: this.landingPageApp
  });
  // ...existing accordion logic...
}
```

**Parameters**:

- `accordion_value`: Which accordion was toggled (e.g., 'group 1', 'group 2')
- `app`: Source application ('Landing Page')

---

#### 8. **Changelog Views** (`open_changelog`)

Logged when user opens app changelog modal.

**Location**: `home.page.ts`

```typescript
async openChangelog() {
  this.fa.logEvent('open_changelog', {
    changelog_for: this.selectedAccordion,
    app: this.landingPageApp
  });

  const modal = await this.modalController.create({
    component: MarkdownViewerComponent,
    componentProps: {
      fullChangeLogPath: this.getFullChangeLogPath()
    },
    cssClass: 'change-log-modal'
  });

  await modal.present();
}
```

**Parameters**:

- `changelog_for`: Which app's changelog (e.g., 'z-control QR Code Generator App')
- `app`: Source application ('Landing Page')

---

## Integration Points

### 1. Application Initialization

**File**: `src/app/app.component.ts`

**Purpose**: Initialize Firebase Analytics on app startup and set up page view tracking.

```typescript
export class AppComponent implements OnInit {
  constructor(private router: Router, private platform: Platform, private firebaseAnalyticsService: FirebaseAnalyticsService, private localStorageService: LocalStorageService, private utilsService: UtilsService) {}

  ngOnInit() {
    this.platform.ready().then(() => {
      // Initialize Firebase Analytics
      this.firebaseAnalyticsService.init();

      // Set analytics based on stored user consent
      const consent = this.localStorageService.getAnalyticsConsent();
      this.firebaseAnalyticsService.enableCollection(consent === true);

      // Set up automatic page view tracking
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.firebaseAnalyticsService.logEvent("page_view", {
            page_path: event.urlAfterRedirects,
            page_title: this.getPageTitle(event.urlAfterRedirects),
          });
        }
      });
    });
  }
}
```

**Key Points**:

- ✅ Initialize after platform is ready
- ✅ Respect stored user consent
- ✅ Automatic page view tracking on navigation
- ✅ Extract page titles for better analytics

---

### 2. User Consent Management

**File**: `src/app/ui/components/footer/footer.component.ts`

**Purpose**: Allow users to control analytics consent and persist their choice.

```typescript
export class FooterComponent {
  analyticsEnabled = false;

  constructor(private firebaseAnalyticsService: FirebaseAnalyticsService, private localStorageService: LocalStorageService) {
    // Subscribe to analytics state
    this.firebaseAnalyticsService.enabled$.subscribe((enabled) => {
      this.analyticsEnabled = enabled;
    });
  }

  onAnalyticsToggled(isEnabled: boolean): void {
    // Update Firebase Analytics
    this.firebaseAnalyticsService.enableCollection(isEnabled);

    // Persist user choice
    this.localStorageService.setAnalyticsConsent(isEnabled);

    // Log the consent change
    this.firebaseAnalyticsService.logEvent(isEnabled ? "analytics_enabled" : "analytics_disabled", { source: "footer_toggle" });
  }
}
```

**Key Points**:

- ✅ Two-way binding with analytics state
- ✅ Persist consent in localStorage
- ✅ Log consent changes for analytics
- ✅ GDPR compliant (disabled by default)

---

### 3. User Action Tracking

**File**: `src/app/home/home.page.ts`

**Purpose**: Track user interactions with app features and external links.

```typescript
export class HomePage implements AfterViewInit {
  private readonly landingPageApp = "Landing Page";

  nativeDownloadUrl = "https://play.google.com/store/apps/details?id=at.zcontrol.zoe.qrcodeapp";
  sourceCodeUrl = "https://github.com/zoechbauer/z-control-qr-code-generator";
  webAppUrl = "https://z-control-qr-code.web.app";

  constructor(private readonly modalController: ModalController, private readonly fa: FirebaseAnalyticsService, private readonly localStorageService: LocalStorageService) {}

  onDownloadNative() {
    globalThis.window.open(this.nativeDownloadUrl, "_blank");
    this.fa.logEvent("download_native", {
      platform: "android",
      url: this.nativeDownloadUrl,
      app: this.landingPageApp,
    });
  }

  onGetSourceCode() {
    globalThis.window.open(this.sourceCodeUrl, "_blank");
    this.fa.logEvent("get_source_code", {
      repo: "z-control-qr-code-generator",
      app: this.landingPageApp,
    });
  }

  onOpenWebApp() {
    globalThis.window.open(this.webAppUrl, "_blank");
    this.fa.logEvent("open_web_app", {
      url: this.webAppUrl,
      app: this.landingPageApp,
    });
  }

  accordionGroupChange(event: CustomEvent) {
    const value: string = event.detail.value;
    this.fa.logEvent("accordion_change", {
      accordion_value: value,
      app: this.landingPageApp,
    });
    // ...accordion handling logic...
  }

  async openChangelog() {
    this.fa.logEvent("open_changelog", {
      changelog_for: this.selectedAccordion,
      app: this.landingPageApp,
    });
    // ...modal creation...
  }
}
```

**Key Points**:

- ✅ Service injected as `fa` (shorthand for FirebaseAnalyticsService)
- ✅ All URLs defined as component properties, not environment variables
- ✅ Uses `globalThis.window.open()` instead of `window.open()`
- ✅ Consistent `app` parameter identifying source as 'Landing Page'
- ✅ Event names match actual implementation: `download_native`, `get_source_code`, `open_web_app`
- ✅ Additional events: `accordion_change`, `open_changelog`

---

## Privacy & Consent

### GDPR Compliance

Our implementation follows GDPR requirements:

#### 1. **Disabled by Default**

```typescript
// In FirebaseAnalyticsService.init()
setAnalyticsCollectionEnabled(this.analytics, false);
this.enabled = false;
```

Analytics is **disabled by default** until user explicitly consents.

---

#### 2. **Explicit Consent Required**

```typescript
// User must actively enable analytics
onAnalyticsToggled(isEnabled: boolean): void {
  this.firebaseAnalyticsService.enableCollection(isEnabled);
  this.localStorageService.setAnalyticsConsent(isEnabled);
}
```

No analytics data is collected without user consent.

---

#### 3. **Consent Persistence**

```typescript
// Stored in localStorage
export class LocalStorageService {
  private readonly KEY_ANALYTICS_CONSENT = "analytics-consent";

  setAnalyticsConsent(consent: boolean): void {
    localStorage.setItem(this.KEY_ANALYTICS_CONSENT, JSON.stringify(consent));
  }

  getAnalyticsConsent(): boolean | null {
    const value = localStorage.getItem(this.KEY_ANALYTICS_CONSENT);
    return value ? JSON.parse(value) : null;
  }
}
```

User consent is remembered across sessions.

---

#### 4. **Right to Withdraw**

Users can disable analytics at any time via footer toggle:

```html
<!-- footer.component.html -->
<ion-toggle [(ngModel)]="analyticsEnabled" (ionChange)="onAnalyticsToggled($event.detail.checked)"> Enable Analytics </ion-toggle>
```

---

### Privacy Policy Integration

Privacy policies explain analytics usage:

**Location**: `src/assets/privacy/policies/`

- `landing-page/landing-page-en.html` - English privacy policy
- `landing-page/landing-page-de.html` - German privacy policy

**Sections covering analytics**:

1. Data Collection - What data is collected
2. Purpose - Why we collect data
3. Third Parties - Firebase/Google Analytics usage
4. User Rights - How to disable analytics
5. Data Retention - How long data is kept

---

## Development vs Production

### Development Mode (localhost)

By default, analytics is **disabled on localhost**:

```typescript
// In logEvent method
const doLoggingInDevMode = false;

if (globalThis.window !== undefined && !doLoggingInDevMode) {
  const host = globalThis.window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1" || host === "::1") {
    return; // Skip analytics on local dev hosts
  }
}
```

**Why?**

- ❌ Prevents test data from polluting production analytics
- ❌ Avoids inflating user metrics during development
- ❌ Protects developer privacy during testing

**To enable for testing**:

```typescript
// Temporarily set to true in service
const doLoggingInDevMode = true;
```

---

### Production Mode

On production domains (z-control-4070.web.app), analytics works normally:

```typescript
// Analytics active when:
// 1. Not on localhost
// 2. Analytics initialized successfully
// 3. User has given consent (enableCollection(true))
```

**Production Flow**:

1. User visits site → Analytics disabled by default
2. User consents via footer toggle → `enableCollection(true)` called
3. Analytics begins collecting data
4. All events logged with full parameters
5. Data sent to Google Analytics

---

### Environment Configuration

**File**: `src/environments/environment.ts` (generated)

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "__FIREBASE_API_KEY__",
    authDomain: "__FIREBASE_AUTH_DOMAIN__",
    projectId: "__FIREBASE_PROJECT_ID__",
    storageBucket: "__FIREBASE_STORAGE_BUCKET__",
    messagingSenderId: "__FIREBASE_MESSAGING_SENDER_ID__",
    appId: "__FIREBASE_APP_ID__",
    measurementId: "__FIREBASE_MEASUREMENT_ID__", // Required for Analytics
  },
};
```

**Important**:

- Real values stored in `.env.local` (not committed)
- Generated files created via `npm run generate-env`
- See `docs/FIREBASE_CONFIG_ENVIRONMENT_FILES.md` for details

---

## Testing

### Unit Tests

**File**: `src/app/services/firebase-analytics.service.spec.ts`

**Coverage**: 76.31% statements (maximum achievable in Karma)

**Test Categories** (37 tests total):

1. ✅ Setup & Initialization (5 tests)
2. ✅ Service Behavior (8 tests)
3. ✅ enableCollection Edge Cases (2 tests)
4. ✅ logEvent Parameter Handling (2 tests)
5. ✅ Observable Behavior (2 tests)
6. ✅ Performance and Cleanup (2 tests)
7. ✅ Firebase Initialization Scenarios (2 tests)
8. ✅ Code Branch Coverage (5 tests)
9. ✅ Coverage Analysis (11 tests)

**Run Tests**:

```bash
# Run all tests
npm run test

# Run with coverage
npm run test:coverage

# Open coverage report
# coverage/index.html
```

**See Also**: `docs/unit-tests/FIREBASE_ANALYTICS_SERVICE_TESTS.md`

---

### Manual Testing

#### Test Analytics in Development

1. **Enable localhost logging**:

   ```typescript
   // In firebase-analytics.service.ts
   const doLoggingInDevMode = true; // Change to true
   ```

2. **Run app**:

   ```bash
   ionic serve
   ```

3. **Open DevTools Console**:

   - Enable analytics in footer
   - Perform actions (navigate, click links, etc.)
   - Watch for Firebase Analytics events in Network tab

4. **Verify in Firebase Console**:
   - Go to Firebase Console → Analytics → Events
   - Check DebugView for real-time events
   - Events may take 24-48 hours to appear in reports

---

#### Test User Consent Flow

1. **Clear localStorage** (simulate new user):

   ```javascript
   // In browser console
   localStorage.clear();
   ```

2. **Reload page**:

   - Analytics should be disabled
   - Check `enabled$` observable emits `false`

3. **Enable analytics via footer toggle**:

   - Toggle should update state
   - `analytics_enabled` event should be logged
   - localStorage should persist choice

4. **Reload page again**:
   - Analytics should remain enabled (consent remembered)
   - Page view events should be logged

---

## Troubleshooting

### Common Issues

#### 1. **Events not appearing in Firebase Console**

**Problem**: You've enabled analytics but don't see events in Firebase Console.

**Solutions**:

- ✅ **Check DebugView**: Events appear immediately in DebugView (Analytics → DebugView)
- ✅ **Wait 24-48 hours**: Standard reports have a delay
- ✅ **Verify localhost**: Make sure you're not on localhost (unless `doLoggingInDevMode = true`)
- ✅ **Check consent**: Ensure analytics is enabled via footer toggle
- ✅ **Verify measurementId**: Check that `environment.firebase.measurementId` exists

---

#### 2. **Analytics not initializing**

**Problem**: Service doesn't initialize, console shows errors.

**Solutions**:

- ✅ **Check environment file**: Run `npm run generate-env` to create environment files
- ✅ **Verify Firebase config**: Ensure `.env.local` has valid Firebase configuration
- ✅ **Check console errors**: Look for Firebase initialization errors
- ✅ **Verify measurementId**: Analytics requires valid GA4 measurement ID

**Debug**:

```typescript
// Add console logging to init method
console.log("Firebase config:", environment.firebase);
console.log("Analytics initialized:", this.analytics);
```

---

#### 3. **Localhost events being logged (or not logged)**

**Problem**: Unexpected behavior on localhost.

**Solutions**:

- ✅ **Check doLoggingInDevMode flag**:
  ```typescript
  const doLoggingInDevMode = false; // Should be false for normal dev
  ```
- ✅ **Verify hostname detection**:
  ```typescript
  console.log("Current hostname:", window.location.hostname);
  ```
- ✅ **Test on production domain**: Deploy to Firebase Hosting to test real behavior

---

#### 4. **TypeScript errors with Firebase imports**

**Problem**: Import errors or type issues with Firebase SDK.

**Solutions**:

- ✅ **Update Firebase SDK**: `npm install firebase@latest`
- ✅ **Check tsconfig.json**: Ensure proper module resolution
- ✅ **Restart TS server**: VS Code → Ctrl+Shift+P → "Restart TS Server"

---

#### 5. **Analytics enabled but no events logged**

**Problem**: Analytics state is `true` but events aren't being logged.

**Debug checklist**:

```typescript
// Add to logEvent method for debugging
console.log("Analytics:", this.analytics);
console.log("Enabled:", this.enabled);
console.log("Hostname:", window.location.hostname);
console.log("Event name:", name);
console.log("Event params:", params);
```

**Common causes**:

- Analytics initialized but collection not enabled
- Localhost check preventing logging
- Firebase SDK error (check console)
- Network blocking Firebase requests (ad blockers, privacy extensions)

---

## Best Practices

### Event Naming

✅ **Do**:

- Use lowercase with underscores: `page_view`, `button_clicked`
- Be specific: `download_started` not `click`
- Use action words: `form_submitted` not `form`
- Stay consistent across app

❌ **Don't**:

- Use camelCase or PascalCase
- Use generic names like `action` or `event`
- Use special characters except underscore
- Mix naming conventions

---

### Event Parameters

✅ **Do**:

- Provide meaningful context
- Use consistent parameter names
- Include source/origin information
- Keep parameter names descriptive

```typescript
// Good
this.firebaseAnalyticsService.logEvent("download_started", {
  app_name: "QR Code Generator",
  platform: "Android",
  source: "homepage_button",
  user_journey_step: "initial_discovery",
});
```

❌ **Don't**:

- Include PII (personally identifiable information)
- Send sensitive data
- Use inconsistent parameter names
- Exceed parameter limits (25 per event)

```typescript
// Bad
this.firebaseAnalyticsService.logEvent("download", {
  n: "QR", // Unclear abbreviation
  email: user.email, // PII!
  password: user.pass, // Sensitive data!
});
```

---

### Privacy

✅ **Do**:

- Disable analytics by default
- Respect user consent
- Document what data is collected
- Provide easy opt-out
- Log consent changes

❌ **Don't**:

- Enable analytics without consent
- Collect PII in events
- Hide analytics toggle
- Ignore consent state
- Force analytics on users

---

### Performance

✅ **Do**:

- Initialize after platform ready
- Use singleton service
- Catch and log errors
- Avoid excessive event logging

❌ **Don't**:

- Initialize before DOM ready
- Create multiple analytics instances
- Let errors crash app
- Log events on every mouse move

---

## Analytics Dashboard

### Accessing Analytics

1. **Go to Firebase Console**: [https://console.firebase.google.com](https://console.firebase.google.com)
2. **Select project**: z-control-4070
3. **Navigate to Analytics**:
   - Dashboard: Overview and key metrics
   - Events: All logged events
   - Conversions: Configured conversion events
   - DebugView: Real-time event debugging
   - Reports: Detailed analytics reports

---

### Key Metrics to Monitor

**Engagement**:

- `page_view` - Which pages get most traffic
- `footer_details_opened` - User exploration behavior
- `accordion_change` - Which app sections users explore
- Session duration

**Feature Usage**:

- `download_native` - Google Play Store clicks (conversion metric)
- `get_source_code` - GitHub repository visits
- `open_web_app` - Web app launches
- `open_changelog` - Changelog views

**Privacy Compliance**:

- `analytics_enabled` vs `analytics_disabled` - Consent rate
- Time to consent decision
- Consent persistence rate

**User Journey**:

- Entry pages (first `page_view`)
- Accordion interaction patterns (`accordion_change` sequences)
- Navigation patterns (sequence of `page_view` events)
- Exit points (last event before session end)

---

## Future Enhancements

### Planned Features

1. **Enhanced Error Tracking**:

   ```typescript
   logError(error: Error, context?: string): void {
     this.logEvent('error_occurred', {
       error_message: error.message,
       error_stack: error.stack,
       context: context
     });
   }
   ```

2. **User Properties**:

   ```typescript
   setUserProperty(name: string, value: string): void {
     if (this.analytics) {
       setUserProperties(this.analytics, { [name]: value });
     }
   }
   ```

3. **Custom Dimensions**:

   - App version tracking
   - Device type classification
   - User preferences

4. **Conversion Tracking**:
   - Mark key events as conversions
   - Track funnel completion
   - Measure ROI

---

## Related Documentation

- **[Firebase Security](./FIREBASE_SECURITY.md)** - Security rules and best practices
- **[Firebase Deployment](./FIREBASE_DEPLOYMENT_GUIDE.md)** - Deployment procedures
- **[Unit Testing Plan](./unit-tests/UNIT_TESTING_PLAN.md)** - Comprehensive testing strategy
- **[Firebase Analytics Service Tests](./unit-tests/FIREBASE_ANALYTICS_SERVICE_TESTS.md)** - Detailed test documentation
- **[Privacy Policy Architecture](./PRIVACY_POLICY_ARCHITECTURE.md)** - Privacy system details

---

## Summary

### Quick Reference

**Initialize Analytics**:

```typescript
this.firebaseAnalyticsService.init();
```

**Enable/Disable Collection**:

```typescript
this.firebaseAnalyticsService.enableCollection(true); // Enable
this.firebaseAnalyticsService.enableCollection(false); // Disable
```

**Log Event**:

```typescript
this.firebaseAnalyticsService.logEvent("event_name", {
  param1: "value1",
  param2: "value2",
});
```

**Subscribe to State**:

```typescript
this.firebaseAnalyticsService.enabled$.subscribe((enabled) => {
  console.log("Analytics enabled:", enabled);
});
```

---

**Document Version**: 1.0  
**Last Updated**: November 3, 2025  
**Maintained By**: Hans Zöchbauer  
**Next Review**: Quarterly or when Firebase SDK updates
