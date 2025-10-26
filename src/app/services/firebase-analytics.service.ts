import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import {
  getAnalytics,
  logEvent as firebaseLogEvent,
  setAnalyticsCollectionEnabled,
  Analytics,
} from 'firebase/analytics';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FirebaseAnalyticsService {
  private app: FirebaseApp | null = null;
  private analytics: Analytics | null = null;
  public enabled = false;

  init(): void {
    if (typeof window === 'undefined') return;
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
      }
    } catch (err) {
      console.warn('Firebase init error', err);
    }
  }

  logEvent(name: string, params?: { [key: string]: any }) {
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
      return;
    }
    try {
      setAnalyticsCollectionEnabled(this.analytics, allow);
      this.enabled = allow;
    } catch (e) {
      console.warn('setAnalyticsCollectionEnabled failed', e);
    }
  }
}
