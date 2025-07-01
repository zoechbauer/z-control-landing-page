import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface ChangelogEntry {
  version: string;
  date: string;
  added?: string[];
  fixed?: string[];
  improved?: string[];
  features?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class ChangelogService {
  private changelogData: ChangelogEntry[] = [
    {
      version: '1.1',
      date: 'July 1, 2025',
      added: [
        '<strong>Version Information</strong>: You can now see the current version in the footer',
        '<strong>What\'s New Dialog</strong>: Click "What\'s New" in the footer to see recent updates',
        '<strong>Better Documentation</strong>: Improved help and guidance throughout the site',
      ],
      fixed: [
        '<strong>Dark Mode Support</strong>: Fixed text visibility issues when using dark mode',
        '<strong>Better Readability</strong>: Improved contrast and text clarity across all pages',
        '<strong>Mobile Experience</strong>: Enhanced display on mobile devices and tablets',
      ],
      improved: [
        '<strong>Consistent Design</strong>: Unified visual style throughout the application',
        '<strong>Performance</strong>: Faster loading and smoother navigation',
        '<strong>Accessibility</strong>: Better support for screen readers and keyboard navigation',
      ],
    },
    {
      version: '1.0',
      date: 'June 30, 2025',
      features: [
        '<strong>Landing Page</strong>: Complete showcase for our applications',
        '<strong>Privacy Policy</strong>: Comprehensive privacy information in German and English',
        '<strong>App Information</strong>: Details about z-control QR Code app and download options',
        '<strong>Mobile Ready</strong>: Fully responsive design for all devices',
        '<strong>Professional Design</strong>: Clean, modern interface following best practices',
      ],
    },
  ];

  getLatestChanges(limit: number = 3): Observable<ChangelogEntry[]> {
    return of(this.changelogData.slice(0, limit));
  }
}
