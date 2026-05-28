import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth';

export const authGuard: CanActivateFn = (): boolean | UrlTree => {
  const router = inject(Router);
  const authService = inject(AuthService);
  return authService.isUserAuthenticated ? true : router.createUrlTree(['/login']);
};
