import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Component } from '@angular/core';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

@Component({ standalone: true, template: '' })
class DummyComponent {}

describe('AuthGuard', () => {
  let authService: AuthService;
  let router: Router;

  beforeAll(() => {
    const store: Record<string, string> = {};
    Object.defineProperty(globalThis, 'localStorage', {
      value: {
        getItem: (key: string) => store[key] ?? null,
        setItem: (key: string, value: string) => { store[key] = value; },
        removeItem: (key: string) => { delete store[key]; },
        clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
        get length() { return Object.keys(store).length; },
        key: (index: number) => Object.keys(store)[index] ?? null,
      },
      writable: true,
    });
  });

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'login', component: DummyComponent },
          { path: 'dash', component: DummyComponent, canActivate: [authGuard] },
        ]),
      ],
    });

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('canActivate() sem token deve redirecionar para /login', async () => {
    await router.navigate(['/dash']);
    expect(router.url).toBe('/login');
  });

  it('canActivate() com token deve permitir acesso', async () => {
    localStorage.setItem('auth_token', 'valid-token');
    await router.navigate(['/dash']);
    expect(router.url).toBe('/dash');
  });

  it('canActivate() na rota /login deve sempre permitir', async () => {
    await router.navigate(['/login']);
    expect(router.url).toBe('/login');
  });
});
