import { DeviceInfo } from '../shared/app.interfaces';
import { DeviceTypeEnum } from '../shared/enums';

export class DeviceUtils {
  static isPhoneOrTabletWeb(userAgent = '', platform = ''): boolean {
    const ua = userAgent.toLowerCase();
    const pf = platform.toLowerCase();

    if (DeviceUtils.isAndroidPhone(ua)) return true;
    if (DeviceUtils.isAndroidTablet(ua)) return true;

    if (DeviceUtils.isIPhone(ua, pf)) return true;
    if (DeviceUtils.isIPad(ua, pf)) return true;

    return false;
  }

  /**
   * Determines the web platform type for a given user.
   * @param userAgent The user agent string
   * @param platform The platform string
   * @returns The web platform type as a string 'web-mobile', 'web-desktop')
   */
  static getWebPlatform(userAgent = '', platform = ''): DeviceTypeEnum {
    const ua = userAgent.toLowerCase();
    const pf = platform.toLowerCase();

    return DeviceUtils.isPhoneOrTabletWeb(ua, pf)
      ? DeviceTypeEnum.WebMobile
      : DeviceTypeEnum.WebDesktop;
  }

  /**
   * Returns device information such as user agent, platform, and language.
   */
  static getDeviceInfo(): DeviceInfo {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
    };
  }

  /**
   * Determines the device model for a given user agent string.
   * @param userAgent The user agent string
   * @returns The device model as a string
   */
  static getModel(userAgent = ''): string {
    userAgent = (userAgent || '').toLowerCase();
    const model = DeviceUtils.getModelFromUserAgent(userAgent);
    const normalizedModel = model?.trim().toUpperCase() ?? '';

    if (!normalizedModel) {
      return '';
    }

    // Keep long model names readable without introducing leading/trailing spaces.
    return normalizedModel.length > 8
      ? `${normalizedModel.substring(0, 8)} ${normalizedModel.substring(8)}`
      : normalizedModel;
  }

  private static getModelFromUserAgent(userAgent: string): string | null {
    return (
      DeviceUtils.getAndroidModelFromUserAgent(userAgent) ||
      DeviceUtils.detectAppleDevice(userAgent)
    );
  }

  /**
   * Extracts the Android device model from the user agent string.
   * @param userAgent The user agent string
   * @returns The Android model name or null if not found
   */
  private static getAndroidModelFromUserAgent(
    userAgent: string,
  ): string | null {
    const ua = (userAgent || '').toLowerCase();
    const match = /android\s+[\d.]+;\s*([^;]+?)\s+build\//i.exec(ua);
    return match?.[1]?.trim() ?? null;
  }

  /**
   * Detects the Apple device type based on user agent and platform.
   * @param userAgent The user agent string
   * @param platform The platform string
   * @returns The Apple device type (iPhone, iPad, Mac) or null if not an Apple device
   */
  static detectAppleDevice(
    userAgent = navigator.userAgent,
    platform = navigator.platform,
  ): DeviceTypeEnum | null {
    const ua = userAgent.toLowerCase();
    const pf = platform.toLowerCase();

    if (DeviceUtils.isIPhone(userAgent, platform)) {
      return DeviceTypeEnum.iPhone;
    }
    if (DeviceUtils.isIPad(userAgent, platform)) {
      return DeviceTypeEnum.iPad;
    }

    if (/macintosh|mac os x/.test(ua) || /macintel/.test(pf)) {
      return DeviceTypeEnum.Mac;
    }

    return null;
  }

  /**
   * Determines if the device is an iPhone based on user agent and platform.
   * @param userAgent The user agent string
   * @param platform The platform string
   * @returns True if the device is an iPhone, false otherwise
   */
  static isIPhone(userAgent = '', platform = ''): boolean {
    const ua = userAgent.toLowerCase();
    const pf = platform.toLowerCase();

    return /iphone/.test(ua) || /iphone/.test(pf);
  }

  /**
   * Determines if the device is an iPad based on user agent and platform.
   * @param userAgent The user agent string
   * @param platform The platform string
   * @returns True if the device is an iPad, false otherwise
   */
  static isIPad(userAgent = '', platform = ''): boolean {
    const ua = userAgent.toLowerCase();
    const pf = platform.toLowerCase();

    if (/ipad/.test(ua) || /ipad/.test(pf)) {
      return true;
    }

    // Intentional tradeoff:
    // Real iPads in Safari desktop mode can report a Macintosh-style UA.
    // We intentionally classify Safari-on-Macintosh UAs as iPad so iPads are
    // not shown as Mac, accepting possible false positives for real Mac Safari.
    if (
      /macintosh|mac os x/.test(ua) &&
      /safari/.test(ua) &&
      !/(electron|chrome|crios|firefox|edg|opera|opr)/i.test(ua)
    ) {
      return true;
    }

    return false;
  }

  /**
   * Determines if the device is an Android phone based on user agent.
   * @param userAgent The user agent string
   * @returns True if the device is an Android phone, false otherwise
   */
  static isAndroidPhone(userAgent = ''): boolean {
    const ua = userAgent.toLowerCase();

    return /android.*mobile|windows phone|iemobile/.test(ua);
  }

  /**
   * Determines if the device is an Android tablet based on user agent.
   * @param userAgent The user agent string
   * @returns True if the device is an Android tablet, false otherwise
   */
  static isAndroidTablet(userAgent = ''): boolean {
    const ua = userAgent.toLowerCase();

    return /android/.test(ua) && !/mobile/.test(ua);
  }

  /*
   * Detects the device type based on user agent and platform.
   * @returns The detected device type as a DeviceTypeEnum value.
   */
  static detectDevice(): DeviceTypeEnum {
    const nav = navigator as any;
    const ua = navigator.userAgent || '';
    const platform = navigator.platform || '';
    const uaLower = ua.toLowerCase();

    // Prefer userAgentData when available
    if (nav.userAgentData) {
      const deviceFromUAD = DeviceUtils.getDeviceFromUserAgentData();
      if (deviceFromUAD) {
        return deviceFromUAD;
      }
    }

    // Fallback to UA + helper methods already in this class
    if (DeviceUtils.isIPhone(ua, platform)) return DeviceTypeEnum.iPhone;
    if (DeviceUtils.isIPad(ua, platform)) return DeviceTypeEnum.iPad;
    if (/windows phone|iemobile/.test(uaLower)) return DeviceTypeEnum.WinPhone;
    if (DeviceUtils.isAndroidPhone(ua)) return DeviceTypeEnum.AndroidPhone;
    if (DeviceUtils.isAndroidTablet(ua)) return DeviceTypeEnum.AndroidPad;

    // Default to web platform detection if no other device type matched
    return DeviceUtils.isPhoneOrTabletWeb(ua, platform)
      ? DeviceTypeEnum.WebMobile
      : DeviceTypeEnum.WebDesktop;
  }

  /*
   * Attempts to determine the device type using the User-Agent Client Hints API.
   * @returns The detected device type as a DeviceTypeEnum value, or null if it cannot be determined.
   */
  private static getDeviceFromUserAgentData(): DeviceTypeEnum | null {
    const nav = navigator as any;
    const ua = navigator.userAgent || '';
    const platform = navigator.platform || '';
    const uadPlatform = (nav.userAgentData?.platform || '')
      .toString()
      .toLowerCase();

    if (uadPlatform.includes('android')) {
      return nav.userAgentData.mobile === true
        ? DeviceTypeEnum.AndroidPhone
        : DeviceTypeEnum.AndroidPad;
    }
    if (uadPlatform.includes('iphone') || uadPlatform.includes('ios')) {
      return DeviceUtils.isIPhone(ua, platform)
        ? DeviceTypeEnum.iPhone
        : DeviceTypeEnum.iPad;
    }
    return null;
  }
}
