import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { FirebaseAnalyticsService } from '@app/services/firebase-analytics.service';
import { APPS, AppKey } from '@app/shared/GitHubConstants';
import { AppMetadataService } from '@app/services/app-metadata.service';

export type PolicyType =
  | 'image-to-text'
  | 'multi-language-translator'
  | 'qr-code-generator'
  | 'landing-page';

export type Language = 'en' | 'de';
export interface PrivacyPolicy {
  type: PolicyType;
  language: Language;
  title: string;
  content: string;
  lastUpdated: string;
}

export interface PrivacyPolicyMeta {
  type: PolicyType;
  languages: string[];
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class PrivacyService {
  private readonly fa = inject(FirebaseAnalyticsService);
  private readonly http = inject(HttpClient);
  private readonly appMetadata = inject(AppMetadataService);

  // NOTE: When adding a new privacy policy:
  // 1. Add a new entry to policyNames in AppMetadataService
  // 2. Add a corresponding entry in availablePolicies below.
  // 3. Add a corresponding entry in policyTitles below.
  // the policy name and type must match the name in the assets privacy/policies/{policy-folder} folder

  private readonly availablePolicies: PrivacyPolicyMeta[] = [
    {
      type: 'image-to-text',
      languages: ['en', 'de'],
      description: 'Standard privacy policy for z-control Image to Text App',
    },
    {
      type: 'multi-language-translator',
      languages: ['en', 'de'],
      description: 'Standard privacy policy for z-control Translator App',
    },
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
  ];

  // Add a new entry here matching the 'type' (folder name in assets/privacy/policies/{new-policy-folder}).
  private readonly policyTitles: Record<PolicyType, Record<Language, string>> =
    {
      'image-to-text': {
        en: 'Privacy Policy\nz-control Image to Text App',
        de: 'Datenschutzerklärung\nz-control Image to Text App',
      },
      'multi-language-translator': {
        en: 'Privacy Policy\nz-control Translator App',
        de: 'Datenschutzerklärung\nz-control Übersetzer App',
      },
      'qr-code-generator': {
        en: 'Privacy Policy\nz-control QR Code Generator App',
        de: 'Datenschutzerklärung\nz-control QR-Code-Generator-App',
      },
      'landing-page': {
        en: 'Privacy Policy\nz-control Landing Page App',
        de: 'Datenschutzerklärung\nz-control Landing Page App',
      },
    };
  /**** end of policy definitions */

  /**
   * Get list of available privacy policy types
   */
  getAvailablePolicies(): Observable<PrivacyPolicyMeta[]> {
    return of(this.availablePolicies);
  }

  /**
   * Get privacy policy content by type and language
   */
  getPolicy(
    type: PolicyType,
    language: Language,
  ): Observable<PrivacyPolicy | null> {
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
        type: type,
        language: language,
        title: this.getTitle(type, language),
        content,
        lastUpdated: '2025-10-24',
      })),
      catchError(() => of(null)),
    );
  }

  /**
   * Check if a policy type and language combination exists
   */
  isPolicyAvailable(type: PolicyType, language: Language): boolean {
    const policy = this.availablePolicies.find((p) => p.type === type);
    return policy ? policy.languages.includes(language) : false;
  }

  /**
   * Load policy content from HTML files
   */
  private loadPolicyContent(
    type: PolicyType,
    language: Language,
  ): Observable<string> {
    const fileName = `${type}-${language}.html`;
    const filePath = `assets/privacy/policies/${type}/${fileName}`;
    return this.http.get(filePath, { responseType: 'text' });
  }

  /**
   * Get the title of a privacy policy based on its type and language.
   * @param type The type of the privacy policy.
   * @param language The language of the privacy policy.
   * @returns The title of the privacy policy.
   */
  private getTitle(type: PolicyType, language: Language): string {
    return this.policyTitles[type]?.[language] || 'Unknown Privacy Policy';
  }

  /**
   * Get the name of a privacy policy based on the app name.
   * @param selectedAccordion The selected accordion identifier corresponding to the app.
   * @returns The name of the privacy policy for the app.
   */
  getPolicyName(selectedAccordion: AppKey): string {
    return (
      this.appMetadata.getPolicyName(selectedAccordion) ??
      `policy-not-defined-for-${selectedAccordion}`
    );
  }
}
