import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map, catchError, of } from "rxjs";

// search.service.ts
@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = 'https://api.jikan.moe/v4/anime';

  constructor(private http: HttpClient) {}

  searchAnime(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?q=${query}&limit=10`).pipe(
      map((response: any) => response['data']),
      catchError(error => {
        console.error('Search error', error);
        return of([]);
      })
    );
  }
}
