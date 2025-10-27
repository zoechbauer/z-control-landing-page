import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Platform } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

import { FirebaseAnalyticsService } from './services/firebase-analytics.service';
import { ConsentBannerComponent } from './ui/components/consent-banner/consent-banner.component';
import { LocalStorageService } from './services/local-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, ConsentBannerComponent, CommonModule],
})
export class AppComponent implements OnInit {
  showConsentBanner = false;

  constructor(
    private readonly router: Router,
    private readonly fa: FirebaseAnalyticsService,
    private readonly platform: Platform,
    private readonly localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    try {
      this.fa.init();
    } catch (e) {
      console.error('fa.init error', e);
    }

    this.platform.ready().then(() => {
      try {
        const consent = this.localStorageService.getAnalyticsConsent();
        this.showConsentBanner = consent !== true;
        if (consent !== null) {
          this.fa.enableCollection(consent);
        }
      } catch (err) {
        console.error('Consent check error', err);
        // fallback: show banner so user can decide
        this.showConsentBanner = true;
      }
    });

    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.fa.logEvent('page_view', {
          page_path: (event as NavigationEnd).urlAfterRedirects,
          page_title: document.title,
        });
      });
  }

  onConsentDecision(allow: boolean) {
    this.localStorageService.setAnalyticsConsent(allow);
    this.fa.enableCollection(allow);
    this.showConsentBanner = false;
  }
}
