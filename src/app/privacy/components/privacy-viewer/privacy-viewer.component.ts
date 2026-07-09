import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonButton,
  IonIcon,
  IonSpinner,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from '../../../ui/components/header/header.component';
import { FooterComponent } from '../../../ui/components/footer/footer.component';
import { PrivacyService, PrivacyPolicy } from '../../services/privacy.service';

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
    FooterComponent,
  ],
})
export class PrivacyViewerComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly privacyService = inject(PrivacyService);

  policy: PrivacyPolicy | null = null;
  loading = true;
  error = false;
  selectedAccordion = '';
  policyType = '';
  language = 'en';
  availableLanguages: string[] = [];
  showBackButtonAndFooter = false;

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

      // Check for internal parameter - if present, show footer/back button
      if (params['internal'] === 'true') {
        this.showBackButtonAndFooter = true;
      }
    });
  }

  private detectInternalNavigation() {
    // Check if navigation came from Angular Router with state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['internal']) {
      this.showBackButtonAndFooter = true;
    } else {
      // Default to false (external access)
      this.showBackButtonAndFooter = false;
    }
  }

  get otherLanguage(): string {
    return this.language === 'en' ? 'de' : 'en';
  }

  get otherLanguageLabel(): string {
    return this.language === 'en' ? 'Switch to German' : 'Zu Englisch wechseln';
  }

  get hasOtherLanguage(): boolean {
    return this.availableLanguages.includes(this.otherLanguage);
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
        this.loadAvailableLanguages();
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
    });
  }

  private loadAvailableLanguages() {
    this.privacyService.getAvailablePolicies().subscribe((policies) => {
      const policyMeta = policies.find((p) => p.type === this.policyType);
      this.availableLanguages = policyMeta?.languages || ['en'];
    });
  }

  switchLanguage(newLanguage: string) {
    if (
      newLanguage !== this.language &&
      this.availableLanguages.includes(newLanguage)
    ) {
      this.router.navigate(['/privacy', this.policyType, newLanguage], {
        queryParamsHandling: 'preserve',
      });
    }
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
