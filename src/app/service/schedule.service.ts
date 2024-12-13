import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ScheduleService {
  private apiService: ApiService = inject(ApiService);

  getSchedules(): Observable<any> {
    return this.apiService.get('/schedules');
  }
}
