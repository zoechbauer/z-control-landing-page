import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonIcon,
  IonFooter,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.page.html',
  styleUrls: ['./privacy-policy.page.scss'],
  standalone: true,
  imports: [
    IonFooter,
    IonIcon,
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class PrivacyPolicyPage implements OnInit {
  selectedAccordion: string = 'z-control QR Code App';

  constructor(private readonly route: ActivatedRoute) {}

  ngOnInit() {
    // Get the 'from' query parameter
    this.route.queryParams.subscribe((params) => {
      if (params['from']) {
        this.selectedAccordion = params['from'];
        console.log('Received selectedAccordion:', this.selectedAccordion);
      }
    });
  }
}
