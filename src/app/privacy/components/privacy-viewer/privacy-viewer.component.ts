import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import type { PolicyType, Language } from '@privacy/services/privacy.service';
import {
  IonContent,
  IonButton,
  IonIcon,
  IonSpinner,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from '@ui';
import { PrivacyService, PrivacyPolicy } from '@privacy/services/privacy.service';
import { Tab } from '@app/shared/enums';
import { UtilsService } from '@app/services/utils.service';

@Component({
  selector: 'app-privacy-viewer',
  templateUrl: './privacy-viewer.component.html',
  styleUrls: ['./privacy-viewer.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonButton,
    IonIcon,
    IonSpinner,
    HeaderComponent,
  ],
})
export class PrivacyViewerComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly privacyService = inject(PrivacyService);
  private readonly utilsService = inject(UtilsService);

  policy: PrivacyPolicy | null = null;
  loading = true;
  error = false;
  selectedAccordion = '';
  policyType: PolicyType = 'qr-code-generator';
  language: Language = 'en';
  availableLanguages: string[] = [];
  showBackButton = false;
  currentTab = Tab.Settings;
  Tab = Tab;

  ngOnInit() {
    // Check for internal navigation first
    this.detectInternalNavigation();

    this.route.params.subscribe((params) => {
      this.policyType = params['type'] || 'qr-code-generator';
      this.language = params['language'] || 'en';
      this.loadPolicy();
    });

    // Get selectedAccordion from query params for header + support legacy approach
    this.route.queryParams.subscribe((params) => {
      this.selectedAccordion = params['from'] || 'Privacy Policy';

      // Check for internal parameter - if present, show back button
      if (params['internal'] === 'true') {
        this.showBackButton = true;
        this.currentTab = params['currentTab'] || Tab.Settings;
      }
    });
  }

  private detectInternalNavigation() {
    // Check if navigation came from Angular Router with state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['internal']) {
      this.showBackButton = true;
    } else {
      // Default to false (external access)
      this.showBackButton = false;
    }
  }

  get backToHomeButtonLabel(): string {
    return this.language === 'de' ? 'Zurück zur Startseite' : 'Back to Home';
  }

  private loadPolicy() {
    this.loading = true;
    this.error = false;

    // Check if the policy is available
    if (
      !this.privacyService.isPolicyAvailable(this.policyType, this.language)
    ) {
      // Fallback to English if the requested language is not available
      if (
        this.language !== 'en' &&
        this.privacyService.isPolicyAvailable(this.policyType, 'en')
      ) {
        this.language = 'en';
      } else {
        // Fallback to basic policy if the type is not available
        this.policyType = 'qr-code-generator';
        this.language = 'en';
      }
    }

    this.privacyService.getPolicy(this.policyType, this.language).subscribe({
      next: (policy) => {
        this.policy = policy;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
    });
  }

  goBack() {
    this.utilsService.navigateToTab(this.currentTab);
  }
}
