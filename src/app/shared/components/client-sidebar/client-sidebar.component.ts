import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../api/cart.service';

@Component({
  selector: 'app-client-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './client-sidebar.html',
})
export class ClientSidebar {
  constructor(public cartService: CartService) {}
}
