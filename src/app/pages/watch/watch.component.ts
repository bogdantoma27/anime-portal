import { Component, inject } from '@angular/core';
import { WatchService } from '../../service/watch.service';

@Component({
  selector: 'app-watch',
  imports: [],
  templateUrl: './watch.component.html',
  styleUrl: './watch.component.scss'
})
export class WatchComponent {
  watchEntries: any[] = [];

  private watchService: WatchService = inject(WatchService);

  fetchWatchEpisodes() {
    this.watchService.getWatchEpisodes().subscribe((res) => {
      this.watchEntries = res.data;
    });
  }
}
