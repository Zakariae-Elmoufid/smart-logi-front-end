import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ClientSidebar } from '../../../shared/components/client-sidebar/client-sidebar.component';
import { ClientHeader } from '../../../shared/components/client-header/client-header.component';

@Component({
  selector: 'app-client-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ClientSidebar, ClientHeader],
  template: `
    <div class="flex h-screen bg-gray-100">
      <app-client-sidebar></app-client-sidebar>
      <div class="flex-1 flex flex-col overflow-hidden">
        <app-client-header></app-client-header>
        <main class="flex-1 overflow-y-auto">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
})
export class ClientLayout {}
