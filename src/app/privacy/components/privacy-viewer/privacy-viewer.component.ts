import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PrivacyService, PrivacyPolicy } from '../../services/privacy.service';
import {
  IonContent,
  IonButton,
  IonIcon,
  IonSpinner,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../ui/components/header/header.component';
import { FooterComponent } from '../../../ui/components/footer/footer.component';
import { addIcons } from 'ionicons';
import { chevronBackOutline, globeOutline } from 'ionicons/icons';

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
  policy: PrivacyPolicy | null = null;
  loading = true;
  error = false;
  selectedAccordion = '';
  policyType = 'basic';
  language = 'en';
  availableLanguages: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private privacyService: PrivacyService
  ) {
    addIcons({ chevronBackOutline, globeOutline });
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.policyType = params['type'] || 'basic';
      this.language = params['language'] || 'en';
      this.loadPolicy();
    });

    // Get selectedAccordion from query params for header + support legacy approach
    this.route.queryParams.subscribe((params) => {
      console.log('route.queryParams:', params  );
      
      this.selectedAccordion = params['from'] || 'Privacy Policy';
      // Support legacy query parameter approach
      if (params['from']) {
        this.policyType = this.mapLegacyFromParam(params['from']);
      }
    });
  }

  private mapLegacyFromParam(from: string): string {
    // Map legacy 'from' parameter values to policy types
    const mapping: { [key: string]: string } = {
      'z-control QR Code Generator App': 'basic',
      'Z-Control QR Code Generator App': 'basic',
      'Future App 1': 'premium',
      'Future App 2': 'enterprise',
    };
    return mapping[from] || 'basic';
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
        this.policyType = 'basic';
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

  get otherLanguage(): string {
    return this.language === 'en' ? 'de' : 'en';
  }

  get otherLanguageLabel(): string {
    return this.language === 'en' ? 'Deutsch' : 'English';
  }

  get hasOtherLanguage(): boolean {
    return this.availableLanguages.includes(this.otherLanguage);
  }
}
