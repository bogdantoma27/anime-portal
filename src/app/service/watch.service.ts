import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WatchService {
  private apiService: ApiService = inject(ApiService);

  getWatchEpisodes(page: number = 1): Observable<any> {
    const params = new HttpParams().set('page', page);
    return this.apiService.get('/watch/episodes', params);
  }

  getWatchPromos(page: number = 1): Observable<any> {
    const params = new HttpParams().set('page', page);
    return this.apiService.get('/watch/promos', params);
  }
}
