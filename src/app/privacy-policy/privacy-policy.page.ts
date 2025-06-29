import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { HeaderComponent, FooterComponent } from '../ui';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.page.html',
  styleUrls: ['./privacy-policy.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    HeaderComponent,
    FooterComponent,
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
