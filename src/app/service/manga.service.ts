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

  searchManga(query: string, page: number = 1): Observable<any> {
    const params = new HttpParams().set('q', query).set('page', page);
    return this.api.get('/manga', {params});
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
}
