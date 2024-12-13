import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private apiService: ApiService = inject(ApiService);

  getAnimeReviews(page: number = 1): Observable<any> {
    const params = new HttpParams().set('page', page);
    return this.apiService.get('/reviews/anime', {params});
  }

  getMangaReviews(page: number = 1): Observable<any> {
    const params = new HttpParams().set('page', page);
    return this.apiService.get('/reviews/manga', {params});
  }
}
