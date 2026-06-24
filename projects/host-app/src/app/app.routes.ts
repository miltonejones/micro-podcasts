import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => loadRemoteModule('home', './Component').then((m) => m.App),
  },
  {
    path: 'search/:query',
    loadComponent: () => loadRemoteModule('search', './Component').then((m) => m.App),
  },
  {
    path: 'categories',
    loadComponent: () => loadRemoteModule('categories', './Component').then((m) => m.App),
  },
  {
    path: 'subscriptions',
    loadComponent: () => loadRemoteModule('subscriptions', './Component').then((m) => m.App),
  },
  {
    path: 'detail/:feedUrl',
    loadComponent: () => loadRemoteModule('detail', './Component').then((m) => m.App),
  },
];
