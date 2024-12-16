import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { HttpParams } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, retryWhen, scan, switchMap, delayWhen } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AnimeService {
  private api: ApiService = inject(ApiService);

  // Retry logic for handling rate limits (HTTP 429)
  private retryOnRateLimit<T>(source: Observable<T>): Observable<T> {
    return source.pipe(
      retryWhen((errors) =>
        errors.pipe(
          scan((attempts, error) => {
            if (error?.status === 429 && attempts < 7) {
              attempts++; // Increase the retry count
              return attempts; // Continue retrying
            }
            throw error; // If not a 429 error or max retries reached, throw error
          }, 0),
          switchMap((attempts) =>
            attempts < 7
              ? timer(1000) // Retry after 1000ms if rate-limited
              : throwError(() => new Error('Max retry attempts reached'))
          )
        )
      ),
      catchError((error) => {
        console.error('API Error:', error);
        return throwError(() => error); // Re-throw the error after retries fail
      })
    );
  }

  getAnimeById(id: number): Observable<any> {
    return this.retryOnRateLimit(this.api.get(`/anime/${id}`));
  }

  searchAnime(params: HttpParams | { [key: string]: string | number }): Observable<any> {
    const httpParams = params instanceof HttpParams
      ? params
      : new HttpParams({ fromObject: params });

    return this.api.get<any>('/anime', { params: httpParams });
  }

  getAnimePictures(id: number): Observable<any> {
    return this.api.get(`/anime/${id}/pictures`);
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

  getAnimeReviews(id: number): Observable<any> {
    return this.api.get(`/anime/${id}/reviews`);
  }

  getAnimeStreamingLinks(id: number): Observable<any> {
    return this.api.get(`/anime/${id}/streaming`);
  }
}
