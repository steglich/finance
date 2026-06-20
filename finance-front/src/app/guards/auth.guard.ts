import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (state.url === '/login') {
    return of(true);
  }

  if (authService.isAuthenticated()) {
    return of(true);
  }

  return of(router.createUrlTree(['/login']));
};
