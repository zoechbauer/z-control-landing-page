import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { PrivacyPolicyComponent } from './privacy-policy.component';
import { createTranslateServiceMock } from '@testing/translate-service.mock';
import { ActivatedRoute } from '@angular/router';

describe('PrivacyPolicyComponent', () => {
  let component: PrivacyPolicyComponent;
  let fixture: ComponentFixture<PrivacyPolicyComponent>;
  let activatedRouteSpy: any;

  beforeEach(waitForAsync(() => {
    activatedRouteSpy = {
      snapshot: {
        queryParams: {},
      },
    };

    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        IonicModule.forRoot(),
        TranslateModule.forRoot(),
        PrivacyPolicyComponent,
      ],
      providers: [
        {
          provide: TranslateService,
          useValue: createTranslateServiceMock(),
        },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PrivacyPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
