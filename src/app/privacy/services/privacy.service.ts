import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { FirebaseAnalyticsService } from 'src/app/services/firebase-analytics.service';
import { APPS } from 'shared/GitHubConstants';

export interface PrivacyPolicy {
  type: typeof APPS[keyof typeof APPS];
  language: 'en' | 'de';
  title: string;
  content: string;
  lastUpdated: string;
}

export interface PrivacyPolicyMeta {
  type: string;
  languages: string[];
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class PrivacyService {
  private readonly availablePolicies: PrivacyPolicyMeta[] = [
    {
      type: 'qr-code-generator',
      languages: ['en', 'de'],
      description:
        'Standard privacy policy for z-control QR Code Generator App',
    },
    {
      type: 'landing-page',
      languages: ['en', 'de'],
      description: 'Standard privacy policy for z-control Landing Page App',
    },
    {
      type: 'premium',
      languages: ['en', 'de'],
      description: 'Privacy policy for premium features (future)',
    },
  ];

  constructor(
    private readonly fa: FirebaseAnalyticsService,
    private readonly http: HttpClient
  ) {}

  /**
   * Get list of available privacy policy types
   */
  getAvailablePolicies(): Observable<PrivacyPolicyMeta[]> {
    return of(this.availablePolicies);
  }

  /**
   * Get privacy policy content by type and language
   */
  getPolicy(type: string, language: string): Observable<PrivacyPolicy | null> {
    if (!this.isPolicyAvailable(type, language)) {
      return of(null);
    }

    this.fa.logEvent('open_privacy_policy', {
      privacy_type: type,
      privacy_language: language,
      app: APPS.LANDING_PAGE,
    });

    return this.loadPolicyContent(type, language).pipe(
      map((content) => ({
        type: type as any,
        language: language as any,
        title: this.getTitle(type, language),
        content,
        lastUpdated: '2025-10-24',
      })),
      catchError(() => of(null))
    );
  }

  /**
   * Get default policy (qr-code-generator/en) for landing page
   */
  getDefaultPolicy(): Observable<PrivacyPolicy | null> {
    return this.getPolicy('qr-code-generator', 'en');
  }

  /**
   * Check if a policy type and language combination exists
   */
  isPolicyAvailable(type: string, language: string): boolean {
    const policy = this.availablePolicies.find((p) => p.type === type);
    return policy ? policy.languages.includes(language) : false;
  }

  /**
   * Load policy content from HTML files
   */
  private loadPolicyContent(
    type: string,
    language: string
  ): Observable<string> {
    const fileName = `${type}-${language}.html`;
    const filePath = `assets/privacy/policies/${type}/${fileName}`;
    return this.http.get(filePath, { responseType: 'text' });
  }

  private getTitle(type: string, language: string): string {
    const titles: Record<string, Record<string, string>> = {
      'qr-code-generator': {
        en: 'Privacy Policy\nz-control QR Code Generator App',
        de: 'Datenschutzerklärung\nz-control QR-Code-Generator-App',
      },
      'landing-page': {
        en: 'Privacy Policy\nz-control Landing Page App',
        de: 'Datenschutzerklärung\nz-control Startseite App',
      },
      premium: {
        en: 'Privacy Policy\nPremium Features',
        de: 'Datenschutzerklärung\nPremium-Funktionen',
      },
    };

    return titles[type]?.[language] || 'Privacy Policy';
  }
}
