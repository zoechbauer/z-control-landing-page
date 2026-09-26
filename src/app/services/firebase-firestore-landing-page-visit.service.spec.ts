import { TestBed } from '@angular/core/testing';
import * as angularFireAuth from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { Functions } from '@angular/fire/functions';
import { of } from 'rxjs';

import { FirebaseFirestoreLandingPageVisitService } from './firebase-firestore-landing-page-visit.service';
import { FirebaseFirestoreAuthWrapperService } from './firebase-firestore-auth-wrapper.service';
import { LocalStorageService } from './local-storage.service';
import { EventEnum } from '../shared/enums';
import { UtilsService } from './utils.service';

describe('FirebaseFirestoreLandingPageVisitService', () => {
  let service: FirebaseFirestoreLandingPageVisitService;

  const userStub: angularFireAuth.User = {
    uid: 'anonymous-uid',
    emailVerified: false,
    isAnonymous: true,
    metadata: {} as any,
    providerData: [],
    refreshToken: '',
    tenantId: null,
    delete: () => Promise.resolve(),
    getIdToken: () => Promise.resolve('token'),
    getIdTokenResult: () => Promise.resolve({} as any),
    reload: () => Promise.resolve(),
    toJSON: () => ({}),
    displayName: null,
    email: null,
    phoneNumber: null,
    photoURL: null,
    providerId: '',
  };

  let _currentUser: angularFireAuth.User | null = userStub;
  const authMock: any = {};
  Object.defineProperty(authMock, 'currentUser', {
    get: () => _currentUser,
    set: (val) => {
      _currentUser = val;
    },
    configurable: true,
  });

  let authStateCallback: Function | null = null;

  const authWrapperMock = {
    signInAnonymously: jasmine.createSpy('signInAnonymously').and.resolveTo({
      user: userStub,
      providerId: null,
      operationType: 'signIn',
    }),
    onAuthStateChanged: jasmine
      .createSpy('onAuthStateChanged')
      .and.callFake((auth: any, callback: Function) => {
        authStateCallback = callback;
        return () => {};
      }),
  };

  const firestoreMock = {} as Firestore;
  const functionsMock = {} as Functions;

  const localStorageServiceMock = {
    firestoreUid$: of('anonymous-uid'),
    selectedLanguage$: of('en'),
    saveFirestoreUid: jasmine
      .createSpy('saveFirestoreUid')
      .and.resolveTo(undefined),
  };
  const utilsServiceMock = {
    isNativeApp: false,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: FirebaseFirestoreAuthWrapperService,
          useValue: authWrapperMock,
        },
        { provide: angularFireAuth.Auth, useValue: authMock },
        { provide: Firestore, useValue: firestoreMock },
        { provide: Functions, useValue: functionsMock },
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: UtilsService, useValue: utilsServiceMock },
      ],
    });
    service = TestBed.inject(FirebaseFirestoreLandingPageVisitService);
  
    authWrapperMock.signInAnonymously.calls.reset();
    localStorageServiceMock.saveFirestoreUid.calls.reset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('init', () => {
    it('should call authenticateUser', async () => {
      spyOn<any>(service, 'authenticateUser').and.resolveTo();

      await service.init();

      expect((service as any).authenticateUser).toHaveBeenCalled();
    });
  });

  describe('signInAnonymously', () => {
    it('should sign in anonymously if user is not signed in', async () => {
      authMock.currentUser = null;

      await (service as any).signInAnonymously();

      expect(authWrapperMock.signInAnonymously).toHaveBeenCalledWith(authMock);
      expect(localStorageServiceMock.saveFirestoreUid).toHaveBeenCalledWith(
        'anonymous-uid',
      );
    });

    it('should not call signInAnonymously if user is already signed in', async () => {
      authMock.currentUser = userStub;

      await (service as any).signInAnonymously();

      expect(authWrapperMock.signInAnonymously).not.toHaveBeenCalled();
      expect(localStorageServiceMock.saveFirestoreUid).toHaveBeenCalledWith(
        'anonymous-uid',
      );
    });
  });

  describe('saveUserIdToLocalStorage', () => {
    it('should save the user UID to localStorage', async () => {
      const testUid = 'test-uid';

      await (service as any).saveUserIdToLocalStorage(testUid);

      expect(localStorageServiceMock.saveFirestoreUid).toHaveBeenCalledWith(
        testUid,
      );
    });

    it('should log error if saving to localStorage fails', async () => {
      spyOn(console, 'error');
      const testUid = 'test-uid';
      localStorageServiceMock.saveFirestoreUid.and.throwError(
        'localStorage save failed',
      );

      await (service as any).saveUserIdToLocalStorage(testUid);

      expect(console.error).toHaveBeenCalledWith(
        'Error saving user UID to localStorage:',
        jasmine.any(Error),
      );
    });
  });

  describe('authenticateUser', () => {
    it('should reuse existing web user, add user, save uid and run setup calls', async () => {
      const getIdTokenSpy = jasmine
        .createSpy('getIdToken')
        .and.resolveTo('token');
      authMock.currentUser = {
        ...userStub,
        uid: 'anonymous-uid',
        getIdToken: getIdTokenSpy,
      } as any;

      const waitForAuthReadySpy = spyOn<any>(
        service,
        'waitForAuthReady',
      ).and.resolveTo();
      const signInAnonymouslySpy = spyOn<any>(
        service,
        'signInAnonymously',
      ).and.resolveTo();

      await (service as any).authenticateUser();

      expect(waitForAuthReadySpy).toHaveBeenCalled();
      expect(localStorageServiceMock.saveFirestoreUid).toHaveBeenCalledWith(
        'anonymous-uid',
      );
      expect(getIdTokenSpy).toHaveBeenCalledWith(true);
      expect(signInAnonymouslySpy).not.toHaveBeenCalled();
    });

    it('should not add or save uid when current user has no uid, but still run setup calls', async () => {
      const getIdTokenSpy = jasmine
        .createSpy('getIdToken')
        .and.resolveTo('token');
      authMock.currentUser = {
        ...userStub,
        uid: undefined,
        getIdToken: getIdTokenSpy,
      } as any;

      spyOn<any>(service, 'waitForAuthReady').and.resolveTo();

      await (service as any).authenticateUser();

      expect(localStorageServiceMock.saveFirestoreUid).not.toHaveBeenCalled();
      expect(getIdTokenSpy).toHaveBeenCalledWith(true);
    });

    it('should call signInAnonymously when no web user exists', async () => {
      authMock.currentUser = null;

      spyOn<any>(service, 'waitForAuthReady').and.resolveTo();
      const signInAnonymouslySpy = spyOn<any>(
        service,
        'signInAnonymously',
      ).and.resolveTo();

      await (service as any).authenticateUser();

      expect(signInAnonymouslySpy).toHaveBeenCalled();
    });

    it('should log error if signInAnonymously fails', async () => {
      spyOn(console, 'error');
      authMock.currentUser = null;

      spyOn<any>(service, 'waitForAuthReady').and.resolveTo();
      spyOn<any>(service, 'signInAnonymously').and.rejectWith(
        new Error('signInAnonymously failed'),
      );

      await (service as any).authenticateUser();

      expect(console.error).toHaveBeenCalledWith(
        'Error during Firebase authentication:',
        jasmine.any(Error),
      );
    });
  });

  describe('waitForAuthReady', () => {
    afterEach(() => {
      delete (service as any).auth.authStateReady;
    });

    it('should use authStateReady when available', async () => {
      const authStateReadySpy = jasmine
        .createSpy('authStateReady')
        .and.resolveTo();
      (service as any).auth.authStateReady = authStateReadySpy;

      await (service as any).waitForAuthReady();

      expect(authStateReadySpy).toHaveBeenCalled();
      expect(authWrapperMock.onAuthStateChanged).not.toHaveBeenCalled();
    });

    it('should fall back to onAuthStateChanged and unsubscribe after callback', async () => {
      const unsubSpy = jasmine.createSpy('unsub');

      authWrapperMock.onAuthStateChanged.and.callFake(
        (_auth: any, cb: Function) => {
          Promise.resolve().then(() => cb());
          return unsubSpy;
        },
      );

      await (service as any).waitForAuthReady();

      expect(authWrapperMock.onAuthStateChanged).toHaveBeenCalled();
      expect(unsubSpy).toHaveBeenCalled();
    });

    xit('should resolve via timeout fallback and unsubscribe if callback never fires', async () => {
      jasmine.clock().install();
      try {
        const unsubSpy = jasmine.createSpy('unsub');

        authWrapperMock.onAuthStateChanged.and.callFake(
          (_auth: any, _cb: Function) => unsubSpy,
        );

        const waitPromise = (service as any).waitForAuthReady();

        expect(authWrapperMock.onAuthStateChanged).toHaveBeenCalled();
        expect(unsubSpy).not.toHaveBeenCalled();

        jasmine.clock().tick(3000);
        await waitPromise;

        expect(unsubSpy).toHaveBeenCalledTimes(1);
      } finally {
        jasmine.clock().uninstall();
      }
    });
  });

  describe('wrapper coverage via public methods', () => {
    describe('getHttpsCallable', () => {
      it('should execute getHttpsCallable path in logLandingPageVisit and handle failure', async () => {
        spyOn(console, 'error');
        spyOn<any>(service, 'getHttpsCallable').and.returnValue(() => 
          Promise.reject(new Error('Test error')));

        await service.logLandingPageVisit(false, EventEnum.APP_START);

        expect(console.error).toHaveBeenCalledWith(
          'logLandingPageVisit failed',
          jasmine.any(Error)
        );
      });
    });
  });
});
