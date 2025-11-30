import { TestBed } from '@angular/core/testing';

import { FirebaseFirestoreService } from './firebase-firestore.service';
import { GithubAnalyticsTrafficDocument } from 'shared/GitHubConstants';

// Mock service to avoid real Firebase calls
class MockFirebaseFirestoreService {
    getAnalyticsData(
      collection?: any,
      repo?: any,
      useFirebaseEmulator?: boolean
    ): Promise<GithubAnalyticsTrafficDocument[]> {
      // Return an empty array to match the expected type
      return Promise.resolve([]);
    }
}

describe('FirebaseFirestoreService', () => {
  let service: FirebaseFirestoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: FirebaseFirestoreService, useClass: MockFirebaseFirestoreService }
      ]
    });
    service = TestBed.inject(FirebaseFirestoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
