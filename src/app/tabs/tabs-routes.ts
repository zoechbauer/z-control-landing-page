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
          import('../home/home.page').then(
            (m) => m.HomePage
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('../settings/settings.page').then(
            (m) => m.SettingsPage
          ),
      },
      {
        path: '',
        redirectTo: 'main',
        pathMatch: 'full',
      },
    ],
  },
    {
    path: '',
    redirectTo: '/tabs/main',
    pathMatch: 'full',
  },
];