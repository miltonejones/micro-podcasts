import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { authGuard, guestGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => loadRemoteModule('login', './Component').then((m) => m.App),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => loadRemoteModule('home', './Component').then((m) => m.App),
  },
  {
    path: 'search/:query',
    canActivate: [authGuard],
    loadComponent: () => loadRemoteModule('search', './Component').then((m) => m.App),
  },
  {
    path: 'categories',
    canActivate: [authGuard],
    loadComponent: () => loadRemoteModule('categories', './Component').then((m) => m.App),
  },
  {
    path: 'subscriptions',
    canActivate: [authGuard],
    loadComponent: () => loadRemoteModule('subscriptions', './Component').then((m) => m.App),
  },
  {
    path: 'detail/:feedUrl',
    canActivate: [authGuard],
    loadComponent: () => loadRemoteModule('detail', './Component').then((m) => m.App),
  },
];
