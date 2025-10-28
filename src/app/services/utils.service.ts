import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  private readonly logoClickedSub = new Subject<void>();
  logoClicked$ = this.logoClickedSub.asObservable();

  constructor() { }

  onLogoClicked() {
    this.logoClickedSub.next();
  }
}
