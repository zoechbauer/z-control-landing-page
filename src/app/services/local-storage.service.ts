import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private readonly KEY_ANALYTICS_CONSENT = "analytics-consent";

  constructor() { }

  setAnalyticsConsent(consent: boolean): void {
    localStorage.setItem(this.KEY_ANALYTICS_CONSENT, JSON.stringify(consent));
  }

  getAnalyticsConsent(): boolean | null {
    const consent = localStorage.getItem(this.KEY_ANALYTICS_CONSENT);
    if (consent === null) {
      return null;
    }
    return consent === 'true';
  }
}
