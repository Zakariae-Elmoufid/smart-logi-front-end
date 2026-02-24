import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-manager-header',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './manager-header.html',
})
export class ManagerHeader {
    getCurrentDate(): string {
        return new Date().toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}
