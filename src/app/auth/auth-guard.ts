import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from "./auth";
import {inject} from "@angular/core";

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if(!authService.isUserAuthenticated) {
    router.navigateByUrl('/login');
  }
  return authService.isUserAuthenticated;
};

