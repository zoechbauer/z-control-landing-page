import { Component, Input, inject, OnInit, OnDestroy } from '@angular/core';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import {
  IonAccordion,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { UtilsService } from 'src/app/services/utils.service';
import { FirebaseAnalyticsService } from 'src/app/services/firebase-analytics.service';
import { APPS } from 'src/app/shared/GitHubConstants';

@Component({
  selector: 'app-get-github-analytics-accordion',
  templateUrl: './get-github-analytics-accordion.component.html',
  standalone: true,
  imports: [
    IonButton,
    IonAccordion,
    IonItem,
    IonIcon,
    IonLabel,
    NgIf,
    NgTemplateOutlet,
    TranslateModule,
  ],
})
export class GetGithubAnalyticsAccordionComponent implements OnInit, OnDestroy {
  translate = inject(TranslateService);
  readonly fa = inject(FirebaseAnalyticsService);
  private readonly utilsService = inject(UtilsService);

  @Input() lang!: string;
  @Input() disableAccordion = true;

  isAnalyticsEnabled = false;

  private readonly sub = new Subscription();

  ngOnInit(): void {
    this.sub.add(
      this.fa.enabled$.subscribe((enabled) => {
        this.isAnalyticsEnabled = enabled;
      }),
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  async onOpenGitHubAnalytics(lang: string): Promise<void> {
    const selectedAccordion = APPS.LANDING_PAGE as keyof typeof APPS;
    await this.utilsService.openGitHubAnalytics(selectedAccordion, lang);
  }
}
