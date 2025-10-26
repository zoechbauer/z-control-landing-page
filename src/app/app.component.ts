import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { filter } from 'rxjs';
import { Platform } from '@ionic/angular';

import { FirebaseAnalyticsService } from './services/firebase-analytics.service';
import { ConsentBannerComponent } from './ui/components/consent-banner/consent-banner.component';
import { CommonModule } from '@angular/common';

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
    private readonly platform: Platform
  ) {}

  ngOnInit(): void {
    try {
      this.fa.init();
    } catch (e) {
      console.error('fa.init error', e);
    }

    this.platform.ready().then(() => {
      try {
        const consent = localStorage.getItem('analytics_consent');
        this.showConsentBanner = consent !== 'true';
        if (consent !== null) {
          this.fa.enableCollection(consent === 'true');
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
    localStorage.setItem('analytics_consent', allow.toString());
    this.fa.enableCollection(allow);
    this.showConsentBanner = false;
  }
}
