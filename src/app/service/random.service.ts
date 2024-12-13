import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RandomService {
  private apiService: ApiService = inject(ApiService);

  getRandomAnime(): Observable<any> {
    return this.apiService.get('/random/anime');
  }

  getRandomManga(): Observable<any> {
    return this.apiService.get('/random/manga');
  }
}
