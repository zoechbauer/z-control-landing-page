import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular/standalone';
import { FirebaseAnalyticsService } from '../services/firebase-analytics.service';
import { LocalStorageService } from '../services/local-storage.service';
import { ChangeDetectorRef } from '@angular/core';

import { HomePage } from './home.page';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let firebaseAnalyticsServiceSpy: jasmine.SpyObj<FirebaseAnalyticsService>;
  let localStorageServiceSpy: jasmine.SpyObj<LocalStorageService>;

  beforeEach(async () => {
    const modalSpy = jasmine.createSpyObj('ModalController', ['create']);
    const faSpy = jasmine.createSpyObj('FirebaseAnalyticsService', [
      'logEvent',
    ]);
    const localStorageSpy = jasmine.createSpyObj('LocalStorageService', [
      'getAnalyticsConsent',
    ]);
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: { params: {} },
      params: jasmine.createSpyObj('Observable', ['subscribe']),
    });

    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [
        { provide: ModalController, useValue: modalSpy },
        { provide: FirebaseAnalyticsService, useValue: faSpy },
        { provide: LocalStorageService, useValue: localStorageSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    modalControllerSpy = TestBed.inject(
      ModalController
    ) as jasmine.SpyObj<ModalController>;
    firebaseAnalyticsServiceSpy = TestBed.inject(
      FirebaseAnalyticsService
    ) as jasmine.SpyObj<FirebaseAnalyticsService>;
    localStorageServiceSpy = TestBed.inject(
      LocalStorageService
    ) as jasmine.SpyObj<LocalStorageService>;
  });

  it('should create', () => {
    // Mock the ViewChild before detecting changes
    const mockAccordionGroup = {
      value: undefined,
    };
    (component as any).accordionGroup = mockAccordionGroup;

    // Disable automatic change detection error checking
    fixture.componentRef.injector.get(ChangeDetectorRef).detach();

    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});
