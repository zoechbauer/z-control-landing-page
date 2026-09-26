import { DeviceUtils } from './device-utils.service';
import { DeviceTypeEnum } from '../shared/enums';

// Real-world UAs used in multiple tests
const iPhoneUa =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 26_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) ' +
  'CriOS/147.0.7727.47 Mobile/15E148 Safari/604.1';

const iPadSafariWebUa1 =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) ' +
  'Version/18.7.5 Safari/605.1.15';

const iPadSafariWebUa2 =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) ' +
  'Version/16.6.2 Safari/605.1.15';

const SamsungGalaxyA33NativeUa =
  'Mozilla/5.0 (Linux; Android 16; SM-A336B Build/BP2A.250605.031.A3; wv) AppleWebKit/537.36 (KHTML, like Gecko) ' +
  'Version/4.0 Chrome/146.0.7680.177 Mobile Safari/537.36';

const SamsungGalaxyA33WebUa =
  'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36';

const SamsungGalaxyTabA7NativeUa =
  'Mozilla/5.0 (Linux; Android 11; SM-T505 Build/RP1A.200720.012; wv) AppleWebKit/537.36 (KHTML, like Gecko) ' +
  'Version/4.0 Chrome/146.0.7680.177 Safari/537.36';

const SamsungGalaxyTabA7WebUa =
  'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36';

const winPhoneUa =
  'Mozilla/5.0 (Windows Phone 10.0; Microsoft; Lumia 950 XL) AppleWebKit/537.36 (KHTML, like Gecko) Edge/15.15063 Mobile Safari/537.36';

describe('DeviceUtils', () => {
  const originalNavigator = navigator;

  function mockNavigator(value: Partial<Navigator & { userAgentData?: any }>) {
    try {
      spyOnProperty(window, 'navigator', 'get').and.returnValue(value as any);
    } catch {
      // fallback for environments where spyOnProperty can't replace navigator
      (window as any).navigator = value;
    }
  }

  afterEach(() => {
    try {
      (
        spyOnProperty(window, 'navigator', 'get') as unknown as jasmine.Spy
      ).and.callThrough();
    } catch {
      try {
        Object.defineProperty(window, 'navigator', {
          value: originalNavigator,
          configurable: true,
        });
      } catch {
        // ignore if can't restore
      }
    }
  });

  describe('basic detectors', () => {
    it('isIPhone should detect iPhone from UA', () => {
      expect(DeviceUtils.isIPhone(iPhoneUa, '')).toBeTrue();
      expect(DeviceUtils.isIPhone('', 'iPhone')).toBeTrue();
    });

    it('isIPad should detect iPad (classical and Safari Desktop UA)', () => {
      const classic =
        'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) Mobile Safari/604.1';
      expect(DeviceUtils.isIPad(classic, '')).toBeTrue();
      expect(DeviceUtils.isIPad(iPadSafariWebUa1, 'MacIntel')).toBeTrue();
      expect(DeviceUtils.isIPad(iPadSafariWebUa2, '')).toBeTrue();
    });

    it('isAndroidPhone should detect Android phones', () => {
      expect(DeviceUtils.isAndroidPhone(SamsungGalaxyA33NativeUa)).toBeTrue();
      expect(DeviceUtils.isAndroidPhone(SamsungGalaxyA33WebUa)).toBeTrue();
      expect(DeviceUtils.isAndroidPhone(SamsungGalaxyTabA7WebUa)).toBeFalse();
    });

    it('isAndroidTablet should detect Android tablets', () => {
      expect(
        DeviceUtils.isAndroidTablet(SamsungGalaxyTabA7NativeUa),
      ).toBeTrue();
      expect(DeviceUtils.isAndroidTablet(SamsungGalaxyTabA7WebUa)).toBeTrue();
      expect(DeviceUtils.isAndroidTablet(SamsungGalaxyA33WebUa)).toBeFalse();
    });
  });

  describe('detectAppleDevice', () => {
    it('should return iPhone for iPhone UA', () => {
      expect(DeviceUtils.detectAppleDevice(iPhoneUa, '')).toBe(
        DeviceTypeEnum.iPhone,
      );
    });

    it('should return iPad for Safari-on-Mac UAs (heuristic)', () => {
      expect(DeviceUtils.detectAppleDevice(iPadSafariWebUa1, 'MacIntel')).toBe(
        DeviceTypeEnum.iPad,
      );
      expect(DeviceUtils.detectAppleDevice(iPadSafariWebUa2, '')).toBe(
        DeviceTypeEnum.iPad,
      );
    });

    it('should return Mac for non-Safari Mac browsers', () => {
      const firefoxMac =
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/109.0';
      expect(DeviceUtils.detectAppleDevice(firefoxMac, 'MacIntel')).toBe(
        DeviceTypeEnum.Mac,
      );
    });
  });

  describe('getWebPlatform / isPhoneOrTabletWeb', () => {
    it('getWebPlatform returns WebMobile for mobile UAs', () => {
      expect(DeviceUtils.getWebPlatform(iPhoneUa)).toBe(
        DeviceTypeEnum.WebMobile,
      );
      expect(DeviceUtils.getWebPlatform(iPadSafariWebUa1)).toBe(
        DeviceTypeEnum.WebMobile,
      );
      expect(DeviceUtils.getWebPlatform(SamsungGalaxyA33WebUa)).toBe(
        DeviceTypeEnum.WebMobile,
      );
      expect(DeviceUtils.getWebPlatform(SamsungGalaxyTabA7WebUa)).toBe(
        DeviceTypeEnum.WebMobile,
      );
    });

    it('getWebPlatform returns WebDesktop for desktop UAs', () => {
      const winChrome =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
      expect(DeviceUtils.getWebPlatform(winChrome, 'Win32')).toBe(
        DeviceTypeEnum.WebDesktop,
      );
    });
  });

  describe('getDeviceInfo', () => {
    it('getDeviceInfo returns navigator fields', () => {
      const info = DeviceUtils.getDeviceInfo();
      expect(info).toEqual(
        jasmine.objectContaining({
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          language: navigator.language,
        }),
      );
    });
  });

  describe('getModel', () => {
    it('extracts and normalizes Android model', () => {
      const ua =
        'Mozilla/5.0 (Linux; Android 14; sm-a556b Build/UP1A.231005.007)';
      expect(DeviceUtils.getModel(ua)).toBe('SM-A556B');
    });

    it('formats long model names with a space at position 8', () => {
      const ua =
        'Mozilla/5.0 (Linux; Android 14; samsung a53 5g Build/UP1A.231005.007)';
      expect(DeviceUtils.getModel(ua)).toBe('SAMSUNG  A53 5G');
    });

    it('returns empty string when no model found', () => {
      expect(DeviceUtils.getModel('')).toBe('');
      expect(DeviceUtils.getModel('some random ua without model')).toBe('');
    });
  });

  describe('detectDevice (full fallback and UAC hints)', () => {
    it('prefers userAgentData android mobile → AndroidPhone', () => {
      mockNavigator({
        userAgent: '',
        platform: '',
        userAgentData: { platform: 'Android', mobile: true },
      });
      expect(DeviceUtils.detectDevice()).toBe(DeviceTypeEnum.AndroidPhone);
    });

    it('prefers userAgentData android tablet → AndroidPad', () => {
      mockNavigator({
        userAgent: '',
        platform: '',
        userAgentData: { platform: 'Android', mobile: false },
      });
      expect(DeviceUtils.detectDevice()).toBe(DeviceTypeEnum.AndroidPad);
    });

    it('prefers userAgentData iphone → iPhone', () => {
      mockNavigator({
        userAgent: '',
        platform: 'iPhone',
        userAgentData: { platform: 'iPhone', mobile: true },
      });
      expect(DeviceUtils.detectDevice()).toBe(DeviceTypeEnum.iPhone);
    });

    it('detects iPad from iPad Safari desktop UA via IPad heuristics', () => {
      mockNavigator({ userAgent: iPadSafariWebUa1, platform: '' });
      expect(DeviceUtils.detectDevice()).toBe(DeviceTypeEnum.iPad);
    });

    it('detects Android phone from Samsung Galaxy A33 via UA', () => {
      mockNavigator({ userAgent: SamsungGalaxyA33WebUa, platform: '' });
      expect(DeviceUtils.detectDevice()).toBe(DeviceTypeEnum.AndroidPhone);
    });

    it('detects Android tab from Samsung Galaxy TabA7 via UA', () => {
      mockNavigator({ userAgent: SamsungGalaxyTabA7WebUa, platform: '' });
      expect(DeviceUtils.detectDevice()).toBe(DeviceTypeEnum.AndroidPad);
    });

    it('detects Windows Phone when UA contains windows phone', () => {
      mockNavigator({ userAgent: winPhoneUa, platform: '' });
      expect(DeviceUtils.detectDevice()).toBe(DeviceTypeEnum.WinPhone);
    });

    it('falls back to UA when userAgentData is non-diagnostic', () => {
      mockNavigator({
        userAgent: iPhoneUa,
        platform: '',
        userAgentData: { platform: '' },
      });
      expect(DeviceUtils.detectDevice()).toBe(DeviceTypeEnum.iPhone);
    });

    it('uses platform when userAgent is empty', () => {
      mockNavigator({ userAgent: '', platform: 'iPhone' });
      expect(DeviceUtils.detectDevice()).toBe(DeviceTypeEnum.iPhone);
    });

    it('returns WebDesktop when both UA and platform are empty (defaults to desktop)', () => {
      mockNavigator({ userAgent: '', platform: '' });
      // empty UA + platform should run fallback; treat as desktop
      expect(DeviceUtils.detectDevice()).toBe(DeviceTypeEnum.WebDesktop);
    });
  });
});
