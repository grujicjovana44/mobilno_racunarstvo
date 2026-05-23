import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth } from '../core/firebase';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  return new Promise<boolean>((resolve) => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      unsubscribe();
      if (user) {
        resolve(true);
      } else {
        router.navigate(['/login']);
        resolve(false);
      }
    });
  });
};
