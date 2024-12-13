import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SeasonService {
  private apiService: ApiService = inject(ApiService);

  getCurrentSeason(): Observable<any> {
    return this.apiService.get('/seasons/now');
  }

  getSeason(year: number, season: string): Observable<any> {
    return this.apiService.get(`/seasons/${year}/${season}`);
  }
}
