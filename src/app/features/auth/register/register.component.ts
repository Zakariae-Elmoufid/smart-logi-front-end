import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-600 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-2xl p-8">
        <div class="text-center">
          <div class="mx-auto h-16 w-16 bg-purple-600 rounded-full flex items-center justify-center">
            <span class="text-3xl font-bold text-white">L</span>
          </div>
          <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
            Créer un compte
          </h2>
        </div>

        @if (errorMessage()) {
          <div class="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
            {{ errorMessage() }}
          </div>
        }

        @if (successMessage()) {
          <div class="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded">
            {{ successMessage() }}
          </div>
        }

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Prénom</label>
              <input
                type="text"
                formControlName="firstName"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
              @if (registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched) {
                <p class="mt-1 text-sm text-red-600">Requis</p>
              }
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Nom</label>
              <input
                type="text"
                formControlName="lastName"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
              @if (registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched) {
                <p class="mt-1 text-sm text-red-600">Requis</p>
              }
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              formControlName="email"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
            @if (registerForm.get('email')?.invalid && registerForm.get('email')?.touched) {
              <p class="mt-1 text-sm text-red-600">Email valide requis</p>
            }
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              type="password"
              formControlName="password"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
            @if (registerForm.get('password')?.invalid && registerForm.get('password')?.touched) {
              <p class="mt-1 text-sm text-red-600">Min 6 caractères</p>
            }
          </div>

          <button
            type="submit"
            [disabled]="registerForm.invalid || loading()"
            class="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:bg-gray-400 transition-colors">
            @if (loading()) {
              Inscription...
            } @else {
              S'inscrire
            }
          </button>

          <div class="text-center">
            <p class="text-sm text-gray-600">
              Déjà un compte ?
              <a routerLink="/login" class="font-medium text-purple-600 hover:text-purple-500">
                Se connecter
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading.set(true);
      this.errorMessage.set('');
      this.successMessage.set('');

      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.loading.set(false);
          this.successMessage.set('Inscription réussie ! Redirection...');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          this.loading.set(false);
          this.errorMessage.set(error.error?.message || 'Erreur lors de l\'inscription');
        }
      });
    }
  }
}
