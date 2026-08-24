import { Subject, of } from 'rxjs';

export function createUtilsServiceMock(overrides: Partial<any> = {}) {
  const logoClickedSub = new Subject<boolean>();
  const openFirebaseAnalyticsSub = new Subject<boolean>();

  const mock = {
    get isSmallScreen() { return false; },
    isShowIonTabBar: false,
    navigateToTab: jasmine.createSpy('navigateToTab'),
    showOrHideIonTabBar: jasmine.createSpy('showOrHideIonTabBar'),
    navigateToTabWithParams: jasmine.createSpy('navigateToTabWithParams'),
    onLogoClicked: jasmine.createSpy('onLogoClicked').and.callFake(() => logoClickedSub.next(true)),
    openHelpModal: jasmine.createSpy('openHelpModal').and.returnValue(Promise.resolve()),
    openGitHubAnalytics: jasmine
      .createSpy('openGitHubAnalytics')
      .and.returnValue(Promise.resolve()),
    logoClickedSub,
    logoClicked$: logoClickedSub.asObservable(),
    openFirebaseAnalyticsSub,
    openFirebaseAnalytics$: openFirebaseAnalyticsSub.asObservable(),
    // allow test-specific overrides
    ...overrides,
  };

  return mock;
}