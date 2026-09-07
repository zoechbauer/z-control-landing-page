import { Routes } from '@angular/router';

import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'main',
        loadComponent: () =>
          import('@app/main/main.page').then((m) => m.MainPage),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('@app/settings/settings.page').then((m) => m.SettingsPage),
      },
      {
        path: '',
        redirectTo: 'main',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'privacy-policy',
    redirectTo: 'privacy/basic/en',
    pathMatch: 'full',
  },
  {
    path: 'privacy/:type/:language',
    loadComponent: () =>
      import('@privacy/components/privacy-viewer/privacy-viewer.component').then(
        (m) => m.PrivacyViewerComponent,
      ),
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
    path: '',
    redirectTo: '/tabs/main',
    pathMatch: 'full',
  },
];
