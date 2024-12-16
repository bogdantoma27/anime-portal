import { Component, inject, Input } from '@angular/core';
import { MangaService } from '../../service/manga.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { forkJoin, Observable, delayWhen } from 'rxjs';
import { YoutubeDialogComponent } from '../../components/youtube-dialog/youtube-dialog.component';
import { ToasterService } from '../../shared/service/toaster.service';

@Component({
  selector: 'app-manga-details',
  imports: [
    CommonModule,
    MatDividerModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatChipsModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './manga-details.component.html',
  styleUrl: './manga-details.component.scss'
})
export class MangaDetailsComponent {
  private mangaService = inject(MangaService);
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  private toasterService = inject(ToasterService);

  @Input() manga: any = {}; // Initialize as an empty object
  isLoading = true;

  constructor() {}

  ngOnInit(): void {
    // Subscribe to dynamic route changes
    this.route.params.subscribe((params) => {
      const mangaId = Number(params['id']); // Convert to number
      if (mangaId) {
        this.loadAnimeDetails(mangaId);

        // Scroll to the top of the page on route change
        window.scrollTo(0, 0);
      } else {
        this.toasterService.error('Anime not found.');
      }
    });
  }

  // Method to load manga details with a 200ms delay between each API call
  loadAnimeDetails(mangaId: number): void {
    this.isLoading = true;

    // Create delayed observables
    const delayedAnimeDetails$ = this.fetchWithDelay(this.mangaService.getMangaById(mangaId), 200);
    const delayedCharacters$ = this.fetchWithDelay(this.mangaService.getMangaCharacters(mangaId), 200);
    const delayedStaff$ = this.fetchWithDelay(this.mangaService.getMangaStatistics(mangaId), 200);
    const delayedReviews$ = this.fetchWithDelay(this.mangaService.getMangaReviews(mangaId), 200);

    // Fetching manga details and related data using forkJoin with delay
    forkJoin({
      mangaDetails: delayedAnimeDetails$,
      characters: delayedCharacters$,
      staff: delayedStaff$,
      reviews: delayedReviews$,
    }).subscribe({
      next: ({ mangaDetails, characters, staff, reviews}) => {
        // Storing fetched data
        this.manga = {
          ...mangaDetails,
          characters,
          staff,
          reviews,
        };

        // Fetch recommendations based on genre IDs
        const genreIds = mangaDetails.data?.genres?.map((genre) => genre.mal_id);
        if (genreIds?.length) {
          this.fetchRecommendations(genreIds);
        } else {
          this.manga.recommendations = [];
        }

        this.isLoading = false;
      },
      error: () => {
        this.toasterService.error('Failed to load manga details.');
        this.isLoading = false;
      },
    });
  }

  // Utility function to simulate delay before returning an observable
  private fetchWithDelay(observableFn: Observable<any>, delayMs = 200): Observable<any> {
    return observableFn.pipe(
      delayWhen(() => this.delay(delayMs)) // Add delay to each observable
    );
  }

  // Simple delay function returning an observable after the specified delay
  private delay(ms: number): Observable<void> {
    return new Observable<void>((observer) => {
      const timeout = setTimeout(() => {
        observer.next();
        observer.complete(); // Ensure the observable completes after the delay
      }, ms);

      // Cleanup the timeout when unsubscribed from
      return () => clearTimeout(timeout);
    });
  }


  fetchRecommendations(genreIds: number[]): void {
    const params = { genres: genreIds.join(',') }; // Format genre IDs as a comma-separated string
    this.mangaService.searchManga(params).subscribe({
      next: (searchResults) => {
        this.manga.recommendations = searchResults.data; // Assuming 'data' contains recommendations
      },
      error: (error) => {
        console.error('Failed to fetch recommendations:', error);
        this.manga.recommendations = [];
      },
    });
  }

  playTrailer(manga: any): void {
    this.dialog.open(YoutubeDialogComponent, {
      data: { videoId: manga.data.trailer.youtube_id },
    });
  }

  getFormattedGenres(): string {
    return (
      this.manga?.data?.genres?.map((genre) => genre.name).join(', ') ?? 'N/A'
    );
  }
  
  getFormattedAuthors(): string {
    return (
      this.manga?.data?.authors
        ?.map((producer) => {
          // Check if the producer has a name and url
          if (producer.name && producer.url) {
            // Return name with a hyperlink
            return `<a href="${producer.url}" target="_blank">${producer.name}</a>`;
          }
          return producer.name ?? 'N/A'; // Fallback to 'N/A' if name is missing
        })
        .join(', ') ?? 'N/A'
    );
  }

  getReactions(reactions: any) {
    return [
      { label: 'Overall', icon: 'check' },
      { label: 'Confusing', icon: 'thumb_down' },
      { label: 'Love It', icon: 'favorite' },
      { label: 'Nice', icon: 'thumb_up_alt' },
    ].filter((reaction) => reactions[reaction.label.toLowerCase()] > 0);
  }
}
