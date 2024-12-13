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


@Component({
  selector: 'app-manga-search',
  templateUrl: './manga-search.component.html',
  styleUrls: ['./manga-search.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, MatListModule, MatFormFieldModule,
    MatInputModule, MatCardModule, MatButtonModule, MatIconModule,
    MatPaginatorModule
  ]
})
export class MangaSearchComponent {
  query: string = '';
  searchResults: any[] = [];

  constructor(private mangadexService: MangadexService, private router: Router) { }

  // Automatically trigger the search on every keyup, with debouncing to prevent too many requests
  searchManga() {
    if (this.query.trim()) {
      this.mangadexService.searchManga(this.query).subscribe(response => {
        this.searchResults = response.data;
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

  getMangaCoverUrl(manga: any): string {
    const cover = manga?.relationships?.find((rel: any) => rel.type === 'cover_art');
    if (cover && cover.attributes?.fileName) {
      return `https://uploads.mangadex.org/covers/${manga.id}/${cover.attributes.fileName}`;
    }
    return 'assets/default-cover.jpg'; // Fallback default image
  }

  navigateToMangaRead(mangaId: string, mangaTitle: string): void {
    this.router.navigate(['/manga-read', mangaId], {
      queryParams: { title: mangaTitle }
    });
  }
}
