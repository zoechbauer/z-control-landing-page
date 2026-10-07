import { TestBed } from '@angular/core/testing';

import { AppMetadataService } from './app-metadata.service';
import { APP_KEYS } from '../shared/github.constants';

describe('AppMetadataService', () => {
  let service: AppMetadataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppMetadataService);
  });

  describe('getChangeLogPath', () => {
    const testCases = [
      {
        key: APP_KEYS.IMAGE_TO_TEXT as any,
        expected: 'assets/logs/change-logs/CHANGELOG_IMAGE-TO-TEXT.md',
      },
      {
        key: APP_KEYS.IONIC_SETUP as any,
        expected: 'assets/logs/change-logs/CHANGELOG_IONIC-SETUP.md',
      },
      {
        key: APP_KEYS.MULTI_LANGUAGE_TRANSLATOR as any,
        expected:
          'assets/logs/change-logs/CHANGELOG_MULTI-LANGUAGE-TRANSLATOR.md',
      },
      {
        key: APP_KEYS.QR_CODE_GENERATOR as any,
        expected: 'assets/logs/change-logs/CHANGELOG_QR-CODE.md',
      },
      {
        key: APP_KEYS.LANDING_PAGE as any,
        expected: 'assets/logs/change-logs/CHANGELOG_LANDING-PAGE.md',
      },
      {
        key: APP_KEYS.BACKEND_FUNCTIONS as any,
        expected: 'assets/logs/change-logs/CHANGELOG_BACKEND-FUNCTIONS.md',
      },
      { key: APP_KEYS.BACKUP_SCRIPTS as any, expected: '' },
      { key: 'INVALID' as any, expected: '' },
    ];

    it('returns expected changelog path for all app keys', () => {
      testCases.forEach(({ key, expected }) => {
        const result = service.getChangeLogPath(key);
        expect(result).withContext(`Failed for key: ${key}`).toBe(expected);
      });
    });
  });

  describe('getWebLink', () => {
    const testCases = [
      {
        key: APP_KEYS.IMAGE_TO_TEXT as any,
        expected: 'https://z-control-image-to-text.web.app',
      },
      {
        key: APP_KEYS.IONIC_SETUP as any,
        expected: 'https://z-control-ionic-setup.web.app',
      },
      {
        key: APP_KEYS.MULTI_LANGUAGE_TRANSLATOR as any,
        expected: 'https://z-control-translator.web.app',
      },
      {
        key: APP_KEYS.QR_CODE_GENERATOR as any,
        expected: 'https://z-control-qr-code.web.app',
      },
      {
        key: APP_KEYS.LANDING_PAGE as any,
        expected: 'https://z-control-4070.web.app',
      },
      {
        key: APP_KEYS.BACKEND_FUNCTIONS as any,
        expected: '',
      },
      { key: APP_KEYS.BACKUP_SCRIPTS as any, expected: '' },
      { key: 'INVALID' as any, expected: '' },
    ];

    it('returns expected web link for all app keys', () => {
      testCases.forEach(({ key, expected }) => {
        const result = service.getWebLink(key);
        expect(result).withContext(`Failed for key: ${key}`).toBe(expected);
      });
    });
  });

  describe('getSourceLink', () => {
    const testCases = [
      {
        key: APP_KEYS.IMAGE_TO_TEXT as any,
        expected: 'https://github.com/zoechbauer/z-control-image-to-text',
      },
      {
        key: APP_KEYS.IONIC_SETUP as any,
        expected: 'https://github.com/zoechbauer/z-control-ionic-setup',
      },
      {
        key: APP_KEYS.MULTI_LANGUAGE_TRANSLATOR as any,
        expected: 'https://github.com/zoechbauer/z-control-multi-language-translator',
      },
      {
        key: APP_KEYS.QR_CODE_GENERATOR as any,
        expected: 'https://github.com/zoechbauer/z-control-qr-code-generator',
      },
      {
        key: APP_KEYS.LANDING_PAGE as any,
        expected: 'https://github.com/zoechbauer/z-control-landing-page',
      },
      {
        key: APP_KEYS.BACKEND_FUNCTIONS as any,
        expected: 'https://github.com/zoechbauer/z-control-backend-functions',
      },
      { key: APP_KEYS.BACKUP_SCRIPTS as any, expected: 'https://github.com/zoechbauer/z-control-Backup-Scripts' },
      { key: 'INVALID' as any, expected: '' },
    ];

    it('returns expected GitHub URL for all app keys', () => {
      testCases.forEach(({ key, expected }) => {
        const result = service.getSourceLink(key);
        expect(result).withContext(`Failed for key: ${key}`).toBe(expected);
      });
    });
  });

  describe('getPlayStoreLink', () => {
    const testCases = [
      {
        key: APP_KEYS.IMAGE_TO_TEXT as any,
        expected: 'https://play.google.com/store/apps/details?id=at.zcontrol.zoe.image-to-text',
      },
      {
        key: APP_KEYS.IONIC_SETUP as any,
        expected: 'https://play.google.com/store/apps/details?id=at.zcontrol.zoe.ionic-setup',
      },
      {
        key: APP_KEYS.MULTI_LANGUAGE_TRANSLATOR as any,
        expected: 'https://play.google.com/store/apps/details?id=at.zcontrol.zoe.translator',
      },
      {
        key: APP_KEYS.QR_CODE_GENERATOR as any,
        expected: 'https://play.google.com/store/apps/details?id=at.zcontrol.zoe.qrcodeapp',
      },
      {
        key: APP_KEYS.LANDING_PAGE as any,
        expected: '',
      },
      {
        key: APP_KEYS.BACKEND_FUNCTIONS as any,
        expected: '',
      },
      { key: APP_KEYS.BACKUP_SCRIPTS as any, expected: '' },
      { key: 'INVALID' as any, expected: '' },
    ];

    it('returns expected Play Store URL for all app keys', () => {
      testCases.forEach(({ key, expected }) => {
        const result = service.getPlayStoreLink(key);
        expect(result).withContext(`Failed for key: ${key}`).toBe(expected);
      });
    });
  });

  describe('getPolicyName', () => {
    const testCases = [
      {
        key: APP_KEYS.IMAGE_TO_TEXT as any,
        expected: 'image-to-text',
      },
      {
        key: APP_KEYS.IONIC_SETUP as any,
        expected: 'ionic-setup',
      },
      {
        key: APP_KEYS.MULTI_LANGUAGE_TRANSLATOR as any,
        expected: 'multi-language-translator',
      },
      {
        key: APP_KEYS.QR_CODE_GENERATOR as any,
        expected: 'qr-code-generator',
      },
      {
        key: APP_KEYS.LANDING_PAGE as any,
        expected: 'landing-page',
      },
      {
        key: APP_KEYS.BACKEND_FUNCTIONS as any,
        expected: undefined,
      },
      { key: APP_KEYS.BACKUP_SCRIPTS as any, expected: undefined },
      { key: 'INVALID' as any, expected: undefined },
    ];

    it('returns folder name for all app keys', () => {
      testCases.forEach(({ key, expected }) => {
        const result = service.getPolicyName(key);
        expect(result).withContext(`Failed for key: ${key}`).toBe(expected);
      });
    });
  });
});
