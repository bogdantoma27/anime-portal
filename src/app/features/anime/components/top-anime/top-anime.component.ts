import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { TopAnimeBaseComponent } from "../top-anime-base/top-anime-base.component";
import { catchError, of } from "rxjs";
import { UtilsService } from "../../../../core/services/utils.service";
import { AnimeResult } from "../../models/anime.model";

@Component({
  selector: "app-top-anime",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
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
        @for(anime of animes(); track anime.mal_id + '-' + $index) {
        <div class="anime-card-wrapper cursor-pointer" [@cardAppear]>
          <mat-card
            class="relative overflow-hidden"
            (mouseenter)="anime.isHovered = true"
            (mouseleave)="anime.isHovered = false"
            [@cardHover]="anime.isHovered ? 'hover' : 'normal'"
            (click)="navigateToAnimeDetails(anime)"
          >
            <div class="card-content">
              <div class="relative">
                <!-- Ranking (Top Left) -->
                <div
                  class="absolute top-2 left-2 z-10 bg-purple-600 text-white text-xs px-2 py-1 rounded opacity-90"
                >
                  #{{ anime.rank || "N/A" }}
                </div>

                <!-- Score (Top Right) -->
                <div
                  class="absolute top-2 right-2 z-10 bg-yellow-400 text-black text-xs px-2 py-1 rounded opacity-90 flex items-center"
                >
                  <i class="fa-solid fa-star mr-1"></i>
                  {{ anime.score || "N/A" }}
                </div>

                <img
                  [src]="
                    anime.images.jpg?.image_url || '/assets/placeholder.png'
                  "
                  [alt]="anime.title"
                  class="w-full h-72 object-cover"
                />

                <!-- Mobile Details -->
                <div
                  class="md:hidden absolute inset-0 bg-black bg-opacity-70 p-4 text-white flex flex-col justify-between"
                >
                  <div class="mb-4 mt-6">
                    <h3 class="text-sm font-bold truncate text-yellow-400 mb-2">
                      {{ anime.title }}
                    </h3>
                    <div class="flex items-center gap-2 mb-2">
                      <i class="fa-solid fa-film text-xs w-4"></i>
                      <span class="text-sm flex-grow truncate">{{
                        anime.type
                      }}</span>
                    </div>
                    <div
                      class="flex-grow overflow-y-auto pr-2 custom-scrollbar max-h-[165px]"
                    >
                      <p class="text-xs opacity-80">
                        {{ anime.synopsis || "No synopsis available" }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Title at the bottom (Desktop only) -->
                <div
                  class="hidden md:block absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-2"
                >
                  <h3
                    class="text-yellow-400 text-center font-medium text-sm truncate"
                  >
                    {{ anime.title }}
                  </h3>
                </div>

                <!-- Desktop Hover Details Overlay -->
                @if(anime.isHovered){
                <div
                  class="hidden md:flex absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm items-center justify-center"
                >
                  <div class="text-white w-full p-4 mt-8">
                    <h3
                      class="text-base font-medium text-yellow-400 mb-2 truncate"
                    >
                      {{ anime.title }}
                    </h3>
                    <div class="flex items-center space-x-4 text-sm mb-2">
                      <div class="flex items-center space-x-1">
                        <mat-icon class="text-base text-yellow-400"
                          >star</mat-icon
                        >
                        <span>{{ anime.score || "N/A" }}</span>
                      </div>
                      <div class="flex items-center space-x-1 w-full">
                        <i class="fa-solid fa-film text-xs w-4"></i>
                        <span
                          class="max-w-[55px] whitespace-nowrap overflow-hidden text-ellipsis"
                        >
                          {{ anime.type }}
                        </span>
                      </div>
                    </div>
                    <div
                      class="h-[160px] text-xs opacity-80 relative overflow-hidden line-clamp-[8]"
                    >
                      {{ anime.synopsis || "No synopsis available" }}
                    </div>
                  </div>
                </div>
                }
              </div>
            </div>
          </mat-card>
        </div>
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
export class TopAnimeComponent extends TopAnimeBaseComponent implements OnInit {
  private utilsService = inject(UtilsService);

  constructor() {
    super();
    this.title = 'Top Anime';
    this.subtitle = 'Best Rated Anime of All Time';
  }

  ngOnInit() {
    this.searchAnime();
  }

  searchAnime() {
    this.loading.set(true);
    this.jikanService.anime.getTopAnime({
      page: this.currentPage(),
      limit: 20
    }).pipe(
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
          .filter((anime: { images: { jpg: { image_url: any; }; }; score: number; }) =>
            anime.images?.jpg?.image_url &&
            anime.score > 0
          )
          .sort((a: { score: number; scored_by: any; }, b: { score: number; scored_by: any; }) => {
            if (b.score !== a.score) {
              return b.score - a.score;
            }
            return (b.scored_by || 0) - (a.scored_by || 0);
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
        this.error.set(err.message || "Failed to fetch top anime");
        this.loading.set(false);
      }
    });
  }

    getPopularityHTML(anime: AnimeResult): string {
      return `
            <!-- Popularity (Top Left) -->
            <div class="absolute top-2 left-2 z-10 bg-purple-600 text-white text-xs px-2 py-1 rounded opacity-90">
              <i class="fa-solid fa-chart-line mr-1"></i>
              ${anime.popularity || "N/A"}
            </div>
        `;
    }

    getFavoritesHTML(anime: AnimeResult): string {
      return `
            <!-- Favorites (Top Right) -->
            <div class="absolute top-2 right-2 z-10 bg-yellow-400 text-black text-xs px-2 py-1 rounded opacity-90 flex items-center">
              <i class="fa-solid fa-heart text-red-600 mr-1"></i>
              ${anime.favorites || "0"}
            </div>
        `;
    }
}
