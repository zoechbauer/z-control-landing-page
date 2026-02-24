import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import {
  getAnalytics,
  logEvent as firebaseLogEvent,
  setAnalyticsCollectionEnabled,
  Analytics,
} from 'firebase/analytics';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FirebaseAnalyticsService {
  private app: FirebaseApp | null = null;
  private analytics: Analytics | null = null;
  private enabled = false;
  private readonly enabledSub = new BehaviorSubject<boolean>(this.enabled);
  public enabled$ = this.enabledSub.asObservable();

  init(): void {
    if (globalThis.window === undefined) return;
    try {
      this.app = initializeApp(environment.firebase);
      if (environment.firebase?.measurementId) {
        this.analytics = getAnalytics(this.app);
        // disable collection by default until user consents
        try {
          setAnalyticsCollectionEnabled(this.analytics, false);
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

  logEvent(name: string, params?: { [key: string]: any }) {
    // Disable logging from localhost by default during development.
    // Set to true in .env.local for testing new events from localhost.
    const doLoggingInDevMode = environment.logAnalyticsInDevMode;
    if (globalThis.window !== undefined && !doLoggingInDevMode) {
      const host = globalThis.window.location.hostname;
      if (host === 'localhost' || host === '127.0.0.1' || host === '::1') {
        return; // skip analytics on local dev hosts
      }
    }

    if (!this.analytics || !this.enabled) return; // do not send if collection disabled
    try {
      firebaseLogEvent(this.analytics, name, params);
    } catch (e) {
      console.warn('Analytics logEvent failed', e);
    }
  }

  enableCollection(allow: boolean) {
    if (!this.analytics) {
      this.enabled = false;
      this.enabledSub.next(this.enabled);
      return;
    }
    try {
      setAnalyticsCollectionEnabled(this.analytics, allow);
      this.enabled = allow;
      this.enabledSub.next(this.enabled);
    } catch (e) {
      console.warn('setAnalyticsCollectionEnabled failed', e);
    }
  }
}
