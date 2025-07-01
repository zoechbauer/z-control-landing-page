import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'privacy-policy',
    redirectTo: 'privacy/basic/en',
    pathMatch: 'full',
  },
  {
    path: 'privacy/:type/:language',
    loadComponent: () =>
      import(
        './privacy/components/privacy-viewer/privacy-viewer.component'
      ).then((m) => m.PrivacyViewerComponent),
  },
  {
    path: 'privacy/:type',
    redirectTo: 'privacy/:type/en',
    pathMatch: 'full',
  },
  {
    path: 'privacy',
    redirectTo: 'privacy/basic/en',
    pathMatch: 'full',
  },
  {
    path: 'privacy-debug',
    loadComponent: () =>
      import('./privacy/components/privacy-debug/privacy-debug.component').then(
        (m) => m.PrivacyDebugComponent
      ),
  },
];
