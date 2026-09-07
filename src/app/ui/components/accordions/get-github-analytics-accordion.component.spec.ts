import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';

import { createTranslateServiceMock } from '@testing/translate-service.mock';
import { createUtilsServiceMock } from '@testing/utils-service.mock';
import { UtilsService } from '@app/services/utils.service';
import { APP_KEYS, AppKey } from '@app/shared/GitHubConstants';
import { GetGithubAnalyticsAccordionComponent } from '@ui/components/accordions/get-github-analytics-accordion.component';

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
      APP_KEYS.LANDING_PAGE as AppKey,
      'en',
    );
  });
});
