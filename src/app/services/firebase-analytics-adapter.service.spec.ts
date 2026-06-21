import { TestBed } from '@angular/core/testing';
import {
  FIREBASE_APP_INIT,
  FIREBASE_GET_ANALYTICS,
  FIREBASE_LOG_EVENT,
  FIREBASE_SET_COLLECTION_ENABLED,
  FirebaseAnalyticsAdapterService,
} from './firebase-analytics-adapter.service';
import { environment } from '../../environments/environment';

describe('FirebaseAnalyticsAdapterService', () => {
  let service: FirebaseAnalyticsAdapterService;
  let initializeAppSpy: jasmine.Spy;
  let getAnalyticsSpy: jasmine.Spy;
  let setCollectionEnabledSpy: jasmine.Spy;
  let logEventSpy: jasmine.Spy;

  beforeEach(() => {
    initializeAppSpy = jasmine.createSpy('initializeApp').and.returnValue({ app: 'app' });
    getAnalyticsSpy = jasmine.createSpy('getAnalytics').and.returnValue({ analytics: true });
    setCollectionEnabledSpy = jasmine.createSpy('setCollectionEnabled');
    logEventSpy = jasmine.createSpy('logEvent');

    TestBed.configureTestingModule({
      providers: [
        FirebaseAnalyticsAdapterService,
        { provide: FIREBASE_APP_INIT, useValue: initializeAppSpy },
        { provide: FIREBASE_GET_ANALYTICS, useValue: getAnalyticsSpy },
        { provide: FIREBASE_SET_COLLECTION_ENABLED, useValue: setCollectionEnabledSpy },
        { provide: FIREBASE_LOG_EVENT, useValue: logEventSpy },
      ],
    });

    service = TestBed.inject(FirebaseAnalyticsAdapterService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize analytics', () => {
    const result = service.initialize();

    expect(initializeAppSpy).toHaveBeenCalledWith(environment.firebase);
    expect(getAnalyticsSpy).toHaveBeenCalledWith({ app: 'app' });
    expect(result).toContain({ analytics: true });
  });

  it('should set collection enabled', () => {
    const analyticsMock = {} as any;

    service.setCollectionEnabled(analyticsMock, true);

    expect(setCollectionEnabledSpy).toHaveBeenCalledWith(analyticsMock, true);
  });

  it('should log event', () => {
    const analyticsMock = {} as any;

    service.logEvent(analyticsMock, 'test_event', { a: 1 });

    expect(logEventSpy).toHaveBeenCalledWith(analyticsMock, 'test_event', { a: 1 });
  });
});