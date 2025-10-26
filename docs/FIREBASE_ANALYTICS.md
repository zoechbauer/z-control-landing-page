# Firebase Analytics (GA4) — Usage & Testing

This document explains how to test and use Firebase Analytics in the landing-page app (DebugView, Realtime, configuration, and example events).

## Overview
- Firebase collects anonymous usage events (page views, opened sections, button clicks).
- Use DebugView for immediate, session-level verification. Realtime/standard reports are for aggregated results and may take longer.
- Analytics collection in this app is gated by user consent (localStorage key `analytics_consent`). By default collection is disabled.

---

## DebugView vs Realtime
- DebugView: shows events from sessions you mark as debug (immediate, per-session). Use for development/testing.
- Realtime / Standard reports: aggregated events visible to all users. Realtime updates quickly; standard reports can take hours.

---

## Enable DebugView for testing
Option A — temporary (recommended for quick tests)
- Open DevTools Console in the same tab that runs your app and run:
  ```js
  gtag && gtag('set', 'debug_mode', true);
  gtag && gtag('event', 'test_debug_event', { source: 'console' });
  ```
- Open Firebase Console → Analytics → DebugView and verify the event appears.

Option B — local debug index (example)
- Use your local debug index copy (do NOT commit this file):
  - `src/index_DEBUG_FIREBASE-config.html` (example)
  - Contains:
    ```html
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-DR0BBPK2KW"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-DR0BBPK2KW', { debug_mode: true, send_page_view: false });
    </script>
    ```
- Load the app using that index (local only) and check DebugView.

Notes:
- `send_page_view: false` is set when you want to control `page_view` manually from the app.
- Disable `debug_mode` before publishing.

---

## Configure Firebase Analytics in this app

1. Generate environment files (local only — do not commit)
   ```bash
   # create .env.local with FIREBASE_* values, then:
   npm run generate-env
   ```

2. index.html
   - Keep placeholder `__FIREBASE_MEASUREMENT_ID__` in committed `src/index.html` (or no measurement id).
   - Use CI or local generator to inject the real measurement id into a local copy (index_DEBUG or generated index).

3. Analytics service (example usage)
   - Service initializes Firebase and exposes `logEvent` + `enableCollection`.
   - Important: the service disables collection by default. Call `enableCollection(true)` after user consents.

   Example usage in `AppComponent`:
   ```ts
   // initialize on startup
   this.fa.init();

   // apply stored preference
   const consent = localStorage.getItem('analytics_consent');
   this.fa.enableCollection(consent === 'true');

   // log page views on route change (no-op until collection enabled)
   this.router.events.pipe(filter(e => e instanceof NavigationEnd))
     .subscribe((ev: NavigationEnd) => {
       this.fa.logEvent('page_view', {
         page_path: ev.urlAfterRedirects,
         page_title: document.title
       });
     });
   ```

---

## Example fa.logEvent(...) calls

- Accordion open (already used)
  ```ts
  this.fa.logEvent('accordion_change', {
    accordion_value: value
  });
  ```

- Download native app button
  ```ts
  this.fa.logEvent('download_native', {
    platform: 'android',
    source: 'landing_page'
  });
  ```

- Get source code (open repo)
  ```ts
  this.fa.logEvent('get_source', { repo: 'z-control-qr-code-generator' });
  ```

- Open web app (external link)
  ```ts
  this.fa.logEvent('open_web_app', { url: 'https://z-control-qr-code.web.app' });
  ```

- Open footer / changelog
  ```ts
  this.fa.logEvent('open_footer', { app: 'Landing Page' });
  this.fa.logEvent('open_changelog', { changelog_for: 'Landing Page' });
  ```

Notes:
- You may keep calling `fa.logEvent(...)` everywhere; the service will ignore events when collection is disabled (until the user consents).
- Keep event parameter names short and consistent (snake_case recommended).

---

## Testing checklist
1. Run local generator:
   ```bash
   npm run generate-env
   ```
2. Start dev server:
   ```bash
   ionic serve         # local only
   ionic serve --external  # test from other devices
   ```
3. Enable debug mode (console or debug index).
4. Ensure consent is enabled for testing:
   ```js
   localStorage.setItem('analytics_consent','true'); location.reload();
   ```
   or accept your in-app consent prompt.
5. Trigger actions and verify:
   - Firebase Console → Analytics → DebugView for immediate events.
   - Network tab: look for requests to `https://www.google-analytics.com/g/collect`.

---

## Privacy & production notes
- Do NOT commit real Firebase config into the repo.
- Remove `debug_mode` and set production index without debug flags before deploying.
- Analytics collection must be disabled until the user consents (your service already enforces this).
- Document consent and opt-out instructions in your privacy policy (you already added this).

---

## Troubleshooting
- No events in DebugView:
  - Confirm measurementId equals the project's Web data stream id.
  - Check DevTools Network for `g/collect` requests.
  - Disable ad‑blockers / privacy extensions during testing.
  - Ensure `fa.init()` ran and `enableCollection(true)` was called (or localStorage consent set).
- Build errors related to node types: install `@types/node` as a devDependency if needed.

---

## References
- Firebase Analytics (GA4) DebugView: https://support.google.com/analytics/answer/7201382
- Google privacy policy: https://policies.google.com/privacy
