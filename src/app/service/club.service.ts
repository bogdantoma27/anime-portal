import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ClubService {
  private apiService: ApiService = inject(ApiService);

  getClubById(id: number): Observable<any> {
    return this.apiService.get(`/clubs/${id}`);
  }

  getClubMembers(id: number): Observable<any> {
    return this.apiService.get(`/clubs/${id}/members`);
  }

  getClubStaff(id: number): Observable<any> {
    return this.apiService.get(`/clubs/${id}/staff`);
  }
}
