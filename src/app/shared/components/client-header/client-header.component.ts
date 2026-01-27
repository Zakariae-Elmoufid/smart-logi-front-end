import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../api/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-client-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-semibold text-gray-800">Portail Client</h2>
          <p class="text-sm text-gray-500">Bienvenue, {{ currentUser?.firstName }} {{ currentUser?.lastName }}</p>
        </div>
        
        <div class="flex items-center gap-4">
          <!-- Cart Quick Access -->
          <a routerLink="/client/cart" 
            class="relative p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            @if (cartService.itemCount() > 0) {
            <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {{ cartService.itemCount() }}
            </span>
            }
          </a>
          
          <!-- Total Amount -->
          @if (cartService.totalAmount() > 0) {
          <div class="text-right">
            <p class="text-xs text-gray-500">Total panier</p>
            <p class="text-lg font-bold text-emerald-600">{{ cartService.totalAmount() | number:'1.2-2' }} DH</p>
          </div>
          }

          <!-- User Avatar -->
          <div class="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
              {{ currentUser?.firstName?.charAt(0) }}{{ currentUser?.lastName?.charAt(0) }}
            </div>
            <div class="hidden md:block">
              <p class="text-sm font-medium text-gray-900">{{ currentUser?.firstName }} {{ currentUser?.lastName }}</p>
              <p class="text-xs text-gray-500">{{ currentUser?.email }}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  `,
})
export class ClientHeader implements OnInit {
  currentUser: User | null = null;

  constructor(
    public cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
  }
}
