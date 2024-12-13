import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AnimeService {
  private api: ApiService = inject(ApiService);

  getAnimeById(id: number): Observable<any> {
    return this.api.get(`/anime/${id}`);
  }

  searchAnime(query: string, page: number = 1): Observable<any> {
    const params = new HttpParams().set('q', query).set('page', page);
    return this.api.get('/anime', {params});
  }

  getAnimeCharacters(id: number): Observable<any> {
    return this.api.get(`/anime/${id}/characters`);
  }

  getAnimeEpisodes(id: number): Observable<any> {
    return this.api.get(`/anime/${id}/episodes`);
  }

  getAnimeNews(id: number): Observable<any> {
    return this.api.get(`/anime/${id}/news`);
  }

  getAnimeForum(id: number): Observable<any> {
    return this.api.get(`/anime/${id}/forum`);
  }

  getAnimeVideos(id: number): Observable<any> {
    return this.api.get(`/anime/${id}/videos`);
  }

  getAnimeStatistics(id: number): Observable<any> {
    return this.api.get(`/anime/${id}/statistics`);
  }

  getAnimeRecommendations(id: number): Observable<any> {
    return this.api.get(`/anime/${id}/recommendations`);
  }
}
