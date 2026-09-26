import {
  inject,
  Injectable,
  Injector,
  runInInjectionContext,
} from '@angular/core';
import * as angularFireAuth from '@angular/fire/auth';
import { Functions, httpsCallable } from '@angular/fire/functions';

import { FirebaseFirestoreAuthWrapperService } from './firebase-firestore-auth-wrapper.service';
import { LocalStorageService } from './local-storage.service';
import { DeviceUtils } from './device-utils.service';
import { FireStoreConstants } from '../shared/firestore.constants';
import { EventEnum } from '../shared/enums';

@Injectable({ providedIn: 'root' })
export class FirebaseFirestoreLandingPageVisitService {
  private readonly injector = inject(Injector);
  private readonly functions = inject(Functions);
  private readonly auth = inject(angularFireAuth.Auth);
  private readonly authWrapper = inject(FirebaseFirestoreAuthWrapperService);
  private readonly localStorageService = inject(LocalStorageService);

  private user!: angularFireAuth.User;
  private lang?: string;

  constructor() {
    this.injector = inject(Injector);
    this.localStorageService.selectedLanguage$.subscribe((lang) => {
      this.lang = lang;
    });
  }

  /**
   * Initializes the Firebase Firestore service by authenticating the user
   */
  async init() {
    await this.authenticateUser();
  }

  /**
   * Authenticates the user and sets up user mapping and control flags for web and native platforms.
   *
   * - First waits until Firebase Auth state restoration is complete, so browser refresh does not
   *   accidentally create a new anonymous UID.
   * - On web: Uses Firebase Auth as the source of truth. If a persisted user exists, it reuses that
   *   user and updates local storage with the same UID. If no user exists, it signs in anonymously.
   * - On native: Uses Firebase Auth persistence and signs in anonymously only when needed.
   *
   * After authentication, it ensures backend control data is initialized and programmer-device
   * mapping is updated.
   */
  private async authenticateUser() {
    // Wait until Firebase Auth persistence restore finishes.
    // Otherwise, currentUser can be temporarily null right after browser refresh,
    // which can create a new anonymous UID unnecessarily.
    await this.waitForAuthReady();
    try {
      // Web: Use Firebase Auth as source of truth (not localStorage UID).
      if (this.auth.currentUser) {
        this.user = this.auth.currentUser;
        if (this.user?.uid) {
          await this.saveUserIdToLocalStorage(this.user.uid);
        }
      } else {
        // No restored session available -> sign in anonymously once.
        await runInInjectionContext(this.injector, () =>
          this.signInAnonymously(),
        );
      }

      // Optional: force token refresh once before callable functions
      // to reduce "unauthenticated" races for very early calls.
      if (this.auth.currentUser) {
        await this.auth.currentUser.getIdToken(true);
      }
    } catch (error) {
      console.error('Error during Firebase authentication:', error);
    }
  }

  /**
   * Waits for Firebase Auth state restoration to complete.
   * Uses authStateReady() when available, falls back to one-shot onAuthStateChanged.
   */
  private async waitForAuthReady(): Promise<void> {
    const authAny = this.auth as any;
    if (typeof authAny.authStateReady === 'function') {
      await authAny.authStateReady();
      return;
    }

    await new Promise<void>((resolve) => {
      const unsub = this.authWrapper.onAuthStateChanged(this.auth, () => {
        unsub();
        resolve();
      });
    });
  }

  /**
   * Signs in the user anonymously using Firebase Auth if not already signed in.
   * Sets the user property to the authenticated user and adds the user to the user mapping if needed.
   * Logs the UID and whether the user was newly signed in or already authenticated.
   *
   * Used for both web and native platforms, but on web, localStorage UID logic is handled separately in init().
   */
  private async signInAnonymously(): Promise<void> {
    if (!this.auth.currentUser) {
      const result = await runInInjectionContext(this.injector, () =>
        this.authWrapper.signInAnonymously(this.auth),
      );
      this.user = (result as any).user;
    } else {
      this.user = this.auth.currentUser;
    }
    this.saveUserIdToLocalStorage(this.user.uid);
  }

  /**
   * Saves the authenticated user's UID to localStorage using the LocalStorageService.
   * This allows the web version to restore the same user on page refresh instead of creating a new anonymous user.
   * On native platforms, Firebase Auth handles persistence, so this is primarily for web usage.
   * This enables marking the current user in the statistics grid.
   *
   * @param uid The UID of the authenticated user to save to localStorage
   */
  private async saveUserIdToLocalStorage(uid: string): Promise<void> {
    try {
      await runInInjectionContext(this.injector, () =>
        this.localStorageService.saveFirestoreUid(uid),
      );
    } catch (error) {
      console.error('Error saving user UID to localStorage:', error);
    }
  }

  /**
   * Logs a landing page visit to Firebase using a callable function.
   * @param analyticsEnabled Whether analytics is enabled for this visit.
   */
  async logLandingPageVisit(
    analyticsEnabled: boolean,
    event: EventEnum,
  ): Promise<void> {
    const callable = runInInjectionContext(this.injector, () =>
      this.getHttpsCallable('logLandingPageVisit'),
    );

    try {
      await runInInjectionContext(this.injector, () =>
        (callable as any)({
          appId: FireStoreConstants.APP_ID,
          analyticsEnabled,
          device: DeviceUtils.detectDevice(),
          event,
          language: this.lang,
        }),
      );
    } catch (err) {
      console.error('logLandingPageVisit failed', err);
    }
  }

  private getHttpsCallable(functionName: string) {
    return httpsCallable(this.functions, functionName);
  }
}
