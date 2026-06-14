import { Component, OnInit, signal, inject, ChangeDetectionStrategy, PLATFORM_ID } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { FormRoot, FormField, form, required, email, minLength } from '@angular/forms/signals';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormRoot, FormField],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);

  loginModel = signal({
    email: '',
    password: '',
    rememberMe: false
  });

  loginForm = form(this.loginModel, (p) => {
    required(p.email, { message: 'O e-mail é obrigatório.' });
    email(p.email, { message: 'Digite um endereço de e-mail válido.' });
    required(p.password, { message: 'A senha é obrigatória.' });
    minLength(p.password, 6, { message: 'A senha deve ter no mínimo 6 caracteres.' });
  });

  isDarkMode = signal(false);
  errorMessage = signal<string | null>(null);
  isLoading = signal(false);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(prefersDark);
    }
  }

  toggleTheme(): void {
    this.setTheme(!this.isDarkMode());
  }

  private setTheme(dark: boolean): void {
    this.isDarkMode.set(dark);
    const bodyClass = this.document.body.classList;
    if (dark) {
      bodyClass.add('dark');
    } else {
      bodyClass.remove('dark');
    }
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    if (this.loginForm().invalid()) {
      this.loginForm.email().markAsTouched();
      this.loginForm.password().markAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { email, password, rememberMe } = this.loginModel();
    console.log('Dados de Login enviados:', { email, password, rememberMe });

    setTimeout(() => {
      this.isLoading.set(false);
      alert('Login simulado com sucesso!');
    }, 1500);
  }
}
