import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  setAnalyticsConsent(allow: boolean) {
    localStorage.setItem('analytics_consent', allow.toString());
  }

  getAnalyticsConsent(): boolean | null {
    const consent = localStorage.getItem('analytics_consent');
    if (consent === null) {
      return null;
    }
    return consent === 'true';
  }
}
