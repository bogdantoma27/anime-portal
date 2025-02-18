// top-anime-base.component.ts
import { Component, inject, Input, signal } from '@angular/core';
import { Router } from "@angular/router";
import { AnimeResult } from '../../models/anime.model';
import { Pagination } from '../../models/base.model';
import { JikanService } from '../../../../core/services/jikan.service';

@Component({
  template: ''
})
export abstract class TopAnimeBaseComponent {
  protected jikanService = inject(JikanService);
  protected router = inject(Router);

  animes = signal<(AnimeResult & { isHovered?: boolean })[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  pagination = signal<Pagination | null>(null);
  currentPage = signal(1);

  @Input() title: string = 'Top Anime';
  @Input() subtitle: string = 'Discover Amazing Anime';

  abstract searchAnime(): void;

  changePage(direction: number) {
    const newPage = this.currentPage() + direction;
    if (newPage > 0 && (!this.pagination() || newPage <= this.pagination()!.last_visible_page)) {
      this.currentPage.set(newPage);
      this.searchAnime();
    }
  }

  navigateToAnimeDetails(anime: AnimeResult) {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });

    this.router.navigate(["/anime", anime.mal_id], {
      queryParams: { title: anime.title },
    });
  }
}
