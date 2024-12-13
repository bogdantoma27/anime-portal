import { Component, inject, ViewChild } from '@angular/core';
import { MangaService } from '../../service/manga.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { SelectAllDirective } from '../../shared/directives/select-all.directive';
import { YoutubeDialogComponent } from '../../components/youtube-dialog/youtube-dialog.component';
import { HttpParams } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ApiService } from '../../service/api.service';

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
    SelectAllDirective,
    MatPaginatorModule,
  ],
  templateUrl: './manga.component.html',
  styleUrl: './manga.component.scss'
})
export class MangaComponent {
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
    { id: 50, label: "Adult Cast" },
    { id: 51, label: "Anthropomorphic" },
    { id: 52, label: "CGDCT" },
    { id: 53, label: "Childcare" },
    { id: 54, label: "Combat Sports" },
    { id: 44, label: "Crossdressing" },
    { id: 55, label: "Delinquents" },
    { id: 39, label: "Detective" },
    { id: 56, label: "Educational" },
    { id: 57, label: "Gag Humor" },
    { id: 58, label: "Gore" },
    { id: 35, label: "Harem" },
    { id: 59, label: "High Stakes Game" },
    { id: 13, label: "Historical" },
    { id: 60, label: "Idols (Female)" },
    { id: 61, label: "Idols (Male)" },
    { id: 62, label: "Isekai" },
    { id: 63, label: "Iyashikei" },
    { id: 64, label: "Love Polygon" },
    { id: 65, label: "Magical Sex Shift" },
    { id: 66, label: "Mahou Shoujo" },
    { id: 17, label: "Martial Arts" },
    { id: 18, label: "Mecha" },
    { id: 67, label: "Medical" },
    { id: 68, label: "Memoir" },
    { id: 38, label: "Military" },
    { id: 19, label: "Music" },
    { id: 6, label: "Mythology" },
    { id: 69, label: "Organized Crime" },
    { id: 70, label: "Otaku Culture" },
    { id: 20, label: "Parody" },
    { id: 71, label: "Performing Arts" },
    { id: 72, label: "Pets" },
    { id: 40, label: "Psychological" },
    { id: 3, label: "Racing" },
    { id: 73, label: "Reincarnation" },
    { id: 74, label: "Reverse Harem" },
    { id: 75, label: "Love Status Quo" },
    { id: 21, label: "Samurai" },
    { id: 23, label: "School" },
    { id: 76, label: "Showbiz" },
    { id: 29, label: "Space" },
    { id: 11, label: "Strategy Game" },
    { id: 31, label: "Super Power" },
    { id: 77, label: "Survival" },
    { id: 78, label: "Team Sports" },
    { id: 79, label: "Time Travel" },
    { id: 32, label: "Vampire" },
    { id: 80, label: "Video Game" },
    { id: 81, label: "Villainess" },
    { id: 82, label: "Visual Arts" },
    { id: 48, label: "Workplace" },
    { id: 83, label: "Urban Fantasy" },
    { id: 9, label: "Ecchi" },
    { id: 49, label: "Erotica" },
    { id: 12, label: "Hentai" }
  ];


  mediaOptions = [
    { value: 'manga', label: 'Manga' },
    { value: 'novel', label: 'Novel' },
    { value: 'lightnovel', label: 'Lightnovel' },
    { value: 'oneshot', label: 'Oneshot' },
    { value: 'doujin', label: 'Doujin' },
    { value: 'manhwa', label: 'Manhwa' },
    { value: 'manhua', label: 'Manhua' },
  ];
  statusOptions = [
    { value: 'publishing', label: 'Publishing' },
    { value: 'complete', label: 'Completed' },
    { value: 'hiatus', label: 'Hiatus' },
    { value: 'discontinued', label: 'Discontinued' },
    { value: 'upcoming', label: 'Upcoming' },
  ];
  orderOptions = [
    { value: 'title', label: 'Title' },
    { value: 'start_date', label: 'Start Date' },
    { value: 'end_date', label: 'End Date' },
    { value: 'chapters', label: 'Chapters' },
    { value: 'volumes', label: 'Volumes' },
    { value: 'score', label: 'Score' },
    { value: 'rank', label: 'Rank' },
    { value: 'popularity', label: 'Popularity' },
    { value: 'favorites', label: 'Favorites' },
  ];

  filterForm: FormGroup;
  filteredMangas: any[] = [];
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
      status: [''],
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
    this.apiService.get<any>('/manga', { params }).subscribe((response) => {
      console.log('API Response:', response);
      this.filteredMangas = response.data || [];
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
