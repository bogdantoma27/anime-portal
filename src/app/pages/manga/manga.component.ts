import { Component, inject, ViewChild } from '@angular/core';
import { MangaService } from '../../service/manga.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { YoutubeDialogComponent } from '../../components/youtube-dialog/youtube-dialog.component';
import { HttpParams } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import {
  MANGA_AVAILABLE_GENRES,
  MANGA_MEDIA_OPTIONS,
  MANGA_STATUS_OPTIONS,
  MANGA_ORDER_OPTIONS,
} from '../../interface/constants.interface.';
import { OrderBy, SortOrder } from '../../enums/manga.enum';

@Component({
  selector: 'app-manga',
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
  ],
  templateUrl: './manga.component.html',
  styleUrl: './manga.component.scss',
})
export class MangaComponent {
  filterForm: FormGroup;
  filteredMangas: any[] = [];
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

  availableGenres = MANGA_AVAILABLE_GENRES;
  mediaOptions = MANGA_MEDIA_OPTIONS;
  statusOptions = MANGA_STATUS_OPTIONS;
  orderOptions = MANGA_ORDER_OPTIONS;

  private mangaService = inject(MangaService);
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

  ngOnInit() {
    this.initializeGenres();
    this.setupFormSubscriptions();
    this.fetchMangas();
  }

  private initializeGenres(): void {
    MANGA_AVAILABLE_GENRES.sort((a, b) => a.label.localeCompare(b.label));

    // You may want to explicitly set availableGenres here if you're not binding it directly.
    this.availableGenres = [...MANGA_AVAILABLE_GENRES];
  }

  private setupFormSubscriptions(): void {
    this.filterForm.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => {
        this.resetPagination();
        this.fetchMangas();
      });
  }

  private resetPagination(): void {
    this.pagination = {
      last_visible_page: 1,
      has_next_page: true,
      current_page: 1,
      items: { count: 0, total: 0, per_page: 25 },
    };
  }

  fetchMangas(page: number = 1): void {
    this.loading = true;

    const filters = this.filterForm.value;
    const params = new HttpParams({
      fromObject: Object.fromEntries(
        Object.entries(filters)
          .filter(([_, value]) => value?.toString().trim())
          .map(([key, value]) => [key, String(value)])
      ),
    })
      .set('page', String(page))
      .set('limit', String(this.pagination.items.per_page));

    this.mangaService.searchManga(params).subscribe({
      next: (response) => {
        this.filteredMangas = response.data || [];
        this.pagination = response.pagination;
      },
      error: () => {
        this.filteredMangas = [];
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  toggleSynopsis(manga: any, event: Event): void {
    event.preventDefault();
    manga.showFullSynopsis = !manga.showFullSynopsis;
  }

  getStudios(manga: any): string {
    return manga.studios?.map((studio) => studio.name).join(', ') || 'N/A';
  }

  getProducers(manga: any): string {
    return (
      manga.producers?.map((producer) => producer.name).join(', ') || 'N/A'
    );
  }

  onPageChange(event: PageEvent): void {
    this.pagination.current_page = event.pageIndex + 1;
    this.fetchMangas(this.pagination.current_page);
  }

  openVideoDialog(mangaId: string): void {
    this.dialog.open(YoutubeDialogComponent, {
      data: { mangaId },
    });
  }
}
