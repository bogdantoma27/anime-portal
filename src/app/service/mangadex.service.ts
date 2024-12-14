import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface MangaSearchResponse {
  data: Array<{ attributes: { title: string }; id: string }>;
}

interface MangaChapterResponse {
  data: Array<{
    attributes: { title: string; chapter: number };
    relationships: Array<{ attributes: { fileName: string } }>;
  }>;
}

@Injectable({
  providedIn: 'root',
})
export class MangadexService {
  private apiBaseUrl =
    'https://cors-anywhere.herokuapp.com/https://api.mangadex.org';
  private jikanApiBaseUrl = 'https://api.jikan.moe/v4/manga'; // Jikan API base URL

  constructor(private http: HttpClient) {}

  // Search manga by title
  searchManga(query: string): Observable<MangaSearchResponse> {
    return this.http.get<MangaSearchResponse>(
      `${this.apiBaseUrl}/manga?title=${query}&includes[]=cover_art`
    );
  }

  // Get manga chapters by manga ID
  getMangaChapters(mangaId: string): Observable<MangaChapterResponse> {
    return this.http.get<MangaChapterResponse>(
      `${this.apiBaseUrl}/manga/${mangaId}/feed`
    );
  }

  // Get manga cover image URL from Mangadex
  getMangaCoverUrl(manga: any): string {
    const cover = manga?.relationships?.find(
      (rel: any) => rel.type === 'cover_art'
    );
    if (cover && cover.attributes?.fileName) {
      return `https://uploads.mangadex.org/covers/${manga.id}/${cover.attributes.fileName}`;
    }
    return 'assets/default-cover.jpg'; // Fallback default image
  }

  // Search manga by title using the Jikan API
  getCoverFromJikan(title: string): Observable<any> {
    return this.http.get<any>(`${this.jikanApiBaseUrl}?q=${title}&limit=1`);
  }
}
