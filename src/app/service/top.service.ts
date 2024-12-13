import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TopService {
  private apiService: ApiService = inject(ApiService);

  getTopAnime(page: number = 1): Observable<any> {
    const params = new HttpParams().set('page', page);
    return this.apiService.get('/top/anime',{params});
  }

  getTopManga(page: number = 1): Observable<any> {
    const params = new HttpParams().set('page', page);
    return this.apiService.get('/top/manga', {params});
  }
}
