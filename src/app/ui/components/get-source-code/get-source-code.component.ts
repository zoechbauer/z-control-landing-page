import { Component, Input, inject } from '@angular/core';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { LogoType } from '@app/shared/enums';
import { AppKey } from '@app/shared/GitHubConstants';
import { LogoComponent } from '@ui/components/logo/logo.component';
import { UtilsService } from '@app/services/utils.service';
import { SourceCodeAppsComponent } from '@ui/shared/source-code-apps/source-code-apps.component';
@Component({
  selector: 'app-get-source-code',
  templateUrl: './get-source-code.component.html',
  styleUrls: ['./get-source-code.component.scss'],
  standalone: true,
  imports: [
    LogoComponent,
    NgIf,
    NgTemplateOutlet,
    TranslateModule,
    SourceCodeAppsComponent,
  ],
})
export class GetSourceCodeComponent {
  readonly utilsService = inject(UtilsService);

  @Input() lang!: string;
  @Input() appNameKey!: AppKey;
  LogoType = LogoType;

}
