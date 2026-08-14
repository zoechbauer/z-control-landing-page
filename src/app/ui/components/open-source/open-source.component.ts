import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-open-source',
  templateUrl: './open-source.component.html',
  styleUrls: ['./open-source.component.scss'],
  imports: [IonIcon, NgIf],
})
export class OpenSourceComponent {
  @Input() showFirebaseInfo: boolean = true;
}
