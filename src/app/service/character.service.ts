import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CharacterService {
  private apiService: ApiService = inject(ApiService);

  getCharacterById(id: number): Observable<any> {
    return this.apiService.get(`/characters/${id}`);
  }

  getCharacterAnime(id: number): Observable<any> {
    return this.apiService.get(`/characters/${id}/anime`);
  }

  getCharacterManga(id: number): Observable<any> {
    return this.apiService.get(`/characters/${id}/manga`);
  }

  getCharacterPictures(id: number): Observable<any> {
    return this.apiService.get(`/characters/${id}/pictures`);
  }
}
