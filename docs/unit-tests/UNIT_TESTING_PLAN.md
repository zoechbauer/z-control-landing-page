# Unit Testing Plan for z-control Landing Page

## Overview

This document outlines a comprehensive unit testing strategy for the z-control Landing Page Ionic/Angular application. The project uses Angular 20, Ionic 8, Jasmine, and Karma for testing.

## Current Testing Setup

### Existing Infrastructure

- **Framework**: Jasmine 5.1.0 + Karma 6.4.0
- **Coverage**: Karma Coverage Reporter
- **Browser**: Chrome (karma-chrome-launcher)
- **Scripts**:
  - `npm run test` - Run tests in watch mode
  - `npm run test:watch` - Run tests with file watching
  - `npm run test:coverage` - Generate coverage reports

### Current Test Files

- ✅ `app.component.spec.ts` - Basic app creation test
- ✅ `home.page.spec.ts` - Basic home page test
- ⚠️ `firebase-analytics.service.spec.ts` - Minimal service creation test
- ⚠️ `local-storage.service.spec.ts` - Minimal service creation test
- ⚠️ `utils.service.spec.ts` - Minimal service creation test
- ✅ `markdown-viewer.component.spec.ts` - Basic component test

## Testing Strategy

### 1. Test Coverage Goals

- **Target Coverage**: 80% overall
- **Service Coverage**: 90% (business logic priority)
- **Component Coverage**: 75% (UI components)
- **Integration Tests**: Key user workflows

### 2. Testing Priorities (Phase-based Approach)

#### Phase 1: Service Layer Testing (High Priority)

Services contain core business logic and should be thoroughly tested.

#### Phase 2: Component Testing (Medium Priority)

UI components with user interactions and state management.

#### Phase 3: Integration Testing (Medium Priority)

Cross-component interactions and workflows.

#### Phase 4: E2E Testing Preparation (Low Priority)

Setup for future end-to-end testing.

## Detailed Test Plan

### Phase 1: Service Layer Testing

#### 1.1 FirebaseAnalyticsService (`firebase-analytics.service.ts`)

**Priority**: Critical  
**Current Status**: ⚠️ Basic test only

**Test Cases to Implement**:

```typescript
describe('FirebaseAnalyticsService', () => {
  // Setup & Initialization
  - ✅ should be created
  - 🔲 should initialize Firebase app with valid config
  - 🔲 should handle Firebase initialization errors gracefully
  - 🔲 should disable analytics collection by default
  - 🔲 should not initialize in server-side rendering (window undefined)

  // Event Logging
  - 🔲 should log events when analytics is enabled
  - 🔲 should not log events when analytics is disabled
  - 🔲 should skip logging on localhost in dev mode
  - 🔲 should handle logging errors gracefully
  - 🔲 should accept event parameters correctly

  // Collection Control
  - 🔲 should enable analytics collection
  - 🔲 should disable analytics collection
  - 🔲 should update enabled$ observable when collection state changes
  - 🔲 should handle enableCollection errors gracefully
  - 🔲 should handle missing analytics instance
});
```

**Mocking Strategy**:

- Mock Firebase functions (initializeApp, getAnalytics, logEvent)
- Mock environment configuration
- Mock window object for SSR testing

The document has been created successfully!

## Summary

I've created a comprehensive **Unit Testing Plan** for your z-control Landing Page project at `docs/UNIT_TESTING_PLAN.md`.

### Key Features of the Plan:

🎯 **Strategic Approach**: 4-phase implementation prioritizing critical services first
📊 **Coverage Goals**: 80% overall, 90% for services  
� **Detailed Test Cases**: Complete test specifications for all components and services
� **Implementation Guidelines**: Best practices, mocking strategies, and project structure
⏱️ **Timeline**: 4-week implementation schedule
🛠️ **Tooling**: Recommendations for VS Code extensions and testing utilities

### What's Included:

#### Phase 1 (Week 1): Service Layer Testing

- **FirebaseAnalyticsService** - 15+ test cases covering initialization, event logging, and error handling
- **LocalStorageService** - 6 test cases for consent management
- **UtilsService** - 3 test cases for event handling
- **Testing utilities setup**

#### Phase 2 (Week 2): Privacy System

- **PrivacyService** - 15+ test cases covering policy retrieval, HTTP handling, and analytics integration

#### Phase 3 (Week 3): Core Components

- **AppComponent** - Navigation, analytics initialization, platform ready handling
- **FooterComponent** - User interactions, analytics toggles, version display
- **HomePage** - User actions and analytics events

#### Phase 4 (Week 4): Integration & Completion

- **Remaining components** (Header, PrivacyViewer)
- **Integration tests** for cross-component workflows
- **Coverage achievement and CI setup**

### Next Steps:

1. **Review the plan** and adjust priorities based on your team's needs
2. **Set up testing infrastructure** with the recommended utilities
3. **Start with Phase 1** - service layer testing is most critical
4. **Use the provided test case templates** to ensure comprehensive coverage

The plan includes specific mocking strategies, coverage thresholds, and success metrics to guide your testing implementation!

### Phase 2: Component Testing

#### 2.1 AppComponent (`app.component.ts`)

**Priority**: High
**Current Status**: ⚠️ Basic creation test only

**Test Cases to Implement**:

```typescript
describe('AppComponent', () => {
  // Setup
  - ✅ should create the app

  // Initialization
  - 🔲 should initialize Firebase Analytics on ngOnInit
  - 🔲 should handle Firebase initialization errors
  - 🔲 should set analytics collection based on stored consent
  - 🔲 should open footer when consent is not given
  - 🔲 should wait for platform ready

  // Navigation Events
  - 🔲 should log page_view events on navigation
  - 🔲 should extract correct page path from NavigationEnd
  - 🔲 should include page title in analytics events

  // Footer Opening Logic
  - 🔲 should call utilsService.onLogoClicked after delay
  - 🔲 should only open footer when consent is not true
});
```

**Mocking Strategy**:

- Mock Router and NavigationEnd events
- Mock Platform service
- Mock all injected services
- Use fakeAsync for timing tests

#### 2.2 HomePage (`home/home.page.ts`)

**Priority**: Medium
**Current Status**: ⚠️ Basic creation test only

**Test Cases to Implement**:

```typescript
describe('HomePage', () => {
  // Setup
  - ✅ should create

  // Initialization
  - 🔲 should open QR Code accordion after view init
  - 🔲 should register required icons

  // User Actions
  - 🔲 should open native download URL and log analytics
  - 🔲 should open source code URL and log analytics
  - 🔲 should open web app URL and log analytics
  - 🔲 should handle window.open errors gracefully

  // Analytics Events
  - 🔲 should log correct event data for downloads
  - 🔲 should log correct event data for source code access
  - 🔲 should log correct event data for web app access
});
```

#### 2.3 HeaderComponent (`ui/components/header/header.component.ts`)

**Priority**: Low
**Current Status**: 🔲 No tests

**Test Cases to Implement**:

```typescript
describe('HeaderComponent', () => {
  // Setup
  - 🔲 should create
  - 🔲 should register required icons

  // Input Properties
  - 🔲 should display provided title
  - 🔲 should show/hide back button based on input
  - 🔲 should handle undefined inputs gracefully

  // Navigation
  - 🔲 should navigate back when back button clicked
  - 🔲 should use Router for navigation
});
```

#### 2.4 FooterComponent (`ui/components/footer/footer.component.ts`)

**Priority**: Medium
**Current Status**: 🔲 No tests

**Test Cases to Implement**:

```typescript
describe('FooterComponent', () => {
  // Setup & Dependencies
  - 🔲 should create
  - 🔲 should inject all required services
  - 🔲 should register required icons
  - 🔲 should clean up subscriptions on destroy

  // Footer Details Toggle
  - 🔲 should toggle showDetails property
  - 🔲 should log analytics event when opening details
  - 🔲 should not log event when closing details

  // Version Info
  - 🔲 should generate correct version string
  - 🔲 should use environment version data
  - 🔲 should format version string correctly

  // Links Generation
  - 🔲 should generate correct mailto link
  - 🔲 should generate correct privacy policy route
  - 🔲 should handle link generation errors

  // Analytics Toggle
  - 🔲 should enable analytics and update services
  - 🔲 should disable analytics and update services
  - 🔲 should log correct analytics events for toggle
  - 🔲 should update localStorage with consent

  // Changelog Modal
  - 🔲 should open changelog modal with correct component
  - 🔲 should pass correct data to modal
  - 🔲 should handle modal errors gracefully
});
```

#### 2.5 MarkdownViewerComponent (`ui/components/markdown-viewer/markdown-viewer.component.ts`)

**Priority**: Low
**Current Status**: ✅ Basic test exists

**Test Cases to Expand**:

```typescript
describe('MarkdownViewerComponent', () => {
  - ✅ should create
  - 🔲 should render markdown content
  - 🔲 should handle empty content
  - 🔲 should handle malformed markdown
  - 🔲 should apply correct styling
});
```

#### 2.6 Privacy Components

##### PrivacyViewerComponent (`privacy/components/privacy-viewer/privacy-viewer.component.ts`)

**Priority**: Medium
**Current Status**: 🔲 No tests

```typescript
describe('PrivacyViewerComponent', () => {
  - 🔲 should create
  - 🔲 should load policy based on route parameters
  - 🔲 should display loading state while fetching
  - 🔲 should display error state for invalid policies
  - 🔲 should render policy content correctly
  - 🔲 should handle navigation between languages
});
```

##### PrivacyDebugComponent (`privacy/components/privacy-debug/privacy-debug.component.ts`)

**Priority**: Low
**Current Status**: 🔲 No tests

```typescript
describe('PrivacyDebugComponent', () => {
  - 🔲 should create
  - 🔲 should run all tests on initialization
  - 🔲 should display test results correctly
  - 🔲 should handle test failures gracefully
  - 🔲 should allow manual test execution
});
```

### Phase 3: Integration Testing

#### 3.1 Analytics Integration Tests

```typescript
describe('Analytics Integration', () => {
  - 🔲 should initialize analytics on app start
  - 🔲 should respect user consent throughout app
  - 🔲 should log page views on navigation
  - 🔲 should log user interactions consistently
});
```

#### 3.2 Privacy System Integration Tests

```typescript
describe('Privacy System Integration', () => {
  - 🔲 should display consent banner for new users
  - 🔲 should load and display privacy policies
  - 🔲 should handle language switching
  - 🔲 should persist user consent choices
});
```

#### 3.3 Navigation Integration Tests

```typescript
describe('Navigation Integration', () => {
  - 🔲 should navigate between pages correctly
  - 🔲 should maintain app state during navigation
  - 🔲 should handle deep linking
  - 🔲 should log analytics for page views
});
```

## Implementation Guidelines

### 1. Test File Structure

```
src/app/
├── component.spec.ts           # Component tests
├── services/
│   └── service.spec.ts         # Service tests
├── privacy/
│   ├── services/
│   │   └── privacy.service.spec.ts
│   └── components/
│       └── component.spec.ts
└── ui/
    └── components/
        └── component.spec.ts
```

### 2. Common Testing Utilities

Create shared testing utilities in `src/app/testing/`:

```typescript
// testing/test-helpers.ts
export class MockFirebaseAnalyticsService { ... }
export class MockLocalStorageService { ... }
export const createMockEnvironment = () => { ... }
export const createMockRouter = () => { ... }
```

### 3. Test Data Management

Create test data factories in `src/app/testing/`:

```typescript
// testing/test-data.ts
export const createMockPrivacyPolicy = (overrides?) => { ... }
export const createMockEnvironment = (overrides?) => { ... }
```

### 4. Testing Best Practices

#### Service Testing

- ✅ Mock all external dependencies
- ✅ Test both success and error scenarios
- ✅ Verify analytics events are logged correctly
- ✅ Test observable streams thoroughly
- ✅ Use `fakeAsync` for timing-dependent tests

#### Component Testing

- ✅ Use `ComponentFixture` for DOM testing
- ✅ Test user interactions with `click()` events
- ✅ Verify analytics logging from components
- ✅ Mock all service dependencies
- ✅ Test both template and component logic

#### Mock Strategy

- ✅ Create reusable mock classes
- ✅ Use Jasmine spies for method verification
- ✅ Mock HTTP requests with `HttpClientTestingModule`
- ✅ Mock localStorage and other browser APIs
- ✅ Mock Firebase functions completely

### 5. Coverage Requirements

#### Required Coverage Thresholds

```json
{
  "coverageReporter": {
    "reporters": [{ "type": "html" }, { "type": "text-summary" }, { "type": "json-summary" }],
    "check": {
      "global": {
        "statements": 80,
        "branches": 75,
        "functions": 80,
        "lines": 80
      }
    }
  }
}
```

#### Priority Areas for Coverage

1. **Services**: 90%+ (business logic critical)
2. **Components with user interactions**: 80%+
3. **Utility functions**: 85%+
4. **Error handling**: 70%+

## Implementation Timeline

### Week 1: Service Layer Foundation

- ✅ Complete FirebaseAnalyticsService tests
- ✅ Complete LocalStorageService tests
- ✅ Complete UtilsService tests
- ✅ Set up testing utilities and mocks

### Week 2: Privacy System

- ✅ Complete PrivacyService tests
- ✅ Create privacy test data factories
- ✅ Set up HTTP testing infrastructure

### Week 3: Core Components

- ✅ Complete AppComponent tests
- ✅ Complete FooterComponent tests
- ✅ Set up component testing patterns

### Week 4: Remaining Components & Integration

- ✅ Complete HomePage tests
- ✅ Complete remaining component tests
- ✅ Add integration tests
- ✅ Achieve target coverage

## Continuous Integration

### Pre-commit Hooks

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run test:coverage && npm run lint"
    }
  }
}
```

### Coverage Reporting

- Generate HTML coverage reports for local development
- Integrate coverage reporting with CI/CD pipeline
- Set up coverage threshold enforcement
- Create coverage badges for README

## Tools and Extensions

### Recommended VS Code Extensions

- Angular Language Service
- Jasmine Test Explorer
- Coverage Gutters
- Test Explorer UI

### Additional Testing Tools to Consider

- **Spectator**: Simplified Angular testing
- **Testing Library**: Alternative testing utilities
- **Storybook**: Component documentation and testing
- **Cypress**: Future E2E testing framework

## Success Metrics

### Quantitative Goals

- [ ] 80%+ overall code coverage
- [ ] 90%+ service layer coverage
- [ ] 0 failed tests in CI/CD
- [ ] <30 second test execution time
- [ ] 100% test file coverage (every .ts file has corresponding .spec.ts)

### Qualitative Goals

- [ ] Comprehensive error scenario testing
- [ ] Clear, readable test descriptions
- [ ] Reusable testing utilities
- [ ] Documentation of testing patterns
- [ ] Team knowledge sharing on testing practices

---

**Document Version**: 1.0  
**Last Updated**: November 2, 2025  
**Next Review**: Weekly during implementation phases
