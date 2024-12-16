import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MangaService {
  private api: ApiService = inject(ApiService);

  getMangaById(id: number): Observable<any> {
    return this.api.get(`/manga/${id}`);
  }

  searchManga(params: HttpParams | { [key: string]: string | number }): Observable<any> {
    const httpParams = params instanceof HttpParams
      ? params
      : new HttpParams({ fromObject: params });

    return this.api.get<any>('/manga', { params: httpParams });
  }

  getMangaCharacters(id: number): Observable<any> {
    return this.api.get(`/manga/${id}/characters`);
  }

  getMangaNews(id: number): Observable<any> {
    return this.api.get(`/manga/${id}/news`);
  }

  getMangaForum(id: number): Observable<any> {
    return this.api.get(`/manga/${id}/forum`);
  }

  getMangaStatistics(id: number): Observable<any> {
    return this.api.get(`/manga/${id}/statistics`);
  }

  getMangaRecommendations(id: number): Observable<any> {
    return this.api.get(`/manga/${id}/recommendations`);
  }

  getMangaReviews(id: number): Observable<any> {
    return this.api.get(`/manga/${id}/reviews`);
  }
}
