import { Injectable } from '@angular/core';
import { Analytics } from 'firebase/analytics';
import { BehaviorSubject } from 'rxjs';

import { environment } from '../../environments/environment';
import { FirebaseAnalyticsAdapterService } from './firebase-analytics-adapter.service';
import { WindowRefService } from './window-ref.service';

@Injectable({ providedIn: 'root' })
export class FirebaseAnalyticsService {
  private analytics: Analytics | null = null;
  private enabled = false;
  private readonly enabledSub = new BehaviorSubject<boolean>(this.enabled);
  public enabled$ = this.enabledSub.asObservable();

  constructor(
    private readonly analyticsAdapter: FirebaseAnalyticsAdapterService,
    private readonly windowRef: WindowRefService
  ) {}

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
    const doLoggingInDevMode = environment.logAnalyticsInDevMode;
    if (!this.windowRef.isAvailable && !doLoggingInDevMode) {
      const host = this.windowRef.hostname;
      if (host === 'localhost' || host === '127.0.0.1' || host === '::1') {
        return; // skip analytics on local dev hosts
      }
    }

    if (!this.analytics || !this.enabled) return; // do not log if collection disabled
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
