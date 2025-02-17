import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AnimeSearchParams, AnimeResult } from '../models/anime.model';
import { Pagination } from '../models/base.model';
import { Recommendation } from '../models/recommendation.model';
import { Review } from '../models/review.model';
import { Character } from '../models/character.model';

@Injectable({ providedIn: 'root' })
export class AnimeService {
  private http = inject(HttpClient);
  private baseUrl = 'https://api.jikan.moe/v4';

  search(params: AnimeSearchParams = {}): Observable<{
    pagination: Pagination;
    data: AnimeResult[];
  }> {
    return this.http.get<{
      pagination: Pagination;
      data: AnimeResult[];
    }>(`${this.baseUrl}/anime`, { params: this.convertParams(params) });
  }

  getById(id: number): Observable<{ data: AnimeResult }> {
    return this.http.get<{ data: AnimeResult }>(`${this.baseUrl}/anime/${id}/full`);
  }

  getCharacters(id: number): Observable<{ data: Character[] }> {
    return this.http.get<{ data: Character[] }>(`${this.baseUrl}/anime/${id}/characters`);
  }

  private convertParams(params: Record<string, any>): Record<string, string> {
    const httpParams: Record<string, string> = {};

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        httpParams[key] = Array.isArray(value)
          ? value.join(',')
          : String(value);
      }
    });

    return httpParams;
  }

    // Top anime
    getTopAnime(params: {
      type?: 'anime' | 'movie' | 'tv' | 'ova' | 'special' | 'ona' | 'music';
      filter?: 'airing' | 'upcoming' | 'bypopularity' | 'favorite';
      page?: number;
      limit?: number;
    } = {}): Observable<{
      pagination: Pagination;
      data: AnimeResult[];
    }> {
      // Convert params to string values
      const httpParams: Record<string, string> = {};

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          httpParams[key] = String(value);
        }
      });

      return this.http.get<{
        pagination: Pagination;
        data: AnimeResult[];
      }>(`${this.baseUrl}/top/anime`, {
        params: httpParams
      });
    }

    getReviews(id: number): Observable<{ data: Review[] }> {
      return this.http.get<{ data: Review[] }>(`${this.baseUrl}/anime/${id}/reviews`);
    }

    getRecommendations(id: number): Observable<{ data: Recommendation[] }> {
      return this.http.get<{ data: Recommendation[] }>(`${this.baseUrl}/anime/${id}/recommendations`);
    }
}
