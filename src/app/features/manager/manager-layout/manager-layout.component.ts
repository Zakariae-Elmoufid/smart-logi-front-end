import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ManagerSidebar } from '../../../shared/components/manager-sidebar/manager-sidebar.component';
import { ManagerHeader } from '../../../shared/components/manager-header/manager-header.component';

@Component({
    selector: 'app-manager-layout',
    standalone: true,
    imports: [RouterOutlet, ManagerSidebar, ManagerHeader],
    templateUrl: './manager-layout.html',
})
export class ManagerLayout { }
