import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'urgent' | 'warning' | 'info';
  time: string;
  read: boolean;
}
@Component({
  selector: 'app-admin-header',
  imports: [CommonModule],
  templateUrl: './admin-header.html',
  styleUrl: './admin-header.css',
})
export class AdminHeader implements OnInit  {
  userName = 'Admin User';
  userEmail = 'admin@smartlogi.com';
  userRole = 'Administrateur';

  // UI states
  showNotifications = false;
  showProfile = false;

  // Notifications
  notifications: Notification[] = [
    {
      id: '1',
      title: 'Stock faible détecté',
      message: 'Le produit "Ordinateur Dell XPS" a un stock critique (3 unités restantes)',
      type: 'urgent',
      time: 'Il y a 5 min',
      read: false
    },
    {
      id:  '2',
      title: 'Nouvelle commande',
      message: 'Commande #CMD-2024-156 créée par Marie Dubois (245€)',
      type: 'info',
      time: 'Il y a 15 min',
      read: false
    },
    {
      id: '3',
      title: 'Livraison en retard',
      message: 'La commande #CMD-2024-145 n\'a pas été livrée à temps',
      type: 'warning',
      time: 'Il y a 1h',
      read: false
    }
  ];

  notificationCount = 0;

  ngOnInit(): void {
    this.updateNotificationCount();
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  toggleNotifications(): void {
    this.showNotifications = ! this.showNotifications;
    if (this.showProfile) this.showProfile = false;
  }

  toggleProfile(): void {
    this.showProfile = ! this.showProfile;
    if (this.showNotifications) this.showNotifications = false;
  }

  private updateNotificationCount(): void {
    this.notificationCount = this.notifications.filter(n => ! n.read).length;
  }

  logout(): void {
    // Implement logout logic
    console.log('Logout clicked');
    this.showProfile = false;
  }

  // Close dropdowns when clicking outside
  closeDropdowns(): void {
    this.showNotifications = false;
    this. showProfile = false;
  }
}
