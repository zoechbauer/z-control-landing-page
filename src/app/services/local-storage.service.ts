import { inject, Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';

enum LocalStorage {
  SelectedLanguage = 'selectedLanguage',
  AnalyticsEnabled = 'analytics_enabled',
}

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private readonly storage = inject(Storage);

  /**
   * Emits the currently selected base language code (e.g. 'en', 'de').
   */
  selectedLanguageSubject = new BehaviorSubject<string>(
    this.getMobileDefaultLanguage(),
  );
  /**
   * Observable for the currently selected base language code.
   */
  selectedLanguage$ = this.selectedLanguageSubject.asObservable();
  /**
   * Emits the name of the currently selected base language (e.g. 'English', 'Deutsch').
   */
  selectedLanguageNameSubject = new BehaviorSubject<string>(
    this.getMobileDefaultLanguage(),
  );

  private async initStorage() {
    await this.storage.create();
  }

  /**
   * Initializes the storage service and loads necessary data.
   * @param translate The TranslateService instance
   */
  async initializeServicesAsync(
    translate: import('@ngx-translate/core').TranslateService,
  ): Promise<void> {
    try {
      await this.initStorage();
      await this.loadSelectedOrDefaultLanguage();
    } catch (error) {
      console.error('App initialization failed:', error);
      await this.initializeWithDefaults(translate);
    }
  }

  /**
   * Fallback: sets default language to 'en' in TranslateService
   */
  private async initializeWithDefaults(
    translate: import('@ngx-translate/core').TranslateService,
  ): Promise<void> {
    try {
      translate.setDefaultLang('en');
      translate.use('en');
    } catch (fallbackError) {
      console.error('Critical: Even defaults failed:', fallbackError);
    }
  }

  /**
   * Loads the selected language from storage, or sets and returns the default language if not found.
   * Updates the selectedLanguageSubject accordingly.
   * @returns The selected or default language code
   */
  async loadSelectedOrDefaultLanguage(): Promise<string> {
    const selectedLanguage = await this.storage.get(
      LocalStorage.SelectedLanguage,
    );

    if (selectedLanguage) {
      this.selectedLanguageSubject.next(selectedLanguage);
      return selectedLanguage;
    } else {
      const lang = this.getMobileDefaultLanguage();
      await this.saveSelectedLanguage(lang);
      this.selectedLanguageSubject.next(lang);
      return lang;
    }
  }

  /**
   * Saves the selected language to storage and updates the observable.
   * @param language The language code to save
   */
  async saveSelectedLanguage(language: string) {
    if (!language) {
      throw new Error('Language must be provided');
    }
    try {
      await this.storage.set(LocalStorage.SelectedLanguage, language);
      this.selectedLanguageSubject.next(language);
    } catch (error) {
      console.error('Error saving selected language:', error);
    }
  }

  /**
   * Determines the default language for the mobile device.
   * @returns The default language code ('de' or 'en')
   */
  private getMobileDefaultLanguage(): string {
    const lang = navigator.language.split('-')[0]; // e.g. "de-DE" -> "de"
    return /(de|en)/gi.test(lang) ? lang : 'en';
  }

  /**
   * Stores the user's analytics consent preference in localStorage
   * @param enabled - User's consent decision for analytics
   */
  async setAnalyticsConsent(enabled: boolean): Promise<void> {
    try {
      await this.storage.set(LocalStorage.AnalyticsEnabled, enabled);
    } catch (error) {
      console.error('Failed to save analytics consent to localStorage:', error);
    }
  }

  /**
   * Retrieves the user's analytics consent preference from localStorage
   * @returns true if analytics is enabled, false otherwise
   */
  async getAnalyticsConsent(): Promise<boolean> {
    try {
      const consent = await this.storage.get(LocalStorage.AnalyticsEnabled);
      return consent !== undefined ? consent : false;
    } catch (error) {
      console.error(
        'Failed to retrieve analytics consent from localStorage:',
        error,
      );
      return false;
    }
  }
}
