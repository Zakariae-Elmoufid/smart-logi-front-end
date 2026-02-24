import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminApiService } from '../../../api/admin-api-service';
import { AdminKPIs } from '../models/admin-kpis.model';


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule ],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {
  private cdr = inject(ChangeDetectorRef);

  public constructor(private  adminApiService: AdminApiService) { }

  adminKpis?: AdminKPIs;
  isLoading = true;


  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.cdr.detectChanges();
    
    this.adminApiService.getGlobalKPIs().subscribe({
      next: (resp) => {
        this.adminKpis = resp;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('error ', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }


  get totalActiveOrders(): number {
    if (!this.adminKpis) return 0;
    return this.adminKpis.ordersCreated + this.adminKpis.ordersReserved + this.adminKpis.ordersShipped;
  }

  get successRate(): number {
    if (! this.adminKpis || this.adminKpis.totalOrders === 0) return 0;
    return (this. adminKpis.ordersDelivered / this.adminKpis.totalOrders) * 100;
  }

  get cancellationRate(): number {
    if (!this.adminKpis || this.adminKpis. totalOrders === 0) return 0;
    return (this.adminKpis.ordersCanceled / this.adminKpis.totalOrders) * 100;
  }
  refreshData() {
    this.loadDashboardData();
  }

  exportData() {
    if (! this.adminKpis) return;

    const data = {
      kpis: this.adminKpis,
      exportDate: new Date().toISOString(),
      summary: this.getSummaryData()
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `dashboard-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
  private getSummaryData() {
    if (!this.adminKpis) return null;

    return {
      activeOrders: this.adminKpis.ordersCreated + this.adminKpis.ordersReserved + this.adminKpis.ordersShipped,
      successRate: ((this.adminKpis.ordersDelivered / this.adminKpis.totalOrders) * 100),
      cancellationRate: ((this.adminKpis.ordersCanceled / this.adminKpis. totalOrders) * 100)
    };
  }
}
