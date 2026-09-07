import { Injectable } from '@angular/core';
import { AppKey } from '../shared/GitHubConstants';

@Injectable({
  providedIn: 'root',
})
export class AppMetadataService {
  // maps keyed by APPS keys (e.g. 'IMAGE_TO_TEXT') for type-safety
  private readonly changeLogAppName: Partial<Record<AppKey, string>> = {
    IMAGE_TO_TEXT: 'CHANGELOG_IMAGE-TO-TEXT',
    IONIC_SETUP: 'CHANGELOG_IONIC-SETUP',
    MULTI_LANGUAGE_TRANSLATOR: 'CHANGELOG_MULTI-LANGUAGE-TRANSLATOR',
    QR_CODE_GENERATOR: 'CHANGELOG_QR-CODE',
    LANDING_PAGE: 'CHANGELOG_LANDING-PAGE',
    BACKEND_FUNCTIONS: 'CHANGELOG_BACKEND-FUNCTIONS',
  };

  private readonly webPartialAppName: Partial<Record<AppKey, string>> = {
    IMAGE_TO_TEXT: 'image-to-text',
    IONIC_SETUP: 'ionic-setup',
    MULTI_LANGUAGE_TRANSLATOR: 'translator',
    QR_CODE_GENERATOR: 'qr-code',
    LANDING_PAGE: '4070',
  };

  private readonly githubRepoName: Partial<Record<AppKey, string>> = {
    IMAGE_TO_TEXT: 'z-control-image-to-text',
    IONIC_SETUP: 'z-control-ionic-setup',
    MULTI_LANGUAGE_TRANSLATOR: 'z-control-multi-language-translator',
    QR_CODE_GENERATOR: 'z-control-qr-code-generator',
    LANDING_PAGE: 'z-control-landing-page',
    BACKEND_FUNCTIONS: 'z-control-backend-functions',
    BACKUP_SCRIPTS: 'z-control-Backup-Scripts',
    IONIC_ANGULAR21_VITEST_SETUP: 'ionic-angular21-vitest-setup'
  };

  private readonly playStoreAppName: Partial<Record<AppKey, string>> = {
    IMAGE_TO_TEXT: 'at.zcontrol.zoe.image-to-text',
    IONIC_SETUP: 'at.zcontrol.zoe.ionic-setup',
    MULTI_LANGUAGE_TRANSLATOR: 'at.zcontrol.zoe.translator',
    QR_CODE_GENERATOR: 'at.zcontrol.zoe.qrcodeapp',
  };

  // mapping from APPS keys to privacy policy folder names
  private readonly policyNames: Partial<Record<AppKey, string>> = {
    IMAGE_TO_TEXT: 'image-to-text',
    IONIC_SETUP: 'ionic-setup',
    MULTI_LANGUAGE_TRANSLATOR: 'multi-language-translator',
    QR_CODE_GENERATOR: 'qr-code-generator',
    LANDING_PAGE: 'landing-page',
  };

  /**
   * Returns the changelog path for the specified accordion.
   * @param selectedAccordion The key of the selected accordion
   * @returns The changelog path for the specified accordion
   */
  getChangeLogPath(selectedAccordion: AppKey): string {
    const name = this.changeLogAppName[selectedAccordion] ?? '';
    return name ? `assets/logs/change-logs/${name}.md` : '';
  }

  /**
   * Returns the web link path for the specified accordion.
   * @param selectedAccordion The key of the selected accordion
   * @returns The web link path for the specified accordion
   */
  getWebLink(selectedAccordion: AppKey): string {
    const partial = this.webPartialAppName[selectedAccordion] ?? '';
    return partial ? `https://z-control-${partial}.web.app` : '';
  }

  /**
   * Returns the source link path for the specified accordion.
   * @param selectedAccordion The key of the selected accordion
   * @returns The source link path for the specified accordion
   */
  getSourceLink(selectedAccordion: AppKey): string {
    const repo = this.githubRepoName[selectedAccordion] ?? '';
    return repo ? `https://github.com/zoechbauer/${repo}` : '';
  }

  /**
   * Returns the Play Store link path for the specified accordion.
   * @param selectedAccordion The key of the selected accordion
   * @returns The Play Store link path for the specified accordion
   */
  getPlayStoreLink(selectedAccordion: AppKey): string {
    const appId = this.playStoreAppName[selectedAccordion] ?? '';
    return appId
      ? `https://play.google.com/store/apps/details?id=${appId}`
      : '';
  }


  /**
   * Returns the privacy policy folder name for the specified accordion.
   * @param selectedAccordion The key of the selected accordion
   * @returns The privacy policy folder name for the specified accordion, or undefined if not found
   */
  getPolicyName(selectedAccordion: AppKey): string | undefined {
    return this.policyNames[selectedAccordion];
  }
}
