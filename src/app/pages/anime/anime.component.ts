import { Component, inject, ViewChild } from '@angular/core';
import { Anime, AnimeResponse } from '../../interface/anime.interface';
import { ApiService } from '../../service/api.service';
import { CommonModule } from '@angular/common';
import { AnimeService } from '../../service/anime.service';
import { HttpParams } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { YoutubeDialogComponent } from '../../components/youtube-dialog/youtube-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import {
  ANIME_AVAILABLE_GENRES,
  ANIME_MEDIA_OPTIONS,
  ANIME_STATUS_OPTIONS,
  ANIME_ORDER_OPTIONS,
} from '../../interface/constants.interface.';
import { OrderBy, SortOrder } from '../../enums/anime.enum';

@Component({
  selector: 'app-anime',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatBadgeModule,
    MatPaginatorModule,
    NgxSkeletonLoaderModule,
  ],
  templateUrl: './anime.component.html',
  styleUrl: './anime.component.scss',
})
export class AnimeComponent {
  filterForm: FormGroup;
  filteredAnimes: Anime[] = [];
  loading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

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

  availableGenres = ANIME_AVAILABLE_GENRES;
  mediaOptions = ANIME_MEDIA_OPTIONS;
  statusOptions = ANIME_STATUS_OPTIONS;
  orderOptions = ANIME_ORDER_OPTIONS;

  private animeService = inject(AnimeService);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);

  constructor() {
    this.filterForm = this.fb.group({
      q: [''],
      minScore: [''],
      maxScore: [''],
      type: [''],
      genres: [[]],
      status: [''],
      orderBy: [OrderBy.SCORE],
      sort: [SortOrder.DESC],
    });
  }

  ngOnInit(): void {
    this.initializeGenres();
    this.setupFormSubscriptions();
    this.fetchAnimes();
  }

  private initializeGenres(): void {
    this.availableGenres.sort((a, b) => a.label.localeCompare(b.label));

    // You may want to explicitly set availableGenres here if you're not binding it directly.
    this.availableGenres = [...ANIME_AVAILABLE_GENRES];
  }

  private setupFormSubscriptions(): void {
    this.filterForm.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => {
        this.resetPagination();
        this.fetchAnimes();
      });
  }

  fetchAnimes(page: number = 1): void {
    this.loading = true;
    const filters = this.filterForm.value;

    // Refactor HttpParams construction with modern, concise logic
    const params = new HttpParams({
      fromObject: Object.fromEntries(
        Object.entries(filters)
          .filter(([_, value]) => value?.toString().trim()) // Filters out falsy and empty string values
          .map(([key, value]) => [key, String(value)]) // Converts all values to strings
      ),
    })
      .set('page', String(page))
      .set('limit', String(this.pagination?.items?.per_page ?? 10)); // Default limit if pagination is undefined

    this.animeService.searchAnime(params).subscribe({
      next: (response) => {
        this.filteredAnimes = response.data || [];
        this.pagination = response.pagination;
      },
      error: () => {
        this.filteredAnimes = [];
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  resetPagination(): void {
    this.pagination = {
      last_visible_page: 1,
      has_next_page: true,
      current_page: 1,
      items: { count: 0, total: 0, per_page: 25 },
    };
  }

  toggleSynopsis(anime: Anime): void {
    anime.showFullSynopsis = !anime.showFullSynopsis;
  }

  getStudios(anime: Anime): string {
    return anime.studios?.map((studio) => studio.name).join(', ') || 'N/A';
  }

  getProducers(anime: Anime): string {
    return (
      anime.producers?.map((producer) => producer.name).join(', ') || 'N/A'
    );
  }

  onPageChange(event: PageEvent): void {
    this.pagination.items.per_page = event.pageSize;
    this.pagination.current_page = event.pageIndex + 1;
    this.fetchAnimes(this.pagination.current_page);
  }

  playTrailer(anime: Anime): void {
    if (anime.trailer?.youtube_id) {
      this.dialog.open(YoutubeDialogComponent, {
        data: { videoId: anime.trailer.youtube_id },
      });
    }
  }
}
