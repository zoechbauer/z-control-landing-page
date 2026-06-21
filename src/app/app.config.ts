import { ApplicationConfig } from '@angular/core';
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

import { routes } from './app.routes';
import { environment } from 'src/environments/environment';

function getEmulatorHost(): string | undefined {
  if (!environment.useFirebaseEmulator) {
    return undefined;
  }

  const host = globalThis.location.hostname;

  if (host === 'localhost' || host === '127.0.0.1') {
    return '127.0.0.1';
  }

  if (host === '10.0.0.68') {
    return '10.0.0.68';
  }

  return undefined;
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

    provideMarkdown(),

    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => {
      const firestore = getFirestore();
      const emulatorHost = getEmulatorHost();
      if (emulatorHost) {
        console.log(
          'Connecting to Firestore emulator with host:',
          emulatorHost,
        );
        connectFirestoreEmulator(firestore, emulatorHost, 8080);
      }
      return firestore;
    }),

    provideFunctions(() => {
      const functions = getFunctions();
      const emulatorHost = getEmulatorHost();
      if (emulatorHost) {
        console.log(
          'Connecting to Functions emulator with host:',
          emulatorHost,
        );
        connectFunctionsEmulator(functions, emulatorHost, 5001);
      }
      return functions;
    }),
  ],
};
