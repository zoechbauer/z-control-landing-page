import { Injectable, InjectionToken, inject } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  Analytics,
  getAnalytics,
  logEvent,
  setAnalyticsCollectionEnabled,
} from 'firebase/analytics';
import { environment } from '../../environments/environment';

export const FIREBASE_APP_INIT = new InjectionToken('FIREBASE_APP_INIT', {
  factory: () => initializeApp,
});

export const FIREBASE_GET_ANALYTICS = new InjectionToken('FIREBASE_GET_ANALYTICS', {
  factory: () => getAnalytics,
});

export const FIREBASE_SET_COLLECTION_ENABLED = new InjectionToken(
  'FIREBASE_SET_COLLECTION_ENABLED',
  { factory: () => setAnalyticsCollectionEnabled },
);

export const FIREBASE_LOG_EVENT = new InjectionToken('FIREBASE_LOG_EVENT', {
  factory: () => logEvent,
});

@Injectable({ providedIn: 'root' })
export class FirebaseAnalyticsAdapterService {
  private readonly initializeAppFn = inject(FIREBASE_APP_INIT);
  private readonly getAnalyticsFn = inject(FIREBASE_GET_ANALYTICS);
  private readonly setCollectionEnabledFn = inject(FIREBASE_SET_COLLECTION_ENABLED);
  private readonly logEventFn = inject(FIREBASE_LOG_EVENT);

  initialize(): Analytics {
    const app = this.initializeAppFn(environment.firebase);
    return this.getAnalyticsFn(app);
  }

  setCollectionEnabled(analytics: Analytics, enabled: boolean): void {
    this.setCollectionEnabledFn(analytics, enabled);
  }

  logEvent(analytics: Analytics, name: string, params?: { [key: string]: any }): void {
    this.logEventFn(analytics, name, params);
  }
}