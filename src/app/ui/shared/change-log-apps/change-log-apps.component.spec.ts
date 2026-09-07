import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChangeLogAppsComponent } from './change-log-apps.component';
import { UtilsService } from '@app/services/utils.service';
import { APP_KEYS } from 'src/app/shared/GitHubConstants';

describe('ChangeLogAppsComponent', () => {
  let component: ChangeLogAppsComponent;
  let fixture: ComponentFixture<ChangeLogAppsComponent>;
  let utilsServiceSpy: jasmine.SpyObj<any>;

  beforeEach(waitForAsync(() => {
    utilsServiceSpy = jasmine.createSpyObj('UtilsService', [
      'openChangelog',
      'getDisplayNameForAccordion',
    ]);

    TestBed.configureTestingModule({
      declarations: [],
      imports: [IonicModule.forRoot(), ChangeLogAppsComponent],
      providers: [
        { provide: UtilsService, useValue: utilsServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangeLogAppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call openChangelog method of UtilsService', () => {
    component.selectedAccordion = APP_KEYS.QR_CODE_GENERATOR;
    component.onOpenChangelog();
    expect(utilsServiceSpy.openChangelog).toHaveBeenCalledWith(APP_KEYS.QR_CODE_GENERATOR);
  });

  it('should call getDisplayNameForAccordion method of UtilsService', () => {
    component.selectedAccordion = APP_KEYS.QR_CODE_GENERATOR;
    component.appName;
    expect(utilsServiceSpy.getDisplayNameForAccordion).toHaveBeenCalledWith(APP_KEYS.QR_CODE_GENERATOR);
  });
});
