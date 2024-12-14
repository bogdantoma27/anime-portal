import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MangadexService } from '../../service/mangadex.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-manga-search',
  templateUrl: './manga-search.component.html',
  styleUrls: ['./manga-search.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule
  ],
})
export class MangaSearchComponent {
  query: string = '';
  searchResults: any[] = [];

  constructor(
    private mangadexService: MangadexService,
    private router: Router
  ) {}

  searchManga() {
    if (this.query.trim()) {
      this.mangadexService.searchManga(this.query).subscribe((response) => {
        this.searchResults = response.data.map((manga) => ({
          ...manga,
          loading: true, // Add a loading flag for each manga
          coverUrl: '' // Initialize cover URL as empty
        }));

        // Fetch cover images with a delay of 800ms between calls
        let delay = 0; // Initialize delay time
        this.searchResults.forEach((manga) => {
          const title = manga.attributes?.title?.en || manga.attributes?.title?.ja;

          setTimeout(() => {
            this.mangadexService.getCoverFromJikan(title).subscribe(
              (jikanResponse) => {
                manga.coverUrl =
                  jikanResponse.data && jikanResponse.data.length > 0
                    ? jikanResponse.data[0].images.jpg.large_image_url
                    : 'assets/default-cover.jpg';
                manga.loading = false; // Set loading to false after fetching
              },
              () => {
                // On error, set a default cover and stop spinner
                manga.coverUrl = 'assets/default-cover.jpg';
                manga.loading = false;
              }
            );
          }, delay);

          delay += 1000; // Increment delay for the next request
        });
      });
    } else {
      this.searchResults = []; // Clear results if query is empty
    }
  }

  // Trigger the search only after typing a value
  onQueryChange() {
    this.searchManga();
  }

  // Debounced search trigger for better UX (avoiding too many API calls)
  onKeyup() {
    if (this.query.trim()) {
      this.searchManga();
    }
  }

  navigateToMangaRead(mangaId: string, mangaTitle: string): void {
    this.router.navigate(['/manga-read', mangaId], {
      queryParams: { title: mangaTitle },
    });
  }
}
