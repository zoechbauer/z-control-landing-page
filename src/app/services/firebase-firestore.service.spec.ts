import { TestBed } from '@angular/core/testing';

import { FirebaseFirestoreService } from './firebase-firestore.service';

describe('FirebaseFirestoreService', () => {
  let service: FirebaseFirestoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseFirestoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
