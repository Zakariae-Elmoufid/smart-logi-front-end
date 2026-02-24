import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-manager-sidebar',
    standalone: true,
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './manager-sidebar.html',
})
export class ManagerSidebar {
    private authService = inject(AuthService);

    logout(): void {
        this.authService.logout();
    }
}
