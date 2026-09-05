import { Injectable, inject } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import { Capacitor } from '@capacitor/core';

import { APPS, AppKey } from '@app/shared/GitHubConstants';
import { MarkdownViewerComponent } from '@ui/components/markdown-viewer/markdown-viewer.component';
import { GithubAnalyticsComponent } from '@ui/components/github-analytics/github-analytics.component';
import { HelpModalComponent } from '@ui/components/get-help/get-help.component';
import { FirebaseAnalyticsService } from './firebase-analytics.service';
import { AppMetadataService } from './app-metadata.service';
import { Router } from '@angular/router';
import { Tab } from '@app/shared/enums';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  private readonly modalController = inject(ModalController);
  private readonly firebaseAnalyticsService = inject(FirebaseAnalyticsService);
  private readonly appMetadata = inject(AppMetadataService);
  private readonly router = inject(Router);

  /**
   * Subject that emits when the logo is clicked (for feedback or navigation).
   */
  logoClickedSub = new Subject<boolean>();
  /**
   * Observable of logo click events.
   */
  logoClicked$ = this.logoClickedSub.asObservable();
  /**
   * Subject that emits when the back button is clicked (for navigation).
   */
  backButtonClickedSub = new Subject<boolean>();
  /**
   * Observable of back button click events.
   */
  backButtonClicked$ = this.backButtonClickedSub.asObservable();
  /**
   * Subject that emits when the Firebase Analytics link is opened.
   */
  openFirebaseAnalyticsSub = new Subject<boolean>();
  /**
   * Observable of Firebase Analytics open events.
   */
  openFirebaseAnalytics$ = this.openFirebaseAnalyticsSub.asObservable();

  /**
   * Emit a logo-click event (for example, to open the feedback accordion).
   */
  onLogoClicked() {
    this.logoClickedSub.next(true);
  }

  /**
   * Returns true if the device is in portrait orientation.
   * Note: matchMedia updates when the orientation changes.
   */
  get isPortrait(): boolean {
    return globalThis.matchMedia('(orientation: portrait)').matches;
  }

  /**
   * Returns true if the device is a small screen (mobile in portrait).
   * Note: isPortrait updates when the orientation changes.
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
    this.firebaseAnalyticsService.logEvent('open_markdown_document', {
      document: docFileName,
      app: APPS.LANDING_PAGE,
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
   * @param lang The language to use in the GitHub Analytics modal.
   */
  async openGitHubAnalytics(selectedAccordion: AppKey, lang: string) {
    this.firebaseAnalyticsService.logEvent('view_github_analytics', {
      called_from: selectedAccordion,
      app: APPS.LANDING_PAGE,
    });

    const modal = await this.modalController.create({
      component: GithubAnalyticsComponent,
      componentProps: {
        lang: lang,
      },
      cssClass: 'github-analytics-modal',
    });

    await modal.present();
  }

  /**
   * Opens a modal displaying the changelog for the selected accordion section.
   * @param selectedAccordion The selected accordion section for which to display the changelog.
   */
  async openChangelog(selectedAccordion: AppKey) {
    this.firebaseAnalyticsService.logEvent('open_changelog', {
      changelog_for: selectedAccordion,
      app: APPS.LANDING_PAGE,
    });

    const changeLogPath = this.getChangelogPathForAccordion(selectedAccordion);
    const appName = APPS[selectedAccordion];

    const modal = await this.modalController.create({
      component: MarkdownViewerComponent,
      componentProps: {
        fullChangeLogPath: changeLogPath,
        title1line: `Changelog for ${appName}`,
        title2lines: `Changelog for<br />${appName}`,
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
    this.firebaseAnalyticsService.logEvent('open_help_modal', {
      app: APPS.LANDING_PAGE,
    });

    const modal = await this.modalController.create({
      component: HelpModalComponent,
      cssClass: 'manual-instructions-modal',
    });
    return await modal.present();
  }

  /**
   * Opens the web app in a new browser tab and emits an analytics event.
   */
  onOpenWebApp(selectedAccordion: AppKey) {
    const url = this.getWebLinkPathForAccordion(selectedAccordion);
    globalThis.window.open(url, '_blank');

    this.firebaseAnalyticsService.logEvent('open_web_app', {
      url: url,
      app: APPS.LANDING_PAGE,
    });
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

  /**
   * Returns the tooltip text for a main accordion section based on the language and whether it is currently selected.
   * @param lang The language code ('en' for English, 'de' for German)
   * @param accordionName The name of the accordion section
   * @param selectedMainAccordion The currently selected main accordion
   * @param toolTipMainAccordion The main accordion for which the tooltip is being generated
   * @returns The tooltip text for the accordion section based on the language and selection state
   */
  getAccordionTooltip(
    lang: string,
    accordionName: string,
    selectedMainAccordion: string,
    toolTipMainAccordion: string,
  ): string {
    if (lang === 'en') {
      return selectedMainAccordion === toolTipMainAccordion
        ? `Collapse ${accordionName} section`
        : `Expand ${accordionName} section`;
    }
    return selectedMainAccordion === toolTipMainAccordion
      ? `Abschnitt ${accordionName} schließen`
      : `Abschnitt ${accordionName} öffnen`;
  }

  /**
   * Returns the tooltip text for a sub-accordion section based on the language and whether it is currently selected.
   * @param lang The language code ('en' for English, 'de' for German)
   * @param selectedSubAccordion The currently selected sub-accordion
   * @param toolTipSubAccordion The sub-accordion for which the tooltip is being generated
   * @returns The tooltip text for the accordion section based on the language and selection state
   */
  getSubAccordionTooltip(
    lang: string,
    selectedSubAccordion: string,
    toolTipSubAccordion: string,
  ): string {
    if (lang === 'en') {
      return selectedSubAccordion == toolTipSubAccordion
        ? 'Collapse this part-section'
        : 'Expand this part-section';
    }
    return selectedSubAccordion == toolTipSubAccordion
      ? 'Diesen Teil-Abschnitt schließen'
      : 'Diesen Teil-Abschnitt öffnen';
  }

  /**
   * Replaces occurrences of 'z-control' with a non-breaking variant 'z\u2011control'.
   * @param value The string in which to replace 'z-control' with a non-breaking variant.
   * @returns The modified string with 'z-control' replaced by 'z\u2011control'.
   */
  changeZControlToNonBreaking(value: string): string {
    return value.replaceAll('z-control', 'z\u2011control');
  }

  /**
   * Returns the display name of the app with 'z-control' replaced by a non-breaking variant.
   * @param selectedAccordion The key of the selected accordion
   * @returns The changed App name
   */
  getDisplayNameForAccordion(selectedAccordion: AppKey): string {
    const s = APPS[selectedAccordion] ?? '';
    return this.changeZControlToNonBreaking(s);
  }

  /**
   * Returns the changelog path for the specified accordion.
   * @param selectedAccordion The key of the selected accordion
   * @returns The changelog path for the specified accordion
   */
  private getChangelogPathForAccordion(selectedAccordion: AppKey): string {
    return this.appMetadata.getChangeLogPath(selectedAccordion);
  }

  /**
   * Returns the web link path for the specified accordion.
   * @param selectedAccordion The key of the selected accordion
   * @returns The web link path for the specified accordion
   */
  getWebLinkPathForAccordion(selectedAccordion: AppKey): string {
    const link = this.appMetadata.getWebLink(selectedAccordion);
    return link;
  }

  /**
   * Returns the source link path for the specified accordion.
   * @param selectedAccordion The key of the selected accordion
   * @returns The source link path for the specified accordion
   */
  getSourceLinkPathForAccordion(selectedAccordion: AppKey): string {
    const link = this.appMetadata.getSourceLink(selectedAccordion);
    return link;
  }

  /**
   * Returns the Play Store link path for the specified accordion.
   * @param selectedAccordion The key of the selected accordion
   * @returns The Play Store link path for the specified accordion
   */
  getPlayStoreLinkPathForAccordion(selectedAccordion: AppKey): string {
    const link = this.appMetadata.getPlayStoreLink(selectedAccordion);
    return link;
  }
}
