import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { Tab } from 'src/app/shared/enums';

@Component({
  selector: 'app-analytics-disabled-info',
  templateUrl: './analytics-disabled-info.component.html',
  styleUrls: ['./analytics-disabled-info.component.scss'],
  imports: [
    TranslatePipe
  ],
})
export class AnalyticsDisabledInfoComponent {
  @Input() tab!: Tab;
  @Input() appName!: string;
  @Input() isAnalyticsEnabled!: boolean;

  Tab = Tab;

}
