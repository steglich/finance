import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LoginComponent } from './login';
import { provideSignalFormsConfig } from '@angular/forms/signals';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpMock: HttpTestingController;

  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    });
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideSignalFormsConfig({}),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('o formulário deve iniciar inválido', () => {
    expect(component.loginForm().invalid()).toBe(true);
  });

  it('deve validar e-mail obrigatório', () => {
    component.loginForm.email().markAsTouched();
    fixture.detectChanges();
    const errors = component.loginForm.email().errors();
    expect(errors.length).toBeGreaterThan(0);
    const messages = errors.map((e) => e.message);
    expect(messages).toContain('O e-mail é obrigatório.');
  });

  it('deve validar formato de e-mail inválido', () => {
    component.loginModel.set({ email: 'invalido', password: '123456', rememberMe: false });
    component.loginForm.email().markAsTouched();
    fixture.detectChanges();
    const errors = component.loginForm.email().errors();
    const messages = errors.map((e) => e.message);
    expect(messages).toContain('Digite um endereço de e-mail válido.');
  });

  it('deve validar senha com tamanho mínimo', () => {
    component.loginModel.set({ email: 'test@test.com', password: '123', rememberMe: false });
    component.loginForm.password().markAsTouched();
    fixture.detectChanges();
    const errors = component.loginForm.password().errors();
    const messages = errors.map((e) => e.message);
    expect(messages).toContain('A senha deve ter no mínimo 6 caracteres.');
  });

  it('formulário deve ficar válido com dados corretos', () => {
    component.loginModel.set({ email: 'test@test.com', password: '123456', rememberMe: false });
    fixture.detectChanges();
    expect(component.loginForm().valid()).toBe(true);
  });

  it('toggleTheme deve alternar sinal isDarkMode e classe .dark no body', () => {
    const body = document.body;

    component.toggleTheme();
    fixture.detectChanges();
    expect(component.isDarkMode()).toBe(true);
    expect(body.classList.contains('dark')).toBe(true);

    component.toggleTheme();
    fixture.detectChanges();
    expect(component.isDarkMode()).toBe(false);
    expect(body.classList.contains('dark')).toBe(false);
  });

  it('isLoading deve ser true ao submeter formulário válido', () => {
    component.loginModel.set({ email: 'test@test.com', password: '123456', rememberMe: false });
    fixture.detectChanges();

    const event = new SubmitEvent('submit');
    component.onSubmit(event);

    expect(component.isLoading()).toBe(true);

    const req = httpMock.expectOne('/api/v1/auth/login');
    req.flush({ success: true, data: { token: 't', user: { id: 1, email: 'test@test.com' } } });
  });
});
