import { TestBed } from '@angular/core/testing';

import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;
  const ANALYTICS_CONSENT_KEY = 'analytics_consent';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocalStorageService],
    });
    service = TestBed.inject(LocalStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('load analytics consent', () => {
    it('should return null if no consent is stored', () => {
      localStorage.removeItem(ANALYTICS_CONSENT_KEY);

      const consent = service.getAnalyticsConsent();
      expect(consent).toBeNull();
    });

    it('should return true if consent is stored as true', () => {
      localStorage.setItem(ANALYTICS_CONSENT_KEY, 'true');

      const consent = service.getAnalyticsConsent();
      expect(consent).toBeTrue();
    });

    it('should return false if consent is stored as false', () => {
      localStorage.setItem(ANALYTICS_CONSENT_KEY, 'false');

      const consent = service.getAnalyticsConsent();
      expect(consent).toBeFalse();
    });

    it('should log an error and return null if localStorage access fails', () => {
      spyOn(localStorage, 'getItem').and.throwError(
        'localStorage access error',
      );
      spyOn(console, 'error');

      const consent = service.getAnalyticsConsent();
      expect(consent).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        'Failed to retrieve analytics consent from localStorage:',
        jasmine.any(Error)
      );
    });
  });

  describe('save analytics consent', () => {
    it('should save true if consent is stored as true', () => {
      localStorage.setItem(ANALYTICS_CONSENT_KEY, 'false');

      const consent = service.setAnalyticsConsent(true);
      expect(service.getAnalyticsConsent()).toBeTrue();
    });

    it('should save false if consent is stored as false', () => {
      localStorage.setItem(ANALYTICS_CONSENT_KEY, 'true');

      const consent = service.setAnalyticsConsent(false);
      expect(service.getAnalyticsConsent()).toBeFalse();
    });

    it('should log an error if localStorage storage fails', () => {
      spyOn(localStorage, 'setItem').and.throwError(
        'localStorage save error',
      );
      spyOn(console, 'error');

      const consent = service.setAnalyticsConsent(true);
      expect(console.error).toHaveBeenCalledWith(
        'Failed to save analytics consent to localStorage:',
        jasmine.any(Error)
      );
    });
  });
});
