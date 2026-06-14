import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  private readonly logoClickedSub = new Subject<boolean>();
  logoClicked$ = this.logoClickedSub.asObservable();

  constructor() { }

  /**
   * Emits an event when the logo is clicked, 
   * which is used to trigger actions such as opening the footer.
   */
  onLogoClicked() {
    this.logoClickedSub.next(true);
  }

  /**
   * Returns true if the device is in portrait orientation.
   */
  get isPortrait(): boolean {
    return globalThis.matchMedia('(orientation: portrait)').matches;
  }

  /**
   * Returns true if the device is a small screen (mobile, portrait).
   */
  get isSmallScreen(): boolean {
    const isMobileWidth = window.innerWidth <= 768;
    return isMobileWidth && this.isPortrait;
  }

  /**
   * Returns true if the device is a small device (short height, short width).
   */
  get isSmallDevice(): boolean {
    const isMobileHeight = window.innerHeight <= 640;
    const isMobileWidth = window.innerWidth <= 768;
    return isMobileHeight && isMobileWidth;
  }
}
