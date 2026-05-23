import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth } from '../core/firebase';

export const authGuard: CanActivateFn = (): Promise<boolean | UrlTree> => {
  const router = inject(Router);

  return new Promise<boolean | UrlTree>((resolve) => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      unsubscribe();
      resolve(user ? true : router.createUrlTree(['/login']));
    });
  });
};
