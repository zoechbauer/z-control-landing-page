import { Injectable } from '@angular/core';
import * as angularFireAuth from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class FirebaseFirestoreAuthWrapperService {
  
  /**
   * Signs in the user anonymously.
   * @param auth The AngularFireAuth instance
   * @returns A promise that resolves with the user credentials
   */
  signInAnonymously(auth: angularFireAuth.Auth) {
    return angularFireAuth.signInAnonymously(auth);
  }

  /**
   * Registers a callback to be invoked whenever the authentication state changes.
   * @param auth The AngularFireAuth instance
   * @param callback The callback function to handle the authentication state change
   * @returns A function to unsubscribe from the authentication state changes
   */
  onAuthStateChanged(
    auth: angularFireAuth.Auth,
    callback: (user: angularFireAuth.User | null) => void
  ) {
    return angularFireAuth.onAuthStateChanged(auth, callback);
  }

  // For unit testing only: create a mockable instance
  static createForTesting(
    signInAnonymouslyImpl: typeof angularFireAuth.signInAnonymously,
    onAuthStateChangedImpl: typeof angularFireAuth.onAuthStateChanged
  ) {
    const inst = new FirebaseFirestoreAuthWrapperService();
    (inst.signInAnonymously as any) = signInAnonymouslyImpl;
    (inst.onAuthStateChanged as any) = onAuthStateChangedImpl;
    return inst;
  }
}
