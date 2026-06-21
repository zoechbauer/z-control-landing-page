import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WindowRefService {
  get nativeWindow(): Window | undefined {
    return globalThis.window;
  }

  get hostname(): string | undefined {
    return this.nativeWindow?.location?.hostname;
  }

  get isAvailable(): boolean {
    return this.nativeWindow !== undefined;
  }
}