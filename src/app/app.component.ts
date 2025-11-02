import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Platform } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

import { FirebaseAnalyticsService } from './services/firebase-analytics.service';
import { LocalStorageService } from './services/local-storage.service';
import { UtilsService } from './services/utils.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, CommonModule],
})
export class AppComponent implements OnInit {
  showConsentBanner = false;

  constructor(
    private readonly router: Router,
    private readonly fa: FirebaseAnalyticsService,
    private readonly platform: Platform,
    private readonly localStorageService: LocalStorageService,
    private readonly utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    try {
      this.fa.init();
    } catch (e) {
      console.error('fa.init error', e);
    }

    this.platform.ready().then(() => {
      const consent = this.localStorageService.getAnalyticsConsent();
      this.fa.enableCollection(consent ?? false);
      if (consent !== true) {
        this.openFooter();
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

  private openFooter() {
    // firebase analytics event handled in footer component
    setTimeout(() => {
      this.utilsService.onLogoClicked();
    }, 1000);
  }
}
