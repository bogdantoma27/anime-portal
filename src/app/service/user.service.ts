import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiService: ApiService = inject(ApiService);

  getUserById(username: string): Observable<any> {
    return this.apiService.get(`/users/${username}`);
  }

  getUserStatistics(username: string): Observable<any> {
    return this.apiService.get(`/users/${username}/statistics`);
  }
}
