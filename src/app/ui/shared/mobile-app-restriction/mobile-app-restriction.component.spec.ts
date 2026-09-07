import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MobileAppRestrictionComponent } from './mobile-app-restriction.component';

describe('MobileAppRestrictionComponent', () => {
  let component: MobileAppRestrictionComponent;
  let fixture: ComponentFixture<MobileAppRestrictionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [IonicModule.forRoot(), MobileAppRestrictionComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MobileAppRestrictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
