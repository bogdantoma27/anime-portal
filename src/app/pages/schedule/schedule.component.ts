import { Component, inject } from '@angular/core';
import { ScheduleService } from '../../service/schedule.service';

@Component({
  selector: 'app-schedule',
  imports: [],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss'
})
export class ScheduleComponent {
  schedules: any[] = [];

  private scheduleService: ScheduleService = inject(ScheduleService);

  fetchSchedules() {
    this.scheduleService.getSchedules().subscribe((res) => {
      this.schedules = res.data;
    });
  }
}
