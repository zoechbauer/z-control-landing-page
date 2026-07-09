import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { UtilsService } from '@app/services/utils.service';

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
export class HeaderComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly utilsService = inject(UtilsService);

  public isMobile = false;
  private resizeHandler?: () => void;

  @Input() selectedAccordion: string = '';
  @Input() showBackButton: boolean = false;

  ngOnInit(): void {
    this.isMobile = globalThis.window.innerWidth <= 600;

    this.resizeHandler = () => {
      this.isMobile = globalThis.window.innerWidth <= 600;
    };
    globalThis.window.addEventListener('resize', this.resizeHandler);
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  openFooter() {
    // firebase analytics event handled in footer component
    this.utilsService.onLogoClicked();
  }

  ngOnDestroy(): void {
    if (this.resizeHandler) {
      globalThis.window.removeEventListener('resize', this.resizeHandler);
    }
  }
}
