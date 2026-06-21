import { TestBed } from '@angular/core/testing';
import * as firestore from 'firebase/firestore';
import { Firestore } from 'firebase/firestore';
import {
  FirestoreAdapterService,
  FIRESTORE_CONNECT_EMULATOR,
  FIRESTORE_GET_DOC,
  FIRESTORE_DOC,
} from './firestore-adapter.service';

describe('FirestoreAdapterService', () => {
  let service: FirestoreAdapterService;
  let firestoreMock: Firestore;
  let connectEmulatorSpy: jasmine.Spy;
  let getDocSpy: jasmine.Spy;
  let docSpy: jasmine.Spy;

  beforeEach(() => {
    firestoreMock = {} as Firestore;
    connectEmulatorSpy = jasmine.createSpy('connectFirestoreEmulator');
    getDocSpy = jasmine.createSpy('getDoc');
    docSpy = jasmine.createSpy('doc');

    TestBed.configureTestingModule({
      providers: [
        FirestoreAdapterService,
        { provide: Firestore, useValue: firestoreMock },
        { provide: FIRESTORE_CONNECT_EMULATOR, useValue: connectEmulatorSpy },
        { provide: FIRESTORE_GET_DOC, useValue: getDocSpy },
        { provide: FIRESTORE_DOC, useValue: docSpy },
      ],
    });

    service = TestBed.inject(FirestoreAdapterService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should call doc and getDoc in getDocSnapshot', async () => {
    const docRefMock = { id: 'doc-ref' } as any;
    const snapshotMock = { exists: () => true } as any;

    docSpy.and.returnValue(docRefMock);
    getDocSpy.and.resolveTo(snapshotMock);

    const result = await service.getDocSnapshot('repos', 'abc123');

    expect(docSpy).toHaveBeenCalledWith(firestoreMock, 'repos', 'abc123');
    expect(getDocSpy).toHaveBeenCalledWith(docRefMock);
    expect(result).toBe(snapshotMock);
  });

  it('should connect emulator with default values', () => {
    service.connectEmulator();

    expect(connectEmulatorSpy).toHaveBeenCalledWith(
      firestoreMock,
      'localhost',
      8080,
    );
  });

  it('should connect emulator with custom values', () => {
    service.connectEmulator('127.0.0.1', 8081);

    expect(connectEmulatorSpy).toHaveBeenCalledWith(
      firestoreMock,
      '127.0.0.1',
      8081,
    );
  });
});
