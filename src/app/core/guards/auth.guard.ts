import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../feature/auth/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();
  const isLoggedIn = authService.isLoggedIn();

  if (token && isLoggedIn) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
