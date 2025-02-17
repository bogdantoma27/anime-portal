import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { AnimeResult } from "../models/anime.model";
import { Pagination } from "../models/base.model";

@Injectable({ providedIn: "root" })
export class SeasonService {
  private http = inject(HttpClient);
  private baseUrl = "https://api.jikan.moe/v4";

  getSeasonNow(): Observable<{
    pagination: Pagination;
    data: AnimeResult[];
  }> {
    return this.http.get<{
      pagination: Pagination;
      data: AnimeResult[];
    }>(`${this.baseUrl}/seasons/now`);
  }
}
