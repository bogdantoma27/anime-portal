import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { RouterModule } from "@angular/router";
import { TopAnimeBaseComponent } from "../top-anime-base/top-anime-base.component";
import { UtilsService } from "../../../../core/services/utils.service";
import { catchError, of } from "rxjs";
import { AnimeResult } from "../../models/anime.model";
import { AnimeCardComponent } from "../anime-card/anime-card.component";

@Component({
  selector: "app-top-favorite",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    AnimeCardComponent
],
  animations: [
    trigger("cardHover", [
      state(
        "normal",
        style({
          transform: "scale(1)",
          filter: "brightness(100%)",
        })
      ),
      state(
        "hover",
        style({
          transform: "scale(1.05)",
          filter: "brightness(120%)",
        })
      ),
      transition("normal<=>hover", animate("200ms ease-in-out")),
    ]),
    trigger("cardAppear", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(20px)" }),
        animate(
          "300ms ease-out",
          style({
            opacity: 1,
            transform: "translateY(0)",
          })
        ),
      ]),
    ]),
  ],
  template: `
    <div class="container mx-auto px-4 py-8">
      @if(animes().length > 0) {
      <div
        class="h-[500px] bg-cover bg-center relative mb-8 rounded-xl overflow-hidden"
        [style.background-image]="
          'url(' +
          (animes()[0].images.jpg?.large_image_url ||
            animes()[0].images.jpg?.image_url ||
            '/assets/placeholder.png') +
          ')'
        "
      >
        <div
          class="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center text-white"
        >
          <div class="text-center">
            <h1 class="text-4xl font-bold mb-4">{{ title }}</h1>
            <p class="text-xl">{{ subtitle }}</p>
          </div>
        </div>
      </div>
      } @if(loading()){
      <div class="flex justify-center items-center h-64">
        <mat-spinner></mat-spinner>
      </div>
      }

      <div
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
      >
        @for(anime of animes(); track anime.mal_id){
        <app-anime-card
          [anime]="anime"
          [rankingType]="'upcoming'"
          [rankingList]="animes()"
          [customTopLeftContent]="getPopularityHTML(anime)"
        ></app-anime-card>
        }
      </div>

      @if(pagination()){
      <div class="container mx-auto px-4 py-12 pb-0">
        <div class="flex justify-center items-center space-x-4">
          <button
            (click)="changePage(-1)"
            [disabled]="currentPage() === 1"
            class="p-2 rounded-lg transition-all duration-200 hover:bg-blue-100/80 active:bg-blue-200/80 ring-2 ring-blue-600/40 dark:hover:bg-blue-950/50 dark:active:bg-blue-900/50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i
              class="fa-solid fa-chevron-left text-blue-600 dark:text-blue-400"
            ></i>
            <span class="hidden sm:inline text-blue-600 dark:text-blue-300"
              >Previous</span
            >
          </button>

          <!-- Page Info -->
          <div
            class="bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 px-4 py-2 rounded-lg font-medium text-sm shadow-sm"
          >
            <span class="hidden sm:inline">Page </span>
            {{ currentPage() }}
            <span class="hidden sm:inline"
              >of {{ pagination()?.last_visible_page }}</span
            >
          </div>

          <button
            (click)="changePage(1)"
            [disabled]="!pagination()?.has_next_page"
            class="p-2 rounded-lg transition-all duration-200 hover:bg-blue-100/80 active:bg-blue-200/80 ring-2 ring-blue-600/40 dark:hover:bg-blue-950/50 dark:active:bg-blue-900/50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="hidden sm:inline text-blue-600 dark:text-blue-300"
              >Next</span
            >
            <i
              class="fa-solid fa-chevron-right text-blue-600 dark:text-blue-400"
            ></i>
          </button>
        </div>

        <!-- Mobile Page Info (Optional, if you want more clarity on mobile) -->
        <div
          class="sm:hidden text-center text-sm text-gray-600 dark:text-gray-400 mt-2"
        >
          Page {{ currentPage() }} of {{ pagination()?.last_visible_page }}
        </div>
      </div>
      }
    </div>
  `,
})
export class TopFavoriteComponent
  extends TopAnimeBaseComponent
  implements OnInit
{
  private utilsService = inject(UtilsService);

  constructor() {
    super();
    this.title = "Top Favorite Anime";
    this.subtitle = "All-Time Favorite Anime Picks by Viewers";
  }

  ngOnInit() {
    this.searchAnime();
  }

  searchAnime() {
    this.loading.set(true);
    this.jikanService.anime
      .getTopAnime({
        filter: "favorite",
        page: this.currentPage(),
        limit: 20,
      })
      .pipe(
        this.utilsService.retryWithDelay(),
        catchError((err) => {
          this.error.set(err.message || "Failed to fetch top airing anime");
          this.loading.set(false);
          return of({ data: [], pagination: {} }); // Return empty data structure
        })
      )
      .subscribe({
        next: (result) => {
          const sortedAnimes = result.data
            .filter(
              (anime: {
                images: { jpg: { image_url: any } };
                favorites: any;
              }) => anime.images?.jpg?.image_url && (anime.favorites ?? 0) > 0
            )
            .sort((a: { favorites: any }, b: { favorites: any }) => {
              return (b.favorites || 0) - (a.favorites || 0);
            })
            .map((anime: any) => ({
              ...anime,
              isHovered: false,
            }));

          this.animes.set(sortedAnimes);
          this.pagination.set(result.pagination);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(err.message || "Failed to fetch top favorite anime");
          this.loading.set(false);
        },
      });
  }

  getPopularityHTML(anime: AnimeResult): string {
    return `
            <!-- Popularity (Top Left) -->
            <div class="absolute top-2 left-2 z-10 bg-purple-600 text-white text-xs px-2 py-1 rounded opacity-90">
              <i class="fa-solid fa-heart mr-1 text-red-500"></i>
              ${anime.favorites || "N/A"}
            </div>
        `;
  }
}
