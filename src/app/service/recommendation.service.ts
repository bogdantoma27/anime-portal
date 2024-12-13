import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RecommendationService {
  private apiService: ApiService = inject(ApiService);

  getRecentAnimeRecommendations(): Observable<any> {
    return this.apiService.get('/recommendations/anime');
  }

  getRecentMangaRecommendations(): Observable<any> {
    return this.apiService.get('/recommendations/manga');
  }
}
