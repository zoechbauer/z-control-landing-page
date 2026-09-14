import { Injectable, inject } from '@angular/core';
import { Analytics } from 'firebase/analytics';
import { BehaviorSubject } from 'rxjs';

import { environment } from '@env/environment';
import { FirebaseAnalyticsAdapterService } from './firebase-analytics-adapter.service';
import { WindowRefService } from './window-ref.service';

@Injectable({ providedIn: 'root' })
export class FirebaseAnalyticsService {
  private readonly analyticsAdapter = inject(FirebaseAnalyticsAdapterService);
  private readonly windowRef = inject(WindowRefService);

  private analytics: Analytics | null = null;
  private enabled = false;
  private readonly enabledSub = new BehaviorSubject<boolean>(this.enabled);
  public enabled$ = this.enabledSub.asObservable();

  /**
   * Initializes Firebase Analytics.
   * @returns void
   */
  init(): void {
    if (!this.windowRef.isAvailable) return;
    try {
      this.analytics = this.analyticsAdapter.initialize();
      if (environment.firebase?.measurementId) {
        // disable collection by default until user consents
        try {
          this.analyticsAdapter.setCollectionEnabled(this.analytics, false);
        } catch (e) {
          console.warn('setAnalyticsCollectionEnabled failed', e);
        }
        this.enabled = false;
        this.enabledSub.next(this.enabled);
      }
    } catch (err) {
      console.warn('Firebase init error', err);
    }
  }

  /**
   * Logs an event to Firebase Analytics.
   * @param name The name of the event.
   * @param params Optional parameters for the event.
   */
  logEvent(name: string, params?: { [key: string]: any }) {
    // Disable logging from localhost by default during development.
    // Set to true in .env.local for testing new events from localhost.
    
    // do not log if window is not available
    if (!this.windowRef.isAvailable) return;
    // do not log if running on localhost and logging in dev mode is disabled
    const doLoggingInDevMode = environment.logAnalyticsInDevMode;
    const host = this.windowRef.hostname;
    const localhost = host === 'localhost' || host === '127.0.0.1' || host === '::1';
    if (localhost && !doLoggingInDevMode) return;
    // do not log if analytics is not initialized or collection is disabled
    if (!this.analytics || !this.enabled) return; 

    try {
      this.analyticsAdapter.logEvent(this.analytics, name, params);
    } catch (e) {
      console.warn('Analytics logEvent failed', e);
    }
  }

  /**
   * Enables or disables Firebase Analytics collection.
   * @param allow Whether to allow analytics collection.
   * @returns void
   */
  enableCollection(allow: boolean) {
    if (!this.analytics) {
      this.enabled = false;
      this.enabledSub.next(this.enabled);
      return;
    }
    try {
      this.analyticsAdapter.setCollectionEnabled(this.analytics, allow);
      this.enabled = allow;
      this.enabledSub.next(this.enabled);
    } catch (e) {
      console.warn('setAnalyticsCollectionEnabled failed', e);
    }
  }
}
