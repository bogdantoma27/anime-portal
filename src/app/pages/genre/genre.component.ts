import { Component, inject } from '@angular/core';
import { GenreService } from '../../service/genre.service';

@Component({
  selector: 'app-genre',
  imports: [],
  templateUrl: './genre.component.html',
  styleUrl: './genre.component.scss',
})
export class GenreComponent {
  genres: any[] = [];

  private genreService: GenreService = inject(GenreService);

  fetchAnimeGenres() {
    this.genreService.getAnimeGenres().subscribe((res) => {
      this.genres = res.data;
    });
  }
}
