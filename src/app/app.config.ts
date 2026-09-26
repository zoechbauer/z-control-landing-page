import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  RouteReuseStrategy,
  withPreloading,
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import {
  provideFirestore,
  getFirestore,
  connectFirestoreEmulator,
} from '@angular/fire/firestore';
import {
  connectFunctionsEmulator,
  getFunctions,
  provideFunctions,
} from '@angular/fire/functions';
import { provideMarkdown } from 'ngx-markdown';

import { routes } from '@app/app.routes';
import { ServicesModule } from './services.module';
import { environment } from '@env/environment';

function isEmulatorEnabled(): boolean {
  return !!environment.useFirebaseEmulator;
}

/**
 * Resolve the emulator host based on runtime location.
 * Extend this function if you need additional host mappings (emulators, emulator over adb, etc).
 */
function resolveEmulatorHost(): string | undefined {
  if (!isEmulatorEnabled()) return undefined;

  const host = globalThis.location?.hostname ?? '';

  if (host === 'localhost' || host === '127.0.0.1') {
    return '127.0.0.1';
  }

  // Example: developer device LAN IP mapping kept from original logic
  if (host === '10.0.0.68') {
    return '10.0.0.68';
  }

  return undefined;
}

/**
 * Create and return Firebase providers.
 * This keeps emulator wiring isolated from the top-level provider list.
 */
function createFirebaseProviders() {
  const emulatorHost = resolveEmulatorHost();

  const firestoreProvider = provideFirestore(() => {
    const firestore = getFirestore();
    if (emulatorHost) {
      console.log('Connecting to Firestore emulator with host:', emulatorHost);
      connectFirestoreEmulator(firestore, emulatorHost, 8080);
    }
    return firestore;
  });

  const functionsProvider = provideFunctions(() => {
    const functions = getFunctions();
    if (emulatorHost) {
      console.log('Connecting to Functions emulator with host:', emulatorHost);
      connectFunctionsEmulator(functions, emulatorHost, 5001);
    }
    return functions;
  });

  return [firestoreProvider, functionsProvider];
}

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular({
      // all ionic services are now available for injection
      mode: 'md',
    }),
    provideHttpClient(),
    provideRouter(routes, withPreloading(PreloadAllModules)),

    importProvidersFrom(ServicesModule),
    provideTranslateService({ fallbackLang: 'de' }),
    ...provideTranslateHttpLoader({
      prefix: './assets/i18n/',
      suffix: '.json',
    }),

    provideMarkdown(),

    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    // Firebase service providers (firestore + functions). Emulator wiring is isolated in createFirebaseProviders().
    ...createFirebaseProviders(),
  ],
};
