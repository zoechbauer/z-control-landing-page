import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBack } from 'ionicons/icons';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { UtilsService } from 'src/app/services/utils.service';

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
    IonButtons,
    IonButton,
    IonIcon,
  ],
})
export class HeaderComponent implements OnInit {
  public isMobile = false;

  @Input() selectedAccordion: string = '';
  @Input() showBackButton: boolean = false;

  constructor(
    private readonly router: Router,
    private readonly utilsService: UtilsService
  ) {
    this.registerIcons();
  }

  ngOnInit(): void {
    this.isMobile = globalThis.window.innerWidth <= 600;
    globalThis.window.addEventListener('resize', () => {
      this.isMobile = globalThis.window.innerWidth <= 600;
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

  openFooter() {
    // firebase analytics event handled in footer component
    this.utilsService.onLogoClicked();
  }
}
