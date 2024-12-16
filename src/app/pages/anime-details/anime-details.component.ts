import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { forkJoin } from 'rxjs';
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
    // Use snapshot to load anime on initial load
    const animeId = this.route.snapshot.paramMap.get('id');
    if (animeId) {
      this.loadAnimeDetails(Number(animeId));
    } else {
      this.toasterService.error('Anime not found.');
    }

    // Subscribe to dynamic route changes
    this.route.params.subscribe((params) => {
      const animeId = +params['id']; // Ensure it's a number
      this.loadAnimeDetails(animeId);

      // Scroll to the top of the page
      window.scrollTo(0, 0);
    });
  }

  loadAnimeDetails(animeId: number): void {
    this.isLoading = true;

    // Fetching anime details and related data using forkJoin
    forkJoin({
      animeDetails: this.animeService.getAnimeById(animeId),
      characters: this.animeService.getAnimeCharacters(animeId),
      staff: this.animeService.getAnimeStatistics(animeId),
      reviews: this.animeService.getAnimeReviews(animeId),
    }).subscribe({
      next: ({ animeDetails, characters, staff, reviews }) => {
        // Storing fetched data
        this.anime = {
          ...animeDetails,
          characters,
          staff,
          reviews,
        };

        // Extracting genre IDs from animeDetails for the search API
        const genreIds = animeDetails.data?.genres?.map(
          (genre) => genre.mal_id
        );
        if (genreIds?.length) {
          const params = { genres: genreIds.join(',') }; // Format genre IDs as a comma-separated string
          this.animeService.searchAnime(params).subscribe({
            next: (searchResults) => {
              this.anime.recommendations = searchResults.data; // Assuming 'data' contains recommendations
            },
            error: (error) => {
              console.error('Failed to fetch recommendations:', error);
            },
          });
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

  // Method to toggle the full review visibility
  toggleReview(review: any): void {
    review.showFullReview = !review.showFullReview;
  }

  // Function to get reactions and their corresponding icons
  getReactions(reactions: any) {
    return [
      { label: 'Overall', icon: 'check' },
      { label: 'Confusing', icon: 'thumb_down' },
      // { label: 'Creating', icon: 'create' },
      // { label: 'Funny', icon: 'sentiment_very_satisfied' },
      // { label: 'Informative', icon: 'info' },
      { label: 'Love It', icon: 'favorite' },
      { label: 'Nice', icon: 'thumb_up_alt' },
      // { label: 'Well Written', icon: 'edit' },
    ].filter((reaction) => reactions[reaction.label.toLowerCase()] > 0);
  }
}
