import { inject, Injectable, InjectionToken } from '@angular/core';
import { connectFirestoreEmulator, doc, getDoc } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';

export const FIRESTORE_CONNECT_EMULATOR = new InjectionToken('FIRESTORE_CONNECT_EMULATOR', {
  factory: () => connectFirestoreEmulator,
});

export const FIRESTORE_GET_DOC = new InjectionToken('FIRESTORE_GET_DOC', {
  factory: () => getDoc,
});

export const FIRESTORE_DOC = new InjectionToken('FIRESTORE_DOC', {
  factory: () => doc,
});

@Injectable({ providedIn: 'root' })
export class FirestoreAdapterService {
  private readonly firestore = inject(Firestore);

  private readonly connectEmulatorFn = inject(FIRESTORE_CONNECT_EMULATOR);
  private readonly getDocFn = inject(FIRESTORE_GET_DOC);
  private readonly docFn = inject(FIRESTORE_DOC);

  async getDocSnapshot(collectionName: string, repo: string) {
    const docRef = this.docFn(this.firestore, collectionName, repo);
    return this.getDocFn(docRef);
  }

  connectEmulator(host = 'localhost', port = 8080) {
    this.connectEmulatorFn(this.firestore, host, port);
  }
}