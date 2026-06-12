import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BackendFunctionsSectionComponent } from './backend-functions-section.component';

describe('BackupFunctionsSectionComponent', () => {
  let component: BackendFunctionsSectionComponent;
  let fixture: ComponentFixture<BackendFunctionsSectionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BackendFunctionsSectionComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(BackendFunctionsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
