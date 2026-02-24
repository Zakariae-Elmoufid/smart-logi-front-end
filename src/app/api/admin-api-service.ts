import {Injectable, signal} from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import {AdminKPIs} from '../features/admin/models/admin-kpis.model';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class AdminApiService {
  private apiUrl = `${environment.apiUrl}/admin`;


  constructor(private http: HttpClient) {}

  getGlobalKPIs(): Observable<AdminKPIs> {
    return this.http.get<AdminKPIs>(`${this.apiUrl}/kpis`);


  }




}

