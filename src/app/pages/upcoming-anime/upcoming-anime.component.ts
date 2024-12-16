import { Component, inject, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { YoutubeDialogComponent } from '../../components/youtube-dialog/youtube-dialog.component';
import { ApiService } from '../../service/api.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CountdownModule } from 'ngx-countdown'; // Use ngx-countdown for the timer
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-upcoming-anime',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatPaginatorModule,
    NgxSkeletonLoaderModule,
    RouterModule,
    CountdownModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    CommonModule
  ],
  templateUrl: './upcoming-anime.component.html',
  styleUrl: './upcoming-anime.component.scss',
})
export class UpcomingAnimeComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  isGridVisible = true; // Track visibility of the anime grid
  countdownTimes: { [key: number]: string } = {}; // Store countdown strings for each anime
  private timerInterval: any;
  filteredAnimes: any[] = []; // Store the filtered anime data
  loading = false; // Loading state for data
  pagination = {
    last_visible_page: 1,
    has_next_page: true,
    current_page: 1,
    items: {
      count: 0,
      total: 0,
      per_page: 25,
    },
  };

  private apiService = inject(ApiService);
  private dialog = inject(MatDialog);
  private subscription: Subscription = new Subscription();

  ngOnInit() {
    this.fetchAnimes(); // Fetch the anime data on component init
    this.startCountdownTimer(); // Start the countdown timer
  }

  // Fetch anime data from the API
  fetchAnimes(page: number = 1) {
    this.loading = true;
    const apiSubscription = this.apiService
      .get<any>(`/seasons/upcoming?filter=tv&limit=20&page=${page.toString()}`)
      .subscribe({
        next: (response) => {
          // Sort the anime data by release date
          this.filteredAnimes = this.sortAnimesByReleaseDate(response.data || []);
          this.initializeCountdowns(); // Initialize countdowns once data is fetched
          this.pagination = response.pagination;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching anime data', error);
          this.loading = false;
        },
        complete: () => {
          console.log('Anime data fetching complete.');
        }
      });

    // Add the subscription to the list of active subscriptions for later unsubscription
    this.subscription.add(apiSubscription);
  }

  // Sort the anime list by release date (closest date first, unknown dates last)
  sortAnimesByReleaseDate(animes: any[]): any[] {
    return animes.sort((a, b) => {
      const dateA = a.aired?.from ? new Date(a.aired.from).getTime() : Infinity;
      const dateB = b.aired?.from ? new Date(b.aired.from).getTime() : Infinity;

      // Sort by date, with unknown dates (Infinity) at the end
      return dateA - dateB;
    });
  }

  // Handle pagination page change
  onPageChange(event: PageEvent): void {
    this.pagination.items.per_page = event.pageSize;
    this.pagination.current_page = event.pageIndex + 1;
    this.fetchAnimes(this.pagination.current_page);
  }

  toggleGrid() {
    this.isGridVisible = !this.isGridVisible; // Toggle the grid's visibility
  }

  // Initialize countdown times
  initializeCountdowns() {
    this.filteredAnimes.forEach((anime) => {
      this.countdownTimes[anime.mal_id] = this.calculateCountdown(
        anime.aired.from
      );
    });
  }

  // Start timer interval
  startCountdownTimer() {
    this.timerInterval = setInterval(() => {
      this.updateCountdowns();
    }, 1000);
  }

  // Update countdown times for all animes
  updateCountdowns() {
    this.filteredAnimes.forEach((anime) => {
      this.countdownTimes[anime.mal_id] = this.calculateCountdown(
        anime.aired.from
      );
    });
  }

  // Calculate countdown time
  calculateCountdown(fromDate: string | null): string {
    if (fromDate) {
      const fromTime = new Date(fromDate).getTime();
      const currentTime = Date.now();
      const diffInMillis = Math.max(fromTime - currentTime, 0);

      const months = Math.floor(diffInMillis / (1000 * 60 * 60 * 24 * 30));
      const weeks = Math.floor(
        (diffInMillis % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24 * 7)
      );
      const days = Math.floor(
        (diffInMillis % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24)
      );
      const hours = Math.floor(
        (diffInMillis % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (diffInMillis % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((diffInMillis % (1000 * 60)) / 1000);

      let format = '';
      if (months > 0) format += `${months}m `;
      if (weeks > 0) format += `${weeks}w `;
      format += `${days}d ${hours}h ${minutes}m ${seconds}s`;

      return format;
    }
    return '0d 0h 0m 0s';
  }

  playTrailer(season: any): void {
    this.dialog.open(YoutubeDialogComponent, {
      data: { videoId: season.trailer.youtube_id }, // Pass the video ID to the dialog
    });
  }

  ngOnDestroy() {
    clearInterval(this.timerInterval); // Clear interval on component destroy
    this.subscription.unsubscribe(); // Unsubscribe from all observables on destroy
  }
}
