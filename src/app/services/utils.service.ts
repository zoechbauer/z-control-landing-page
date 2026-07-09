import { Injectable, inject } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { Subject } from 'rxjs';

import { APPS } from '@app/shared/GitHubConstants';
import { MarkdownViewerComponent } from '../ui/components/markdown-viewer/markdown-viewer.component';
import { FirebaseAnalyticsService } from './firebase-analytics.service';
import { GithubAnalyticsComponent } from '../ui/components/github-analytics/github-analytics.component';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  private readonly modalController = inject(ModalController);
  private readonly firebaseAnalyticsService = inject(FirebaseAnalyticsService);

  private readonly logoClickedSub = new Subject<boolean>();
  logoClicked$ = this.logoClickedSub.asObservable();

  /**
   * Emits an event when the logo is clicked,
   * which is used to trigger actions such as opening the footer.
   */
  onLogoClicked() {
    this.logoClickedSub.next(true);
  }

  /**
   * Returns true if the device is in portrait orientation.
   */
  get isPortrait(): boolean {
    return globalThis.matchMedia('(orientation: portrait)').matches;
  }

  /**
   * Returns true if the device is a small screen (mobile, portrait).
   */
  get isSmallScreen(): boolean {
    const isMobileWidth = window.innerWidth <= 768;
    return isMobileWidth && this.isPortrait;
  }

  /**
   * Returns true if the device is a small device (short height, short width).
   */
  get isSmallDevice(): boolean {
    const isMobileHeight = window.innerHeight <= 640;
    const isMobileWidth = window.innerWidth <= 768;
    return isMobileHeight && isMobileWidth;
  }

  /**
   * Opens a markdown document in a modal.
   * @param docPath The path to the markdown document.
   */
  async openMarkdownDoc(docPath: string) {
    const docFileName = docPath.split('/').pop();
    this.handleAnalyticsEvent({
      eventName: 'open_markdown_document',
      params: {
        document: docFileName,
        app: APPS.LANDING_PAGE,
      },
    });

    const modal = await this.modalController.create({
      component: MarkdownViewerComponent,
      componentProps: {
        fullChangeLogPath: docPath,
        title: `GitHub Documentation:<br>${docPath.split('/').pop()}`,
      },
      cssClass: 'documentation-modal',
    });
    await modal.present();
  }

  /**
   * Opens a modal displaying the GitHub Analytics Dashboard for the selected accordion section.
   * @param selectedAccordion The selected accordion section for which to display the GitHub Analytics Dashboard.
   */
  async openGitHubAnalytics(selectedAccordion: keyof typeof APPS) {
    this.handleAnalyticsEvent({
      eventName: 'view_github_analytics',
      params: {
        called_from: selectedAccordion,
        app: APPS.LANDING_PAGE,
      },
    });
    const modal = await this.modalController.create({
      component: GithubAnalyticsComponent,
      cssClass: 'github-analytics-modal',
    });

    await modal.present();
  }

  /**
   * Opens a modal displaying the changelog for the selected accordion section.
   * @param selectedAccordion The selected accordion section for which to display the changelog.
   */
  async openChangelog(selectedAccordion: keyof typeof APPS) {
    const changeLogPath = this.getChangelogPathForAccordion(selectedAccordion);
    this.handleAnalyticsEvent({
      eventName: 'open_changelog',
      params: {
        changelog_for: selectedAccordion,
        app: APPS.LANDING_PAGE,
      },
    });

    const modal = await this.modalController.create({
      component: MarkdownViewerComponent,
      componentProps: {
        fullChangeLogPath: changeLogPath,
        title: `Changelog for ${selectedAccordion}`,
      },
      cssClass: 'change-log-modal',
    });

    await modal.present();
  }

  /**
   * Handles analytics events by logging them to Firebase Analytics.
   * @param event The analytics event to log.
   */
  private handleAnalyticsEvent(event: { eventName: string; params: any }) {
    this.firebaseAnalyticsService.logEvent(event.eventName, event.params);
  }

  private getChangelogPathForAccordion(
    selectedAccordion: keyof typeof APPS,
  ): string {
    switch (selectedAccordion) {
      case APPS.LANDING_PAGE:
        return 'assets/logs/change-logs/CHANGELOG_LANDING-PAGE.md';
      case APPS.BACKEND_FUNCTIONS:
        return 'assets/logs/change-logs/CHANGELOG_BACKEND-FUNCTIONS.md';
      case APPS.IONIC_SETUP:
        return 'assets/logs/change-logs/CHANGELOG_IONIC-SETUP.md';
      case APPS.QR_CODE_GENERATOR:
        return 'assets/logs/change-logs/CHANGELOG_QR-CODE.md';
      case APPS.MULTI_LANGUAGE_TRANSLATOR:
        return 'assets/logs/change-logs/CHANGELOG_MULTI-LANGUAGE-TRANSLATOR.md';
      default:
        return '';
    }
  }
}
