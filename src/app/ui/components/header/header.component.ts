import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBack } from 'ionicons/icons';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
  ],
})
export class HeaderComponent implements OnInit {
  public isMobile = false;

  @Input() selectedAccordion: string = '';
  @Input() showBackButton: boolean = false;

  constructor(private readonly router: Router) {
    this.registerIcons();
  }

  ngOnInit(): void {
    this.isMobile = window.innerWidth <= 600;
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth <= 600;
    });
  }

  private registerIcons() {
    addIcons({
      'arrow-back': arrowBack,
    });
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
