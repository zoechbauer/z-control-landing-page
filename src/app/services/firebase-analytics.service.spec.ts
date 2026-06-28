import { TestBed } from '@angular/core/testing';

import { FirebaseAnalyticsService } from './firebase-analytics.service';
import { FirebaseAnalyticsAdapterService } from './firebase-analytics-adapter.service';
import { WindowRefService } from './window-ref.service';

describe('FirebaseAnalyticsService', () => {
  let service: FirebaseAnalyticsService;
  let adapterSpy: jasmine.SpyObj<FirebaseAnalyticsAdapterService>;
  let consoleWarnSpy: jasmine.Spy;
  let windowRefMock: { hostname: string; isAvailable: boolean };

  const analyticsMock = {} as any;

  beforeEach(() => {
    adapterSpy = jasmine.createSpyObj<FirebaseAnalyticsAdapterService>(
      'FirebaseAnalyticsAdapterService',
      ['initialize', 'setCollectionEnabled', 'logEvent'],
    );
    windowRefMock = { isAvailable: true, hostname: 'z-control.at' };

    TestBed.configureTestingModule({
      providers: [
        FirebaseAnalyticsService,
        { provide: FirebaseAnalyticsAdapterService, useValue: adapterSpy },
        { provide: WindowRefService, useValue: windowRefMock },
      ],
    });

    service = TestBed.inject(FirebaseAnalyticsService);
    consoleWarnSpy = spyOn(console, 'warn');
  });

  afterEach(() => {
    adapterSpy.initialize.calls.reset();
    adapterSpy.setCollectionEnabled.calls.reset();
    adapterSpy.logEvent.calls.reset();
    consoleWarnSpy.calls.reset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('init', () => {
    it('should initialize and disable collection', () => {
      adapterSpy.initialize.and.returnValue(analyticsMock);

      service.init();

      expect(adapterSpy.initialize).toHaveBeenCalled();
      expect(adapterSpy.setCollectionEnabled).toHaveBeenCalledWith(
        analyticsMock,
        false,
      );
    });

    it('should warn when init fails', () => {
      adapterSpy.initialize.and.throwError('Initialization failed');

      service.init();

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Firebase init error',
        jasmine.any(Error),
      );
    });

    it('should warn when setCollectionEnabled fails', () => {
      adapterSpy.initialize.and.returnValue(analyticsMock);
      adapterSpy.setCollectionEnabled.and.throwError('Set collection failed');

      service.init();

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'setAnalyticsCollectionEnabled failed',
        jasmine.any(Error),
      );
    });

    it('should return early when analytics is null or disabled', () => {
      service.logEvent('test_event');
      expect(adapterSpy.logEvent).not.toHaveBeenCalled();

      adapterSpy.initialize.and.returnValue(analyticsMock);
      service.init();
      service.enableCollection(false);

      service.logEvent('test_event');
      expect(adapterSpy.logEvent).not.toHaveBeenCalled();
    });
  });

  describe('logEvent', () => {
    it('should not throw when calling logEvent on uninitialized service', () => {
      expect(() => service.logEvent('test_event')).not.toThrow();
      expect(adapterSpy.logEvent).not.toHaveBeenCalled();
    });

    it('should log event when analytics is initialized and enabled', () => {
      adapterSpy.initialize.and.returnValue(analyticsMock);

      service.init();
      service.enableCollection(true);

      service.logEvent('test_event', { param: 'some value' });

      expect(adapterSpy.logEvent).toHaveBeenCalledWith(
        analyticsMock,
        'test_event',
        { param: 'some value' },
      );
    });

    it('should warn when logEvent fails', () => {
      adapterSpy.initialize.and.returnValue(analyticsMock);
      adapterSpy.logEvent.and.throwError('Log event failed');

      service.init();
      service.enableCollection(true);

      service.logEvent('test_event', { param: 'some value' });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Analytics logEvent failed',
        jasmine.any(Error),
      );
    });

    it('should skip logging on localhost hosts when window is not available', () => {
      adapterSpy.initialize.and.returnValue(analyticsMock);

      const hosts = ['localhost', '127.0.0.1', '::1'];

      for (const hostname of hosts) {
        adapterSpy.logEvent.calls.reset();
        windowRefMock.isAvailable = false;
        windowRefMock.hostname = hostname;

        service.init();
        service.enableCollection(true);
        service.logEvent('test_event');

        expect(adapterSpy.logEvent).not.toHaveBeenCalled();
      }
    });

    it('should log on non-localhost hosts', () => {
      adapterSpy.initialize.and.returnValue(analyticsMock);
      windowRefMock.isAvailable = true;
      windowRefMock.hostname = 'production.com';

      service.init();
      service.enableCollection(true);
      service.logEvent('test_event');

      expect(adapterSpy.logEvent).toHaveBeenCalled();
    });
  });

  describe('enableCollection', () => {
    it('should warn when setCollectionEnabled fails', () => {
      adapterSpy.setCollectionEnabled.and.throwError('Set collection failed');
      (service as any).analytics = analyticsMock;

      service.enableCollection(true);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'setAnalyticsCollectionEnabled failed',
        jasmine.any(Error),
      );
    });

    it('should disable collection when analytics is missing', () => {
      service.enableCollection(true);

      expect(adapterSpy.setCollectionEnabled).not.toHaveBeenCalled();
      expect(service.enabled$).toBeDefined();
    });
  });
});