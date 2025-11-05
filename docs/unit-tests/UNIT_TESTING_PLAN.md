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
- 🔲 `privacy.service.spec.ts` - **MISSING** - Critical service needs complete test coverage
- ✅ `markdown-viewer.component.spec.ts` - Basic component test
- 🔲 `header.component.spec.ts` - **MISSING** - Component test file needed
- 🔲 `footer.component.spec.ts` - **MISSING** - Component test file needed
- 🔲 `privacy-viewer.component.spec.ts` - **MISSING** - Component test file needed
- 🔲 `privacy-debug.component.spec.ts` - **MISSING** - Component test file needed

## Testing Strategy

### 1. Test Coverage Goals

- **Target Coverage**: 80% overall
- **Service Coverage**: 90% (business logic priority)
- **Component Coverage**: 75% (UI components)
- **Integration Tests**: Key user workflows

### 2. Testing Priorities (Phase-based Approach)

#### Phase 1: Complete Service Layer Testing

Services contain core business logic and should be thoroughly tested first.

#### Phase 2: Create Missing Component Tests

Implement test files for components that currently lack any test coverage.

#### Phase 3: Enhance Existing Component Tests

Expand minimal tests to cover full component functionality and user interactions.

#### Phase 4: Integration Testing & Coverage Validation

Cross-component interactions, workflows, and final coverage verification.

## Detailed Test Plan

## Phase 1: Complete Service Layer Testing

### 1.1 FirebaseAnalyticsService (`firebase-analytics.service.ts`)

**Priority**: Critical  
**Current Status**: ⚠️ Basic test only

**Test Cases to Implement**:

```typescript
describe('FirebaseAnalyticsService', () => {
  // Setup & Initialization (5 tests)
  - ✅ should be created
  - 🔲 should initialize Firebase app with valid config
  - 🔲 should handle Firebase initialization errors gracefully
  - 🔲 should disable analytics collection by default
  - 🔲 should not initialize in server-side rendering (window undefined)

  // Event Logging (5 tests)
  - 🔲 should log events when analytics is enabled
  - 🔲 should not log events when analytics is disabled
  - 🔲 should skip logging on localhost in dev mode
  - 🔲 should handle logging errors gracefully
  - 🔲 should accept event parameters correctly

  // Collection Control (5 tests)
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

### 1.2 LocalStorageService (`local-storage.service.ts`)

**Priority**: High  
**Current Status**: ⚠️ Basic test only

**Test Cases to Implement**:

```typescript
describe('LocalStorageService', () => {
  // Setup (1 test)
  - ✅ should be created

  // Consent Management (8 tests)
  - 🔲 should return null for analytics consent when not set
  - 🔲 should store analytics consent as true
  - 🔲 should store analytics consent as false
  - 🔲 should retrieve stored analytics consent correctly
  - 🔲 should handle localStorage unavailable gracefully
  - 🔲 should handle JSON parse errors for corrupted data
  - 🔲 should clear analytics consent when requested
  - 🔲 should handle storage quota exceeded errors
});
```

**Mocking Strategy**:

- Mock localStorage API
- Test browser compatibility scenarios
- Mock storage exceptions

### 1.3 UtilsService (`utils.service.ts`)

**Priority**: Medium  
**Current Status**: ⚠️ Basic test only

**Test Cases to Implement**:

```typescript
describe('UtilsService', () => {
  // Setup (1 test)
  - ✅ should be created

  // Event Handling (5 tests)
  - 🔲 should emit onLogoClicked event
  - 🔲 should allow multiple subscribers to onLogoClicked
  - 🔲 should handle subscription cleanup properly
  - 🔲 should not emit events after service destruction
  - 🔲 should provide observable for logo clicks
});
```

**Mocking Strategy**:

- Test RxJS Subject behavior
- Verify subscription management
- Test event emission patterns

### 1.4 PrivacyService (`privacy/services/privacy.service.ts`) - **NEWLY IDENTIFIED**

**Priority**: Critical  
**Current Status**: 🔲 **MISSING** - No test file exists

**Test Cases to Implement**:

```typescript
describe('PrivacyService', () => {
  // Setup & Dependencies (2 tests)
  - 🔲 should be created
  - 🔲 should inject HttpClient and other dependencies

  // Policy Retrieval (8 tests)
  - 🔲 should fetch privacy policy for valid language
  - 🔲 should return cached policy on subsequent requests
  - 🔲 should handle HTTP errors gracefully
  - 🔲 should fallback to English when language not available
  - 🔲 should validate policy format before returning
  - 🔲 should handle malformed policy JSON
  - 🔲 should timeout requests appropriately
  - 🔲 should emit loading states correctly

  // Cache Management (5 tests)
  - 🔲 should cache policies by language
  - 🔲 should invalidate cache when requested
  - 🔲 should respect cache expiration times
  - 🔲 should handle cache storage limits
  - 🔲 should clear cache on service destruction

  // Analytics Integration (3 tests)
  - 🔲 should log policy access events
  - 🔲 should track policy download completion
  - 🔲 should handle analytics logging failures silently
});
```

**Mocking Strategy**:

- Mock HttpClient with HttpClientTestingModule
- Mock analytics service integration
- Test caching mechanisms
- Mock policy response data

---

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

## Phase 2: Create Missing Component Tests

### 2.1 HeaderComponent (`ui/components/header/header.component.ts`)

**Priority**: Medium  
**Current Status**: 🔲 **MISSING** - No test file exists

**Test Cases to Implement**:

```typescript
describe('HeaderComponent', () => {
  // Setup & Initialization (3 tests)
  - 🔲 should create
  - 🔲 should register required icons
  - 🔲 should inject Router dependency

  // Input Properties (5 tests)
  - 🔲 should display provided title
  - 🔲 should show back button when showBackButton is true
  - 🔲 should hide back button when showBackButton is false
  - 🔲 should handle undefined title gracefully
  - 🔲 should update title when input changes

  // Navigation (3 tests)
  - 🔲 should navigate back when back button clicked
  - 🔲 should use Router.navigate for back navigation
  - 🔲 should handle navigation errors gracefully
});
```

**Mocking Strategy**:

- Mock Router service
- Test input property binding
- Mock icon registration

### 2.2 FooterComponent (`ui/components/footer/footer.component.ts`)

**Priority**: High  
**Current Status**: 🔲 **MISSING** - No test file exists

**Test Cases to Implement**:

```typescript
describe('FooterComponent', () => {
  // Setup & Dependencies (4 tests)
  - 🔲 should create
  - 🔲 should inject all required services
  - 🔲 should register required icons
  - 🔲 should clean up subscriptions on destroy

  // Footer Details Toggle (3 tests)
  - 🔲 should toggle showDetails property
  - 🔲 should log analytics event when opening details
  - 🔲 should not log event when closing details

  // Version Info (3 tests)
  - 🔲 should generate correct version string
  - 🔲 should use environment version data
  - 🔲 should format version string correctly

  // Links Generation (3 tests)
  - 🔲 should generate correct mailto link
  - 🔲 should generate correct privacy policy route
  - 🔲 should handle link generation errors

  // Analytics Toggle (4 tests)
  - 🔲 should enable analytics and update services
  - 🔲 should disable analytics and update services
  - 🔲 should log correct analytics events for toggle
  - 🔲 should update localStorage with consent

  // Changelog Modal (3 tests)
  - 🔲 should open changelog modal with correct component
  - 🔲 should pass correct data to modal
  - 🔲 should handle modal errors gracefully
});
```

**Mocking Strategy**:

- Mock all injected services (Analytics, LocalStorage, Utils, Modal)
- Mock environment configuration
- Test modal interactions

### 2.3 PrivacyViewerComponent (`privacy/components/privacy-viewer/privacy-viewer.component.ts`)

**Priority**: Medium  
**Current Status**: 🔲 **MISSING** - No test file exists

**Test Cases to Implement**:

```typescript
describe('PrivacyViewerComponent', () => {
  // Setup & Dependencies (3 tests)
  - 🔲 should create
  - 🔲 should inject PrivacyService and ActivatedRoute
  - 🔲 should subscribe to route parameters

  // Policy Loading (6 tests)
  - 🔲 should load policy based on route parameters
  - 🔲 should display loading state while fetching
  - 🔲 should display error state for invalid policies
  - 🔲 should handle missing language parameter
  - 🔲 should fallback to default language
  - 🔲 should retry failed policy loads

  // Content Rendering (4 tests)
  - 🔲 should render policy content correctly
  - 🔲 should handle empty policy content
  - 🔲 should apply correct CSS classes
  - 🔲 should sanitize HTML content properly

  // Navigation (2 tests)
  - 🔲 should handle navigation between languages
  - 🔲 should update URL when language changes
});
```

**Mocking Strategy**:

- Mock ActivatedRoute with route parameters
- Mock PrivacyService
- Test loading and error states

### 2.4 PrivacyDebugComponent (`privacy/components/privacy-debug/privacy-debug.component.ts`)

**Priority**: Low  
**Current Status**: 🔲 **MISSING** - No test file exists

**Test Cases to Implement**:

```typescript
describe('PrivacyDebugComponent', () => {
  // Setup (2 tests)
  - 🔲 should create
  - 🔲 should inject required testing services

  // Test Execution (5 tests)
  - 🔲 should run all tests on initialization
  - 🔲 should display test results correctly
  - 🔲 should handle test failures gracefully
  - 🔲 should allow manual test execution
  - 🔲 should track test execution timing

  // Debug Features (3 tests)
  - 🔲 should display service state information
  - 🔲 should show cache status
  - 🔲 should provide test result export functionality
});
```

**Mocking Strategy**:

- Mock all services for testing
- Test debug functionality
- Mock timing operations

---

## Phase 3: Enhance Existing Component Tests

### 3.1 AppComponent (`app.component.ts`)

**Priority**: High  
**Current Status**: ⚠️ Basic creation test only

**Test Cases to Add**:

```typescript
describe('AppComponent', () => {
  - ✅ should create the app

  // Initialization (5 tests)
  - 🔲 should initialize Firebase Analytics on ngOnInit
  - 🔲 should handle Firebase initialization errors
  - 🔲 should set analytics collection based on stored consent
  - 🔲 should open footer when consent is not given
  - 🔲 should wait for platform ready

  // Navigation Events (4 tests)
  - 🔲 should log page_view events on navigation
  - 🔲 should extract correct page path from NavigationEnd
  - 🔲 should include page title in analytics events
  - 🔲 should filter out non-NavigationEnd router events

  // Footer Opening Logic (3 tests)
  - 🔲 should call utilsService.onLogoClicked after delay
  - 🔲 should only open footer when consent is not true
  - 🔲 should handle timing conflicts gracefully
});
```

**Mocking Strategy**:

- Mock Platform service with ready() observable
- Mock Router events
- Mock all injected services
- Use fakeAsync for timing tests

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

### Phase 1: Service Layer Foundation

- ✅ Complete FirebaseAnalyticsService tests (15 test cases)
- ✅ Complete LocalStorageService tests (9 test cases)
- ✅ Complete UtilsService tests (6 test cases)
- ✅ Create PrivacyService tests (18 test cases)
- ✅ Set up testing utilities and mocks

### Phase 2: Missing Component Tests

- ✅ Create HeaderComponent tests (11 test cases)
- ✅ Create FooterComponent tests (20 test cases)
- ✅ Create PrivacyViewerComponent tests (15 test cases)
- ✅ Create PrivacyDebugComponent tests (10 test cases)

### Phase 3: Enhanced Component Tests

- ✅ Enhance AppComponent tests (12 test cases)
- ✅ Enhance HomePage tests (19 test cases)
- ✅ Enhance MarkdownViewerComponent tests (12 test cases)

### Phase 4: Integration & Coverage

- ✅ Analytics Integration tests (5 test cases)
- ✅ Privacy System Integration tests (6 test cases)
- ✅ Navigation Integration tests (5 test cases)
- ✅ Create shared testing utilities (10 utilities)
- ✅ Achieve target coverage validation

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

## Summary

This improved unit testing plan provides:

### ✅ Key Improvements:

1. **Timeline-agnostic phases** - Removed all "Week X" references
2. **Complete service coverage** - Added PrivacyService with 18 comprehensive test cases
3. **Missing component tests** - Identified and planned 4 missing component test files
4. **Enhanced existing tests** - Expanded minimal tests to cover full functionality
5. **Integration testing** - Added cross-component and workflow tests

### 📊 Total Test Coverage:

- **178 total test cases** across all phases
- **48 service test cases** (4 services)
- **99 component test cases** (7 components)
- **16 integration test cases**
- **15 testing utilities and shared mocks**

### 🎯 Implementation Ready:

- Each test case has clear, specific descriptions
- Mocking strategies defined for each component/service
- Shared utilities planned for code reuse
- Coverage thresholds and success metrics defined
- CI/CD integration guidelines provided

The plan ensures comprehensive coverage of the entire Ionic/Angular application with implementable, specific test cases for immediate development start.

---

**Document Version**: 2.0  
**Last Updated**: November 5, 2025  
**Total Test Cases**: 178
