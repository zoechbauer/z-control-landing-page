import { Component, Input } from '@angular/core';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-open-source-apps',
  templateUrl: './open-source-apps.component.html',
  styleUrls: ['./open-source-apps.component.scss'],
  imports: [IonIcon, NgIf, NgTemplateOutlet],
})
export class OpenSourceAppsComponent {
  @Input() selectedLanguage!: string;
  @Input() showFirebaseInfo: boolean = true;
}
