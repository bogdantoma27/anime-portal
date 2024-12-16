import { Component, inject, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { YoutubeDialogComponent } from '../../components/youtube-dialog/youtube-dialog.component';
import { ApiService } from '../../service/api.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-top-manga',
  imports: [MatProgressSpinnerModule, MatCardModule, CommonModule, MatDividerModule, MatPaginatorModule,
    MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './top-manga.component.html',
  styleUrl: './top-manga.component.scss'
})
export class TopMangaComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  isGridVisible: boolean = true; // Tracks the visibility of the manga grid
  filteredManga: any[] = []; // Holds the fetched manga data
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
    this.fetchManga(); // Fetch data when the component initializes
  }

  // Fetch anime data from the API
  fetchManga(page: number = 1): void {
    this.loading = true;
    this.apiService
      .get<any>(`/top/manga?page=${page}&limit=${this.pagination.items.per_page}`)
      .subscribe(
        (response) => {
          this.filteredManga = response.data || [];
          this.pagination.items.total = response.pagination.items.total;
          this.pagination.items.per_page = response.pagination.items.per_page;
          this.pagination.current_page = response.pagination.current_page;
          this.loading = false;
        },
        (error) => {
          console.error('Error fetching top-rated manga:', error);
          this.loading = false;
        }
      );
  }

  // Handle pagination changes
  onPageChange(event: PageEvent): void {
    this.pagination.items.per_page = event.pageSize;
    this.pagination.current_page = event.pageIndex + 1;
    this.fetchManga(this.pagination.current_page);
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

  getFormattedGenres(genres: any[]): string {
    // Check if genres exist and are an array, then join their names with commas
    return genres?.map(genre => genre?.name).join(', ') ?? 'N/A';
  }
}
