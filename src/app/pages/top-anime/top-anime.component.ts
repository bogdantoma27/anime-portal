import { Component, inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { TopService } from '../../service/top.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { YoutubeDialogComponent } from '../../components/youtube-dialog/youtube-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-top-anime',
  imports: [MatProgressSpinnerModule, MatCardModule, CommonModule, MatDividerModule, MatPaginatorModule,
    MatIconModule, MatButtonModule, RouterModule
  ],
  templateUrl: './top-anime.component.html',
  styleUrl: './top-anime.component.scss',
})
export class TopAnimeComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  isGridVisible: boolean = true; // Tracks the visibility of the anime grid
  filteredAnimes: any[] = []; // Holds the fetched anime data
  loading: boolean = false; // Indicates whether data is being loaded

  // Pagination configuration
  pagination = {
    items: {
      total: 0,
      per_page: 25,
    },
    current_page: 1,
  };

  private apiService = inject(ApiService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.fetchAnimes(); // Fetch data when the component initializes
  }

  // Fetch anime data from the API
  fetchAnimes(page: number = 1): void {
    this.loading = true;
    this.apiService
      .get<any>(`/top/anime?page=${page}&limit=${this.pagination.items.per_page}`)
      .subscribe(
        (response) => {
          this.filteredAnimes = response.data || [];
          this.pagination.items.total = response.pagination.items.total;
          this.pagination.items.per_page = response.pagination.items.per_page;
          this.pagination.current_page = response.pagination.current_page;
          this.loading = false;
        },
        (error) => {
          console.error('Error fetching top-rated animes:', error);
          this.loading = false;
        }
      );
  }

  // Handle pagination changes
  onPageChange(event: PageEvent): void {
    this.pagination.items.per_page = event.pageSize;
    this.pagination.current_page = event.pageIndex + 1;
    this.fetchAnimes(this.pagination.current_page);
  }

  // Toggles the visibility of the grid
  toggleGrid(): void {
    this.isGridVisible = !this.isGridVisible;
  }

  // Play YouTube trailer in a dialog
  playTrailer(anime: any): void {
    this.dialog.open(YoutubeDialogComponent, {
      data: { videoId: anime.trailer.youtube_id },
    });
  }
}
