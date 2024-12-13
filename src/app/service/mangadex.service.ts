import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface MangaSearchResponse {
  data: Array<{ attributes: { title: string }, id: string }>;
}

interface MangaChapterResponse {
  data: Array<{
    attributes: { title: string, chapter: number };
    relationships: Array<{ attributes: { fileName: string } }>;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class MangadexService {

  private apiBaseUrl = 'https://api.mangadex.org';

  constructor(private http: HttpClient) { }

  // Search manga by title
  searchManga(query: string): Observable<MangaSearchResponse> {
    return this.http.get<MangaSearchResponse>(`${this.apiBaseUrl}/manga?title=${query}&includes[]=cover_art`);
  }

  // Get manga chapters by manga ID
  getMangaChapters(mangaId: string): Observable<MangaChapterResponse> {
    return this.http.get<MangaChapterResponse>(`${this.apiBaseUrl}/manga/${mangaId}/feed`);
  }

  // Get manga images for a specific chapter
  getChapterImages(mangaId: string, chapterId: string): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/manga/${mangaId}/chapter/${chapterId}/images`);
  }
}
