import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Platform } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { filter, Subscription } from 'rxjs';

import { FirebaseAnalyticsService } from './services/firebase-analytics.service';
import { LocalStorageService } from './services/local-storage.service';
import { UtilsService } from './services/utils.service';
import { environment } from '@env/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, CommonModule],
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);
  private readonly fa = inject(FirebaseAnalyticsService);
  private readonly platform = inject(Platform);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly utilsService = inject(UtilsService);

  showConsentBanner = false;
    showTabsBar = environment.app.showTabsBar;
    isNativeApp = this.utilsService.isNativeApp;
    private subscription: Subscription[] = [];

  ngOnInit(): void {
    (async () => {
      try {
        await this.localStorageService.initializeServicesAsync(this.translate);
        this.fa.init();
      } catch (e) {
        console.error('fa.init error', e);
      }

      this.platform.ready().then(async () => {
        const consent = await this.localStorageService.getAnalyticsConsent();
        this.fa.enableCollection(consent ?? false);
        if (consent !== true) {
          this.openFirebaseAnalytics();
        }
      });
    })();

    this.subscription.push(
      this.router.events
        .pipe(filter((e) => e instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
          this.fa.logEvent('page_view', {
            page_path: (event as NavigationEnd).urlAfterRedirects,
            page_title: document.title,
          });
        })
    );
  }

    private openFirebaseAnalytics() {
    // firebase analytics event handled in settings component
    setTimeout(() => {
      this.utilsService.openFirebaseAnalyticsSub.next(true);
    }, 1000);
  }
  
  ngOnDestroy(): void {
    this.subscription.forEach((sub) => sub.unsubscribe());
  }
}
