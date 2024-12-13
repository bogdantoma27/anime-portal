import { Component, inject } from '@angular/core';
import { MangaService } from '../../service/manga.service';

@Component({
  selector: 'app-manga',
  imports: [],
  templateUrl: './manga.component.html',
  styleUrl: './manga.component.scss'
})
export class MangaComponent {
  manga: any;

  private mangaService: MangaService = inject(MangaService);

  fetchManga() {
    this.mangaService.getMangaById(1).subscribe((res) => {
      this.manga = res.data;
    });
  }
}
