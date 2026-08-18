import { Injectable, inject } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import { Capacitor } from '@capacitor/core';

import { APPS } from '@app/shared/GitHubConstants';
import { MarkdownViewerComponent } from '../ui/components/markdown-viewer/markdown-viewer.component';
import { FirebaseAnalyticsService } from './firebase-analytics.service';
import { GithubAnalyticsComponent } from '../ui/components/github-analytics/github-analytics.component';
import { Router } from '@angular/router';
import { Tab } from '../shared/enums';
import { HelpModalComponent } from '../ui/components/get-help/get-help.component';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  private readonly modalController = inject(ModalController);
  private readonly firebaseAnalyticsService = inject(FirebaseAnalyticsService);
  private readonly router = inject(Router);

  /**
   * Emits when the logo is clicked (used for feedback or navigation triggers).
   */
  logoClickedSub = new Subject<boolean>();
  /**
   * Observable for logo click events.
   */
  logoClicked$ = this.logoClickedSub.asObservable();
  /**
   * Emits when the back button is clicked (used for navigation triggers).
   */
  backButtonClickedSub = new Subject<boolean>();
  /**
   * Observable for back button click events.
   */
  backButtonClicked$ = this.backButtonClickedSub.asObservable();
  /**
   * Emits when the workflow step changes (used for navigation triggers).
   */

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
   * Returns true if the app is running on a native platform (Capacitor/Cordova).
   */
  get isNativeApp(): boolean {
    return Capacitor.isNativePlatform();
  }

  /**
   * Returns true if the IonTabBar should be shown (based on config and screen size).
   */
  get isShowIonTabBar(): boolean {
    if (!environment.app.showTabsBar) {
      return false;
    }
    return this.isSmallScreen;
  }

  /**
   * Navigates to the specified tab.
   * @param tab The tab to navigate to
   */
  navigateToTab(tab: Tab): void {
    this.router.navigate([`/tabs/${tab}`]);
  }

  /**
   * Navigates to the specified tab with query parameters.
   * @param tab The tab to navigate to
   * @param params Query parameters to include
   */
  navigateToTabWithParams(tab: Tab, params: any): void {
    this.router.navigate([`/tabs/${tab}`], { queryParams: params });
  }

  /**
   * Shows or hides the IonTabBar based on current settings.
   */
  showOrHideIonTabBar(): void {
    if (this.isShowIonTabBar) {
      this.showIonTabBar();
    } else {
      this.hideIonTabBar();
    }
  }

  private hideIonTabBar(): void {
    const element = document.querySelector('ion-tab-bar');
    if (!element?.classList.contains('hide-ion-tab-bar')) {
      element?.classList.add('hide-ion-tab-bar');
    }
  }

  private showIonTabBar(): void {
    const element = document.querySelector('ion-tab-bar');
    if (element?.classList.contains('hide-ion-tab-bar')) {
      element?.classList.remove('hide-ion-tab-bar');
    }
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
   * Opens the help modal dialog displaying the HelpModalComponent.
   * @returns {Promise<void>} A promise that resolves when the modal is presented.
   */
  async openHelpModal(): Promise<void> {
    this.handleAnalyticsEvent({
      eventName: 'open_help_modal',
      params: {
        app: APPS.LANDING_PAGE,
      },
    });

    const modal = await this.modalController.create({
      component: HelpModalComponent,
      cssClass: 'manual-instructions-modal',
    });
    return await modal.present();
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
      case APPS.IMAGE_TO_TEXT:
        return 'assets/logs/change-logs/CHANGELOG_IMAGE-TO-TEXT.md';
      default:
        return '';
    }
  }

  /**
   * Scrolls to a specific element by ID
   * @param id - The ID of the target element
   * @param event - The click event to prevent default behavior
   */
  scrollTo(id: string, event: Event) {
    event.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.warn(`Element with id '${id}' not found`);
    }
  }

  /**
   * Scrolls smoothly to the element with the given ID (no event parameter).
   * @param elementId The element ID
   */
  scrollToElement(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }

  /**
   * Scrolls smoothly to the element with the given ID, adjusting for tab bar and navigation bar height.
   * @param elementId The element ID
   */
  scrollToElementUsingTabBar(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      const tabBarHeight = 60;
      const navigationBarHeight = 44;
      const yOffset = -navigationBarHeight - tabBarHeight;

      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      element.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  /**
   * Adds leading blanks to a string or number to ensure it reaches a specified total length.
   * @param value - The string or number to format.
   * @param totalLength - The desired total length of the resulting string.
   */
  addLeadingBlanks(value: string | number, totalLength: number): string {
    const valueStr = String(value);
    const leadingBlanksCount = totalLength - valueStr.length;
    if (leadingBlanksCount > 0) {
      return ' '.repeat(leadingBlanksCount) + valueStr;
    }
    return valueStr;
  }
}
