import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'shared-utils';

/** Blocks navigation to any app route until the user is signed in. */
export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  await auth.ready;

  return auth.isAuthenticated() ? true : router.createUrlTree(['/login']);
};

/** Keeps a signed-in user from seeing the login page; sends them to the app instead. */
export const guestGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  await auth.ready;

  return auth.isAuthenticated() ? router.createUrlTree(['/']) : true;
};
