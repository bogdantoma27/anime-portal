import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = 'https://api.jikan.moe/v4';

  constructor(private http: HttpClient) {}

  // get<T>(
  //   endpoint: string,
  //   params: HttpParams = new HttpParams()
  // ): Observable<T> {
  //   return this.http.get<T>(`${this.baseUrl}${endpoint}`, { params });
  // }

  get<T>(endpoint: string, options?: { params?: HttpParams }) {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, options);
  }
}
