import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular/standalone';

import { GithubAnalyticsComponent } from './github-analytics.component';
import { FirebaseFirestoreService } from 'src/app/services/firebase-firestore.service';
import { FirebaseAnalyticsService } from 'src/app/services/firebase-analytics.service';
import { GithubAnalyticsTrafficDocument } from 'shared/GitHubConstants';

// Mock FirebaseFirestoreService to avoid real Firebase calls
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

class MockFirebaseAnalyticsService {
  init(): void {}
  logEvent(name: string, params?: { [key: string]: any }): void {}
  enableCollection(allow: boolean): void {}
  enabled$ = { subscribe: () => {} }; // Stub for observable
}

// Mock ModalController with basic structure for testing
class MockModalController {
  dismiss(): Promise<boolean> {
    return Promise.resolve(true);
  }
}

describe('GithubAnalyticsComponent', () => {
  let component: GithubAnalyticsComponent;
  let fixture: ComponentFixture<GithubAnalyticsComponent>;
  let firestoreService: FirebaseFirestoreService;
  let firebaseAnalyticsService: FirebaseAnalyticsService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), GithubAnalyticsComponent],
      providers: [
        {
          provide: FirebaseFirestoreService,
          useClass: MockFirebaseFirestoreService,
        },
        {
          provide: FirebaseAnalyticsService,
          useClass: MockFirebaseAnalyticsService,
        },
        { provide: ModalController, useClass: MockModalController },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GithubAnalyticsComponent);
    component = fixture.componentInstance;
    firestoreService = TestBed.inject(FirebaseFirestoreService);
    firebaseAnalyticsService = TestBed.inject(FirebaseAnalyticsService);
    fixture.detectChanges();
  }));

  it('should create', () => {
    spyOn(firestoreService, 'getAnalyticsData').and.returnValue(
      Promise.resolve([])
    );
    expect(component).toBeTruthy();
  });
});
