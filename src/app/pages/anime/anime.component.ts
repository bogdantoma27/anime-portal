import { Component, inject, ViewChild } from '@angular/core';
import { Anime, AnimeResponse } from '../../../interface/anime.interface';
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
import { SelectAllDirective } from '../../shared/directives/select-all.directive';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { YoutubeDialogComponent } from '../../components/youtube-dialog/youtube-dialog.component';
import { MatDialog } from '@angular/material/dialog';

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
    SelectAllDirective,
    MatPaginatorModule,
    NgxSkeletonLoaderModule,
  ],
  templateUrl: './anime.component.html',
  styleUrl: './anime.component.scss',
})
export class AnimeComponent {
  filters = {
    q: '',
    minScore: '',
    maxScore: '',
    type: '',
    genres: [],
    status: '',
    orderBy: '',
    sort: 'asc',
  };

  availableGenres = [
    { id: 1, label: 'Action' },
    { id: 2, label: 'Adventure' },
    { id: 3, label: 'Cars' },
    { id: 4, label: 'Comedy' },
    { id: 5, label: 'Avante Garde' },
    { id: 6, label: 'Demons' },
    { id: 7, label: 'Mystery' },
    { id: 8, label: 'Drama' },
    { id: 9, label: 'Ecchi' },
    { id: 10, label: 'Fantasy' },
    { id: 11, label: 'Game' },
    { id: 12, label: 'Hentai' },
    { id: 13, label: 'Historical' },
    { id: 14, label: 'Horror' },
    { id: 15, label: 'Kids' },
    { id: 17, label: 'Martial Arts' },
    { id: 18, label: 'Mecha' },
    { id: 19, label: 'Music' },
    { id: 20, label: 'Parody' },
    { id: 21, label: 'Samurai' },
    { id: 22, label: 'Romance' },
    { id: 23, label: 'School' },
    { id: 24, label: 'Sci Fi' },
    { id: 25, label: 'Shoujo' },
    { id: 26, label: 'Girls Love' },
    { id: 27, label: 'Shounen' },
    { id: 28, label: 'Boys Love' },
    { id: 29, label: 'Space' },
    { id: 30, label: 'Sports' },
    { id: 31, label: 'Super Power' },
    { id: 32, label: 'Vampire' },
    { id: 35, label: 'Harem' },
    { id: 36, label: 'Slice Of Life' },
    { id: 37, label: 'Supernatural' },
    { id: 38, label: 'Military' },
    { id: 39, label: 'Police' },
    { id: 40, label: 'Psychological' },
    { id: 41, label: 'Suspense' },
    { id: 42, label: 'Seinen' },
    { id: 43, label: 'Josei' },
    { id: 46, label: 'Award Winning' },
    { id: 47, label: 'Gourmet' },
    { id: 48, label: 'Work Life' },
    { id: 49, label: 'Erotica' },
  ];

  mediaOptions = [
    { value: 'tv', label: 'TV' },
    { value: 'movie', label: 'Movie' },
    { value: 'ova', label: 'OVA' },
    { value: 'special', label: 'Special' },
    { value: 'ona', label: 'ONA' },
    { value: 'music', label: 'Music' },
  ];
  statusOptions = [
    { value: 'airing', label: 'Airing' },
    { value: 'complete', label: 'Completed' },
    { value: 'upcoming', label: 'Upcoming' },
  ];
  orderOptions = [
    { value: 'title', label: 'Title' },
    { value: 'start_date', label: 'Start Date' },
    { value: 'end_date', label: 'End Date' },
    { value: 'episodes', label: 'Episodes' },
    { value: 'score', label: 'Score' },
    { value: 'rank', label: 'Rank' },
    { value: 'popularity', label: 'Popularity' },
    { value: 'favorites', label: 'Favorites' },
  ];

  filterForm: FormGroup;
  filteredAnimes: any[] = [];
  loading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator; // Access paginator reference

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
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);

  constructor() {
    // Initialize the filter form
    this.filterForm = this.fb.group({
      q: [''],
      minScore: [''],
      maxScore: [''],
      type: [''],
      genres: [''],
      status: ['airing'],
      orderBy: ['score'],
      sort: ['desc'],
    });
  }

  ngOnInit() {
    this.availableGenres.sort((a, b) => a.label.localeCompare(b.label));

    // Listen for changes in the filter form and debounce input
    this.filterForm.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => {
        this.fetchAnimes();
      });

    // Initial data fetch
    this.fetchAnimes();
  }

  fetchAnimes(page: number = 1) {
    this.loading = true;

    // Extract form values
    const filters = this.filterForm.value;

    // Dynamically build HttpParams by filtering out empty values
    let params = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value) {
        acc = acc.set(key, value.toString());
      }
      return acc;
    }, new HttpParams());

    // Add pagination parameters
    params = params
      .set('page', page.toString())
      .set('limit', this.pagination.items.per_page.toString());

    // API call
    this.apiService.get<any>('/anime', { params }).subscribe((response) => {
      console.log('API Response:', response);
      this.filteredAnimes = response.data || [];
      this.pagination = response.pagination; // Update pagination data
      this.loading = false;
    });
  }

  toggleSynopsis(anime: any, event: Event): void {
    event.preventDefault(); // Prevent default anchor behavior
    anime.showFullSynopsis = !anime.showFullSynopsis;
  }

  // Getter to return all genre IDs in a flat array for the SelectAllDirective
  get allGenres() {
    return this.availableGenres.flat().map((g) => g.id);
  }

  // Handle paginator page change
  onPageChange(event: PageEvent): void {
    this.pagination.items.per_page = event.pageSize;
    this.pagination.current_page = event.pageIndex + 1;
    this.fetchAnimes(this.pagination.current_page);
  }

  playTrailer(season: any): void {
    this.dialog.open(YoutubeDialogComponent, {
      data: { videoId: season.trailer.youtube_id }, // Pass the video ID to the dialog
      // width: '80%', // You can customize the width of the dialog as needed
      // height: '80%', // You can customize the height as well
    });
  }

  // Processed values for display in the template
  getStudios(anime: any): string {
    return anime.studios?.map((studio) => studio.name).join(', ') || 'N/A';
  }

  getProducers(anime: any): string {
    return (
      anime.producers?.map((producer) => producer.name).join(', ') || 'N/A'
    );
  }
}
