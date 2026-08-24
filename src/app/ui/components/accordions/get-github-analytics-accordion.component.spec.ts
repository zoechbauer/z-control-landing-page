import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';

import { GetGithubAnalyticsAccordionComponent } from './get-github-analytics-accordion.component';
import { createTranslateServiceMock } from '@testing/translate-service.mock';
import { createUtilsServiceMock } from '@testing/utils-service.mock';
import { UtilsService } from 'src/app/services/utils.service';
import { APPS } from 'src/app/shared/GitHubConstants';

describe('GetGithubAnalyticsAccordionComponent', () => {
  let component: GetGithubAnalyticsAccordionComponent;
  let fixture: ComponentFixture<GetGithubAnalyticsAccordionComponent>;
  let utilsServiceMock: any;
  
  beforeEach(() => {
    utilsServiceMock = createUtilsServiceMock();

    TestBed.configureTestingModule({
      imports: [GetGithubAnalyticsAccordionComponent],
      providers: [
        {
          provide: TranslateService,
          useValue: createTranslateServiceMock(),
        },
        {
          provide: UtilsService,
          useValue: utilsServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GetGithubAnalyticsAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onOpenGitHubAnalytics with correct parameters', async () => {
    const lang = 'en';
    await component.onOpenGitHubAnalytics(lang);

    expect(utilsServiceMock.openGitHubAnalytics).toHaveBeenCalledWith(
      APPS.LANDING_PAGE as keyof typeof APPS,
      'en',
    );
  });
});
