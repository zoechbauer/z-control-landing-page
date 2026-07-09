import { Injectable, inject } from '@angular/core';
import { ToastController } from '@ionic/angular';

import { UtilsService } from './utils.service';
import { ToastAnchor } from '../shared/enums';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly toastController = inject(ToastController);
  private readonly utilsService = inject(UtilsService);


  /**
   * Displays a toast message below the header.
   * 
   * @param toastMessage The message to display
   * @param anchorId Optional anchor ID, default is ToastAnchor.SETTINGS_PAGE.
   */
  showToast(toastMessage: string, anchorId?: ToastAnchor): void {
    this.showToastMessage(toastMessage, anchorId).catch((error) => {
      console.error('Error presenting toast:', error);
    });
  }

  private async showToastMessage(
    toastMessage: string,
    anchorId?: ToastAnchor
  ) {
    const toastOptions: any = {
      message: toastMessage,
      duration: 3000,
      icon: 'information-circle',
      color: 'medium',
      position: this.getToastPosition(),
      buttons: [
        {
          icon: 'close-outline',
          role: 'cancel',
        },
      ],
    };

    const anchor = this.getToastAnchor(anchorId);
    if (anchor) {
      toastOptions.positionAnchor = anchor;
    }

    const toast = await this.toastController.create(toastOptions);
    await toast.present();
  }

  private getToastPosition(): 'top' | 'bottom' {
    if (!this.utilsService.isSmallDevice) {
      return 'bottom';
    }
    // On mobile devices, display toast at the top to prevent it from being obscured by the navigation bar or keyboard.
    return 'top';
  }

  private getToastAnchor(anchorId?: ToastAnchor): string | undefined {
    if (!this.utilsService.isSmallDevice) {
      return undefined; // Do not set anchor on desktop
    }
    // On mobile devices, display toast below the header prevent it from being obscured by the header bar.
    return anchorId || ToastAnchor.MainPage;
  }
}
