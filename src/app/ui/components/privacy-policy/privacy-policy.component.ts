import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { LogoComponent } from '@ui/components/logo/logo.component';
import { LogoType, Tab } from '@app/shared/enums';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
  standalone: true,
  imports: [
    IonIcon,
    NgIf,
    NgTemplateOutlet,
    LogoComponent,
    TranslateModule,
    RouterModule,
  ],
})
export class PrivacyPolicyComponent {
  @Input() lang!: string;
  LogoType = LogoType;
  Tab = Tab;

  get privacyPolicyLink() {
    return ['/privacy', 'landing-page', this.lang];
  }
}
