import { TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage-angular';

import { LocalStorageService } from './local-storage.service';
import { TranslateService } from '@ngx-translate/core';
import { ModalController } from '@ionic/angular';
import { UtilsService } from './utils.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;
  let storageSpy: jasmine.SpyObj<Storage>;
  let utilsServiceSpy: jasmine.SpyObj<UtilsService>;
  let createTranslateServiceSpy: any;

  beforeEach(() => {
    createTranslateServiceSpy = () =>
      jasmine.createSpyObj('TranslateService', [
        'get',
        'setDefaultLang',
        'use',
      ]);

    const modalControllerSpy = jasmine.createSpyObj('ModalController', [
      'dismiss',
      'create',
    ]);

    storageSpy = jasmine.createSpyObj('Storage', [
      'create',
      'get',
      'set',
      'remove',
      'clear',
      'length',
      'keys',
    ]);
    storageSpy.create.and.returnValue(Promise.resolve(storageSpy));
    storageSpy.get.and.returnValue(Promise.resolve(null));
    storageSpy.set.and.returnValue(Promise.resolve());
    storageSpy.remove.and.returnValue(Promise.resolve());
    storageSpy.clear.and.returnValue(Promise.resolve());
    storageSpy.length.and.returnValue(Promise.resolve(0));
    storageSpy.keys.and.returnValue(Promise.resolve([]));

    utilsServiceSpy = jasmine.createSpyObj('UtilsService', ['getCurrentMonth']);

    TestBed.configureTestingModule({
      providers: [
        LocalStorageService,
        { provide: Storage, useValue: storageSpy },
        { provide: TranslateService, useValue: createTranslateServiceSpy() },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: UtilsService, useValue: utilsServiceSpy },
      ],
    });
    service = TestBed.inject(LocalStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get selected or default language', () => {
    it('should return default language if no language is saved', async () => {
      const defaultLanguage = service['getMobileDefaultLanguage']();
      storageSpy.get.and.returnValue(Promise.resolve(null));
      const language = await service.loadSelectedOrDefaultLanguage();
      expect(language).toBe(defaultLanguage);
    });

    it('should save default language if no language is saved', async () => {
      const defaultLanguage = service['getMobileDefaultLanguage']();
      storageSpy.get.and.returnValue(Promise.resolve(null));
      const language = await service.loadSelectedOrDefaultLanguage();
      expect(language).toBe(defaultLanguage);
      expect(storageSpy.set).toHaveBeenCalledWith('selectedLanguage', language);
    });

    it('should return saved language if it exists', async () => {
      storageSpy.get.and.returnValue(Promise.resolve('fr'));
      const language = await service.loadSelectedOrDefaultLanguage();
      expect(language).toBe('fr');
    });
  });

  describe('save selected language', () => {
    it('should save the selected language', async () => {
      await service.saveSelectedLanguage('nl');
      expect(storageSpy.set).toHaveBeenCalledWith('selectedLanguage', 'nl');
    });

    it('should update the selected language subject', async () => {
      await service.saveSelectedLanguage('nl');
      expect(service.selectedLanguageSubject.value).toBe('nl');
    });

    it('logs an error if saving fails', async () => {
      const consoleErrorSpy = spyOn(console, 'error');
      const error = new Error('some error');
      storageSpy.set.and.returnValue(Promise.reject(error));

      await service.saveSelectedLanguage('nl');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error saving selected language:',
        error,
      );
    });

    it('throws an error if language is not provided', async () => {
      await expectAsync(service.saveSelectedLanguage('')).toBeRejectedWithError(
        Error,
        'Language must be provided',
      );
    });
  });

  describe('initialize services', () => {
    it('should initialize the storage', async () => {
      const translateServiceSpy = createTranslateServiceSpy();
      await service.initializeServicesAsync(translateServiceSpy);
      expect(storageSpy.create).toHaveBeenCalled();
    });

    it('should load selected or default language', async () => {
      const loadSelectedOrDefaultLanguageSpy = spyOn(
        service,
        'loadSelectedOrDefaultLanguage',
      ).and.returnValue(Promise.resolve('en'));
      const translateServiceSpy = createTranslateServiceSpy();
      await service.initializeServicesAsync(translateServiceSpy);
      expect(loadSelectedOrDefaultLanguageSpy).toHaveBeenCalled();
    });

    it('should set default language in translate service when initialization fails', async () => {
      storageSpy.create.and.returnValue(
        Promise.reject(new Error('init failed')),
      );

      const translateServiceSpy = createTranslateServiceSpy();

      await service.initializeServicesAsync(translateServiceSpy);

      expect(translateServiceSpy.setDefaultLang).toHaveBeenCalledWith('en');
      expect(translateServiceSpy.use).toHaveBeenCalledWith('en');
    });

    it('should not call fallback translate methods when initialization succeeds', async () => {
      spyOn(service, 'loadSelectedOrDefaultLanguage').and.returnValue(
        Promise.resolve('en'),
      );

      const translateServiceSpy = createTranslateServiceSpy();

      await service.initializeServicesAsync(translateServiceSpy);

      expect(translateServiceSpy.setDefaultLang).not.toHaveBeenCalled();
      expect(translateServiceSpy.use).not.toHaveBeenCalled();
    });
  });

  describe('Analytics Consent', () => {
    it('should set analytics consent to true', async () => {
      await service.setAnalyticsConsent(true);
      expect(storageSpy.set).toHaveBeenCalledWith('analytics_enabled', true);
    });

    it('should set analytics consent to false', async () => {
      await service.setAnalyticsConsent(false);
      expect(storageSpy.set).toHaveBeenCalledWith('analytics_enabled', false);
    });

    it('should log error if setting analytics consent fails', async () => {
      spyOn(console, 'error');
      const error = new Error('some error');
      storageSpy.set.and.returnValue(Promise.reject(error));
      await service.setAnalyticsConsent(true);

      expect(console.error).toHaveBeenCalledWith(
        'Failed to save analytics consent to localStorage:',
        error,
      );
    });

    it('should return stored analytics consent value', async () => {
      storageSpy.get.and.returnValue(Promise.resolve(true));
      const consent = await service.getAnalyticsConsent();
      expect(consent).toBe(true);
    });

    it('should return false if no stored analytics consent value', async () => {
      storageSpy.get.and.returnValue(Promise.resolve(null));
      const consent = await service.getAnalyticsConsent();
      expect(consent).toBe(false);
    });

    it('should return false and log error if stored analytics consent value fails', async () => {
      spyOn(console, 'error');
      storageSpy.get.and.returnValue(Promise.reject(new Error('some error')));
      const consent = await service.getAnalyticsConsent();

      expect(consent).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        'Failed to retrieve analytics consent from localStorage:',
        new Error('some error'),
      );
    });
  });
});
