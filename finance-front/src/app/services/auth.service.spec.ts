import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthService, AuthResponse } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

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
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('login() com credenciais válidas deve salvar token e retornar dados do usuário', () => {
    const mockResponse: AuthResponse = {
      token: 'jwt-token-123',
      user: { id: 1, email: 'test@test.com', name: 'Test User' },
    };

    let result: AuthResponse | undefined;
    service.login('test@test.com', '123456').subscribe((r) => {
      result = r;
    });

    const req = httpMock.expectOne('/api/v1/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'test@test.com', password: '123456' });

    req.flush({ success: true, data: mockResponse });

    expect(result).toEqual(mockResponse);
    expect(localStorage.getItem('auth_token')).toBe('jwt-token-123');
  });

  it('login() com credenciais inválidas deve retornar erro 401', () => {
    let errorResult: Error | undefined;
    service.login('wrong@test.com', 'wrongpass').subscribe({
      error: (err: Error) => {
        errorResult = err;
      },
    });

    const req = httpMock.expectOne('/api/v1/auth/login');
    req.flush(
      { success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Credenciais inválidas' } },
      { status: 401, statusText: 'Unauthorized' }
    );

    expect(errorResult?.message).toBe('Credenciais inválidas');
  });

  it('logout() deve remover token do localStorage', () => {
    localStorage.setItem('auth_token', 'some-token');
    service.logout();
    expect(localStorage.getItem('auth_token')).toBeNull();
  });

  it('isAuthenticated() deve retornar true quando token existe', () => {
    localStorage.setItem('auth_token', 'some-token');
    expect(service.isAuthenticated()).toBe(true);
  });

  it('isAuthenticated() deve retornar false quando token não existe', () => {
    expect(service.isAuthenticated()).toBe(false);
  });

  it('getToken() deve retornar o token armazenado', () => {
    localStorage.setItem('auth_token', 'my-token');
    expect(service.getToken()).toBe('my-token');
  });

  it('getToken() deve retornar null quando não há token', () => {
    expect(service.getToken()).toBeNull();
  });
});
