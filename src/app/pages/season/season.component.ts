import { Component, inject, ViewChild } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { MatDialog } from '@angular/material/dialog';
import { YoutubeDialogComponent } from '../../components/youtube-dialog/youtube-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MediaType } from '../../enums/anime.enum';
import { SeasonType } from '../../enums/season.enum';
import { SEASON_MEDIA_OPTIONS, SEASON_OPTIONS } from '../../interface/constants.interface.';

@Component({
  selector: 'app-season',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    RouterModule,
    FormsModule,
    MatSelectModule,
    MatChipsModule,
    MatDividerModule,
    MatIconModule,
    MatBadgeModule,
    YouTubePlayerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './season.component.html',
  styleUrls: ['./season.component.scss'],
})
export class SeasonComponent {
  filterForm: FormGroup;
  filteredSeasons: any[] = [];
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

  availableYears = [...Array(109).keys()].map(i => (new Date().getFullYear() + 1) - i);
  seasonOptions = SEASON_OPTIONS;
  mediaOptions = SEASON_MEDIA_OPTIONS;

  private apiService = inject(ApiService);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);

  constructor() {
    this.filterForm = this.fb.group({
      year: [new Date().getFullYear()],
      season: [new Date().getMonth() > 8 ? SeasonType.WINTER : SeasonType.SPRING],
      media: [MediaType.TV],
    });
  }

  ngOnInit() {
    this.filterForm.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => {
        this.fetchSeasons();
      });

    this.fetchSeasons();
  }

  fetchSeasons(page: number = 1) {
    this.loading = true;

    const { year, season, media } = this.filterForm.value;

    if (!year || !season) {
      console.error('Year and Season are required.');
      this.loading = false;
      return;
    }

    // Construct endpoint dynamically based on filters
    const endpoint = `/seasons/${year}/${season}`;
    const params = new HttpParams()
      .set('filter', media || '')
      .set('page', page.toString())
      .set('limit', this.pagination.items.per_page.toString());

    this.apiService.get<any>(endpoint, { params }).subscribe(
      (response) => {
        this.filteredSeasons = response.data || [];
        this.pagination = response.pagination;
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching seasons:', error);
        this.filteredSeasons = [];
        this.loading = false;
      }
    );
  }

  onPageChange(event: PageEvent): void {
    this.pagination.items.per_page = event.pageSize;
    this.pagination.current_page = event.pageIndex + 1;
    this.fetchSeasons(this.pagination.current_page);
  }

  toggleSynopsis(season: any, event: Event): void {
    event.preventDefault(); // Prevent default anchor behavior
    season.showFullSynopsis = !season.showFullSynopsis;
  }

  playTrailer(season: any): void {
    this.dialog.open(YoutubeDialogComponent, {
      data: { videoId: season.trailer?.youtube_id }, // Pass the video ID to the dialog
    });
  }
}
