import { TestBed } from '@angular/core/testing';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { FirebaseAnalyticsService } from 'src/app/services/firebase-analytics.service';
import { PrivacyService } from './privacy.service';
import { of, throwError } from 'rxjs';

describe('PrivacyService', () => {
  let service: PrivacyService;
  let httpMock: HttpTestingController;
  let firebaseAnalyticsServiceSpy: jasmine.SpyObj<FirebaseAnalyticsService>;

  beforeEach(() => {
    firebaseAnalyticsServiceSpy = jasmine.createSpyObj(
      'FirebaseAnalyticsService',
      ['logEvent'],
    );

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        PrivacyService,
        {
          provide: FirebaseAnalyticsService,
          useValue: firebaseAnalyticsServiceSpy,
        },
      ],
    });

    service = TestBed.inject(PrivacyService);
    firebaseAnalyticsServiceSpy = TestBed.inject(
      FirebaseAnalyticsService,
    ) as jasmine.SpyObj<FirebaseAnalyticsService>;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAvailablePolicies', () => {
    it('should return the available policies', () => {
      service.getAvailablePolicies().subscribe((policies) => {
        expect(policies).toHaveSize(4);
      });
    });
  });

  describe('getTitle', () => {
    it('should return the correct title in EN for a known policy type', () => {
      const title = (service as any).getTitle('qr-code-generator', 'en');
      expect(title).toBe('Privacy Policy\nz-control QR Code Generator App');
    });

    it('should return the correct title in DE for a known policy type', () => {
      const title = (service as any).getTitle('qr-code-generator', 'de');
      expect(title).toBe(
        'Datenschutzerklärung\nz-control QR-Code-Generator-App',
      );
    });

    it('should return "Unknown Privacy Policy" for an unknown policy type', () => {
      let title = (service as any).getTitle('unknown-policy', 'en');
      expect(title).toBe('Unknown Privacy Policy');

      title = (service as any).getTitle('unknown-policy', 'de');
      expect(title).toBe('Unknown Privacy Policy');
    });

    it('should return "Unknown Privacy Policy" for an unknown language', () => {
      const title = (service as any).getTitle('qr-code-generator', 'fr');
      expect(title).toBe('Unknown Privacy Policy');
    });
  });

  describe('getPolicy', () => {
    it('should return a policy for a known type and language and log an event', (done) => {
      spyOn(service as any, 'loadPolicyContent').and.returnValue(
        of('Sample Privacy Policy Content'),
      );

      service.getPolicy('qr-code-generator', 'en').subscribe((policy) => {
        expect(policy).toBeTruthy();
        expect(policy!.type).toBe('qr-code-generator');
        expect(policy!.language).toBe('en');
        expect(policy!.content).toBe('Sample Privacy Policy Content');
        expect(firebaseAnalyticsServiceSpy.logEvent).toHaveBeenCalledWith(
          'open_privacy_policy',
          jasmine.objectContaining({
            privacy_type: 'qr-code-generator',
            privacy_language: 'en',
            app: jasmine.any(String),
          }),
        );
        done();
      });
    });

    it('should return null for an unknown policy type', (done) => {
      service.getPolicy('unknown-policy', 'en').subscribe((policy) => {
        expect(policy).toBeNull();
        done();
      });
    });

    it('should return null when loading content fails', (done) => {
      spyOn(service as any, 'loadPolicyContent').and.returnValue(
        throwError(() => new Error('load failure')),
      );

      service.getPolicy('qr-code-generator', 'en').subscribe((policy) => {
        expect(policy).toBeNull();
        done();
      });
    });
  });

  describe('loadPolicyContent', () => {
    it('should make an HTTP GET request to the correct file path', () => {
      const type = 'qr-code-generator';
      const language = 'en';
      const expectedFilePath = `assets/privacy/policies/${type}/${type}-${language}.html`;

      (service as any).loadPolicyContent(type, language).subscribe();

      const req = httpMock.expectOne(expectedFilePath);
      expect(req.request.method).toBe('GET');
      req.flush('<p>Sample Privacy Policy Content</p>');
    });
  });
});
