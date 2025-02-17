import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { Pagination } from "../models/base.model";
import { Character } from "../models/character.model";

@Injectable({ providedIn: "root" })
export class CharacterService {
  private http = inject(HttpClient);
  private baseUrl = "https://api.jikan.moe/v4";

  getTopCharacters(
    params: {
      page?: number;
      limit?: number;
    } = {}
  ): Observable<{
    pagination: Pagination;
    data: Character[];
  }> {
    return this.http.get<{
      pagination: Pagination;
      data: Character[];
    }>(`${this.baseUrl}/top/characters`, {
      params: this.convertParams(params),
    });
  }

  private convertParams(params: Record<string, any>): Record<string, string> {
    const httpParams: Record<string, string> = {};

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        httpParams[key] = Array.isArray(value)
          ? value.join(",")
          : String(value);
      }
    });

    return httpParams;
  }
}
