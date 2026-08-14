import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OpenSourceComponent } from './open-source.component';

describe('OpenSourceComponent', () => {
  let component: OpenSourceComponent;
  let fixture: ComponentFixture<OpenSourceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [IonicModule.forRoot(), OpenSourceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OpenSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  describe('Class logic', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('Template rendering', () => {
    it('should render the component', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('ion-icon')).toBeTruthy();
    });

    it('should render Firebase info and open source info when showFirebaseInfo input is true or missing', () => {
      component.showFirebaseInfo = true;
      fixture.detectChanges();
      let compiled = fixture.nativeElement as HTMLElement;

      expect(compiled.querySelector('[data-testid="firebase-info"]')).toBeTruthy();
      expect(compiled.querySelector('[data-testid="open-source-info"]')).toBeTruthy();
    });

    
    it('should render only open source info when showFirebaseInfo input is false', () => {
      component.showFirebaseInfo = false;
      fixture.detectChanges();
      let compiled = fixture.nativeElement as HTMLElement;

      expect(compiled.querySelector('[data-testid="firebase-info"]')).toBeFalsy();
      expect(compiled.querySelector('[data-testid="open-source-info"]')).toBeTruthy();
    });
  });
});
