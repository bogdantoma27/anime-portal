import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { delayWhen, forkJoin, Observable } from 'rxjs';
import { ToasterService } from '../../shared/service/toaster.service';
import { AnimeService } from '../../service/anime.service';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { YoutubeDialogComponent } from '../../components/youtube-dialog/youtube-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-anime-details',
  standalone: true,
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
  templateUrl: './anime-details.component.html',
  styleUrls: ['./anime-details.component.scss'],
})
export class AnimeDetailsComponent {
  private animeService = inject(AnimeService);
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  private toasterService = inject(ToasterService);

  @Input() anime: any = {}; // Initialize as an empty object
  isLoading = true;

  constructor() {}

  ngOnInit(): void {
    // Subscribe to dynamic route changes
    this.route.params.subscribe((params) => {
      const animeId = Number(params['id']); // Convert to number
      if (animeId) {
        this.loadAnimeDetails(animeId);

        // Scroll to the top of the page on route change
        window.scrollTo(0, 0);
      } else {
        this.toasterService.error('Anime not found.');
      }
    });
  }

  // Method to load anime details with a 200ms delay between each API call
  loadAnimeDetails(animeId: number): void {
    this.isLoading = true;

    // Create delayed observables
    const delayedAnimeDetails$ = this.fetchWithDelay(this.animeService.getAnimeById(animeId), 200);
    const delayedCharacters$ = this.fetchWithDelay(this.animeService.getAnimeCharacters(animeId), 200);
    const delayedStaff$ = this.fetchWithDelay(this.animeService.getAnimeStatistics(animeId), 200);
    const delayedReviews$ = this.fetchWithDelay(this.animeService.getAnimeReviews(animeId), 200);
    const delayedStreams$ = this.fetchWithDelay(this.animeService.getAnimeStreamingLinks(animeId), 200);

    // Fetching anime details and related data using forkJoin with delay
    forkJoin({
      animeDetails: delayedAnimeDetails$,
      characters: delayedCharacters$,
      staff: delayedStaff$,
      reviews: delayedReviews$,
      streams: delayedStreams$,
    }).subscribe({
      next: ({ animeDetails, characters, staff, reviews, streams }) => {
        // Storing fetched data
        this.anime = {
          ...animeDetails,
          characters,
          staff,
          reviews,
          streams,
        };

        // Fetch recommendations based on genre IDs
        const genreIds = animeDetails.data?.genres?.map((genre) => genre.mal_id);
        if (genreIds?.length) {
          this.fetchRecommendations(genreIds);
        } else {
          this.anime.recommendations = [];
        }

        this.isLoading = false;
      },
      error: () => {
        this.toasterService.error('Failed to load anime details.');
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
    this.animeService.searchAnime(params).subscribe({
      next: (searchResults) => {
        this.anime.recommendations = searchResults.data; // Assuming 'data' contains recommendations
      },
      error: (error) => {
        console.error('Failed to fetch recommendations:', error);
        this.anime.recommendations = [];
      },
    });
  }

  playTrailer(anime: any): void {
    this.dialog.open(YoutubeDialogComponent, {
      data: { videoId: anime.data.trailer.youtube_id },
    });
  }

  getFormattedGenres(): string {
    return (
      this.anime?.data?.genres?.map((genre) => genre.name).join(', ') ?? 'N/A'
    );
  }

  getFormattedStudios(): string {
    return (
      this.anime?.data?.studios?.map((studio) => studio.name).join(', ') ??
      'N/A'
    );
  }

  getFormattedProducers(): string {
    return (
      this.anime?.data?.producers
        ?.map((producer) => producer.name)
        .join(', ') ?? 'N/A'
    );
  }

  getFormattedLicensors(): string {
    return (
      this.anime?.data?.licensors
        ?.map((licensor) => licensor.name)
        .join(', ') ?? 'N/A'
    );
  }

  getFormattedStreamingLinks(): string {
    return (
      this.anime?.streams?.data
        ?.map((stream) => {
          // Check if both name and url are available
          if (stream.name && stream.url) {
            // Format name with hyperlink in parentheses
            return `<a href="${stream.url}" target="_blank">${stream.name}</a>`;
          }
          return stream.name ?? 'N/A'; // Fallback to 'N/A' if name is missing
        })
        .join(', ') ?? 'N/A' // Join multiple links with commas
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
