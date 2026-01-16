import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-manager-sidebar',
    standalone: true,
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './manager-sidebar.html',
})
export class ManagerSidebar { }
