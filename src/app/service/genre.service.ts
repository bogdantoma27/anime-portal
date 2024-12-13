import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GenreService {
  private apiService: ApiService = inject(ApiService);

  getAnimeGenres(): Observable<any> {
    return this.apiService.get('/genres/anime');
  }

  getMangaGenres(): Observable<any> {
    return this.apiService.get('/genres/manga');
  }
}
