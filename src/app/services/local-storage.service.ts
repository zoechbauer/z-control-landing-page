import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  // localStorage key for analytics consent preference
  // Note: Uses snake_case for backward compatibility with existing user data
  private readonly ANALYTICS_CONSENT_KEY = 'analytics_consent';

  constructor() {}

  /**
   * Stores the user's analytics consent preference in localStorage
   * @param consent - User's consent decision for analytics
   */
  setAnalyticsConsent(consent: boolean): void {
    try {
      localStorage.setItem(this.ANALYTICS_CONSENT_KEY, JSON.stringify(consent));
    } catch (error) {
      console.error('Failed to save analytics consent to localStorage:', error);
    }
  }

  /**
   * Retrieves the user's analytics consent preference from localStorage
   * @returns boolean if consent was previously set, null if no preference exists
   */
  getAnalyticsConsent(): boolean | null {
    try {
      const consentString = localStorage.getItem(this.ANALYTICS_CONSENT_KEY);
      if (consentString === null) {
        return null;
      }
      return JSON.parse(consentString);
    } catch (error) {
      console.error(
        'Failed to retrieve analytics consent from localStorage:',
        error
      );
      return null;
    }
  }
}
