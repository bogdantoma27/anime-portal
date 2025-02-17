import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { CommonModule } from "@angular/common";
import { Component, OnInit, inject, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule } from "@angular/router";

// Services
import { JikanService } from "../../core/services/jikan.service";

// Models
import { AnimeResult } from "../anime/models/anime.model";
import { Character } from "../anime/models/character.model";

// Components
import { AnimeCardComponent } from "../anime/components/anime-card/anime-card.component";
import { CharacterCardComponent } from "../anime/components/character-card/character-card.component";
import { catchError, of } from "rxjs";
import { UtilsService } from "../../core/services/utils.service";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    AnimeCardComponent,
    CharacterCardComponent,
  ],
  animations: [
    trigger("carouselSlide", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateX(100%)" }),
        animate(
          "500ms ease-out",
          style({ opacity: 1, transform: "translateX(0)" })
        ),
      ]),
      transition(":leave", [
        animate(
          "500ms ease-in",
          style({ opacity: 0, transform: "translateX(-100%)" })
        ),
      ]),
    ]),
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
    trigger("listAnimation", [
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
    <!-- Carousel Section -->
    <div class="container mx-auto px-4 py-8">
      <div class="relative h-[600px] w-full rounded-xl overflow-hidden">
        @if(favoriteAnimes().length > 0) {
        <div
          class="absolute inset-0 bg-cover bg-center transition-all duration-500"
          [style.background-image]="
            'url(' + currentCarouselAnime.images.jpg?.large_image_url + ')'
          "
        >
          <!-- Overlay with content -->
          <div
            class="absolute inset-0 bg-black bg-opacity-60 flex flex-col px-4 sm:px-16"
          >
            <!-- Favorite rank - ONLY for mobile -->
            <div
              class="bg-purple-600 px-3 py-1 rounded text-sm text-white inline-block mt-4 self-start sm:hidden"
            >
              #{{ getFavoriteRank(currentCarouselAnime) }} Most Favorite Anime
            </div>

            <!-- Content for desktop - left side, vertically centered -->
            <div class="hidden sm:flex items-center h-full">
              <div class="text-white w-1/2">
                <!-- Favorite rank - ONLY for desktop, positioned above title -->
                <div
                  class="bg-purple-600 px-3 py-1 rounded text-sm text-white inline-block mb-2"
                >
                  #{{ getFavoriteRank(currentCarouselAnime) }} Most Favorite
                  Anime
                </div>

                <h2 class="text-3xl font-bold mb-2 line-clamp-2">
                  {{ currentCarouselAnime.title }}
                </h2>
                <h3 class="text-xl text-gray-300 mb-4 line-clamp-1">
                  {{ currentCarouselAnime.title_japanese }}
                </h3>
                <p class="text-sm mb-4 line-clamp-4">
                  {{ currentCarouselAnime.synopsis }}
                </p>

                <div class="flex items-center text-sm mb-6">
                  <div class="flex items-center mr-4">
                    <mat-icon class="text-yellow-400 mr-1">star</mat-icon>
                    {{ currentCarouselAnime.score }} ({{
                      currentCarouselAnime.scored_by
                    }}
                    ratings)
                  </div>

                  <div class="flex items-center">
                    <mat-icon class="text-red-400 mr-1">favorite</mat-icon>
                    {{ currentCarouselAnime.favorites }} Favorites
                  </div>
                </div>

                <button
                  class="bg-blue-600 text-white px-6 py-2 rounded flex items-center hover:bg-blue-700 transition"
                  [routerLink]="['/anime', currentCarouselAnime.mal_id]"
                >
                  More Details
                  <mat-icon class="ml-2">chevron_right</mat-icon>
                </button>
              </div>
            </div>

            <!-- Content for mobile - vertically arranged, centered -->
            <div
              class="flex flex-col justify-center items-center h-full sm:hidden"
            >
              <div class="text-white text-center max-w-xs">
                <h2 class="text-2xl font-bold mb-2 line-clamp-2">
                  {{ currentCarouselAnime.title }}
                </h2>

                <h3 class="text-lg text-gray-300 mb-2 line-clamp-1">
                  {{ currentCarouselAnime.title_japanese }}
                </h3>

                <div
                  class="flex justify-center items-center text-xs mb-3 space-x-4"
                >
                  <div class="flex items-center">
                    <mat-icon class="text-yellow-400 mr-1 text-base"
                      >star</mat-icon
                    >
                    {{ currentCarouselAnime.score }}
                  </div>

                  <div class="flex items-center">
                    <mat-icon class="text-red-400 mr-1 text-base"
                      >favorite</mat-icon
                    >
                    {{ currentCarouselAnime.favorites }}
                  </div>
                </div>

                <p class="text-xs mb-4 line-clamp-3">
                  {{ currentCarouselAnime.synopsis }}
                </p>
              </div>
            </div>

            <!-- More details button at bottom for mobile -->
            <div
              class="sm:hidden absolute bottom-10 left-0 right-0 flex justify-center"
            >
              <button
                class="bg-blue-600 text-white px-4 py-2 rounded flex items-center hover:bg-blue-700 transition text-sm"
                [routerLink]="['/anime', currentCarouselAnime.mal_id]"
              >
                More Details
                <mat-icon class="ml-1 text-lg">chevron_right</mat-icon>
              </button>
            </div>
          </div>

          <!-- Carousel Navigation -->
          <button
            class="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-1 sm:p-2 hover:bg-black/70 transition"
            (click)="changeCarouselSlide(-1)"
          >
            <i
              class="fa-solid fa-chevron-left text-white text-xl sm:text-2xl"
            ></i>
          </button>

          <button
            class="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-1 sm:p-2 hover:bg-black/70 transition"
            (click)="changeCarouselSlide(1)"
          >
            <i
              class="fa-solid fa-chevron-right text-white text-xl sm:text-2xl"
            ></i>
          </button>

          <!-- Carousel Indicators -->
          <div
            class="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex space-x-1 sm:space-x-2"
          >
            @for(anime of favoriteAnimes(); track $index) {
            <button
              class="w-2 h-2 sm:w-3 sm:h-3 rounded-full {{
                $index === currentCarouselIndex ? 'bg-white' : 'bg-white/50'
              }}"
              (click)="currentCarouselIndex = $index"
            ></button>
            }
          </div>
        </div>
        }
      </div>
    </div>

    <!-- Seasonal Anime Section -->
    @if(seasonalAnimes().length > 0) {
    <div class="container mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold flex items-center">
          <div class="w-1 h-6 bg-blue-600 mr-3"></div>
          Seasonal Anime
        </h2>
        <span class="font-medium italic">{{ seasonalAnimes()[0].season | titlecase }}
          {{ seasonalAnimes()[0].year }} </span>
      </div>
      <div
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
      >
        @for(anime of seasonalAnimes(); track anime.mal_id + '-' + $index) {
        <app-anime-card
          [anime]="anime"
          [customTopLeftContent]="getEpisodeHTML(anime)"
          [rankingType]="'airing'"
          [rankingList]="topAnimes()"
        ></app-anime-card>
        }
      </div>
    </div>
    }

    <!-- Top Anime Section with Tabs -->
    @if(topAnimes().length > 0) {
    <div class="container mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold flex items-center">
          <div class="w-1 h-6 bg-blue-600 mr-3"></div>
          Top Anime
        </h2>
      </div>

      <div class="flex items-center md:block">
        <!-- Left navigation button -->
        <button
          (click)="
            tabsScrollContainer.scrollBy({ left: -200, behavior: 'smooth' })
          "
          class="flex-shrink-0 w-8 h-8 flex items-center justify-center md:hidden"
        >
          <i class="fas fa-chevron-left text-gray-700 dark:text-gray-300"></i>
        </button>

        <!-- Scrollable tabs container -->
        <div
          #tabsScrollContainer
          class="flex-grow flex space-x-4 overflow-x-auto md:overflow-visible pb-2 px-1"
          style="-webkit-overflow-scrolling: touch; scrollbar-width: none; -ms-overflow-style: none;"
        >
          <style>
            #tabsScrollContainer::-webkit-scrollbar {
              display: none;
            }
          </style>
          @for(tab of topAnimeTabs; track tab.label) {
          <button
            (click)="selectTopAnimeTab(tab.value)"
            class="px-4 py-2 mt-2 whitespace-nowrap flex-shrink-0 {{
              selectedTopAnimeTab === tab.value
                ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }}"
          >
            {{ tab.label }}
          </button>
          }
        </div>

        <!-- Right navigation button -->
        <button
          (click)="
            tabsScrollContainer.scrollBy({ left: 200, behavior: 'smooth' })
          "
          class="flex-shrink-0 w-8 h-8 flex items-center justify-center md:hidden"
        >
          <i class="fas fa-chevron-right text-gray-700 dark:text-gray-300"></i>
        </button>
      </div>

      <div
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-6"
      >
        @for(anime of topAnimes(); track anime.mal_id + '-' + $index) {
        <div [@listAnimation]>
          <app-anime-card
            [anime]="anime"
            [rankingType]="mapTabToRankingType(selectedTopAnimeTab)"
            [rankingList]="topAnimes()"
          ></app-anime-card>
        </div>
        }
      </div>
    </div>
    }

    <!-- Site Showcase Section -->
    @if(randomBackgroundImage) {
    <div class="container mx-auto px-4 py-8">
      <div
        class="relative h-[500px] bg-cover bg-center flex items-center justify-center overflow-hidden rounded-xl"
        [style.background-image]="'url(' + randomBackgroundImage + ')'"
      >
        <div
          class="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center text-white"
        >
          <div class="text-center">
            <h2 class="text-4xl font-bold mb-2">AnimePortal</h2>
            <h3 class="text-2xl text-purple-400 mb-4">アニメポータル</h3>
            <p class="max-w-2xl mx-auto mb-6 text-gray-300">
              Your go-to destination for all things anime! Explore in-depth
              reviews, fresh recommendations, beloved characters, and the latest
              news and trivia. Join us on this anime journey and uncover your
              next favorite series!
            </p>
            <div class="flex justify-center">
              <a
                href="https://github.com/bogdantoma27"
                target="_blank"
                class="text-4xl hover:text-gray-300"
              >
                <i class="fab fa-github"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    }

    <!-- Top Characters Section -->
    @if(topCharacters().length > 0) {
    <div class="container mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold flex items-center">
          <div class="w-1 h-6 bg-blue-600 mr-3"></div>
          Top Characters
        </h2>
      </div>
      <div
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
      >
        @for(character of topCharacters(); track character.mal_id) {
        <app-character-card
          [character]="character"
          [characterList]="topCharacters()"
        ></app-character-card>
        }
      </div>
    </div>
    }

    <!-- Genres Section -->
    <div class="container mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold flex items-center">
          <div class="w-1 h-6 bg-blue-600 mr-3"></div>
          Discover Anime By Genre
        </h2>
      </div>
      <div class="flex flex-wrap gap-2">
        @for(genre of animeGenres; track genre) {
        <button
          class="px-4 py-2 bg-blue-100 dark:bg-slate-700 rounded-lg hover:bg-blue-200 dark:hover:bg-slate-600 transition"
        >
          {{ genre }}
        </button>
        }
      </div>
    </div>
  `,
})
export class HomeComponent implements OnInit {
  // Injected service
  private jikanService = inject(JikanService);
  private utilsService = inject(UtilsService);

  // Signals for data storage
  favoriteAnimes = signal<AnimeResult[]>([]);
  seasonalAnimes = signal<AnimeResult[]>([]);
  topAnimes = signal<AnimeResult[]>([]);
  topCharacters = signal<Character[]>([]);

  // Carousel state
  currentCarouselIndex = 0;
  carouselTimer: any;

  randomBackgroundImage: string | null = null;

  // Top Anime Tabs configuration
  topAnimeTabs = [
    { label: "Top Anime", value: "anime" },
    { label: "Top Airing", value: "airing" },
    { label: "Top Upcoming", value: "upcoming" },
    { label: "Top Movies", value: "movies" },
    { label: "Most Popular", value: "popular" },
    { label: "Most Favorite", value: "favorite" },
  ];
  selectedTopAnimeTab = "anime";

  // Anime Genres
  animeGenres = [
    "Action",
    "Adventure",
    "Comedy",
    "Drama",
    "Fantasy",
    "Sci-Fi",
    "Slice of Life",
    "Supernatural",
    "Psychological",
    "Romance",
    "Thriller",
    "Mystery",
  ];

  // Getter for current carousel anime
  get currentCarouselAnime() {
    return this.favoriteAnimes()[this.currentCarouselIndex];
  }

  // Lifecycle hook
  ngOnInit() {
    // No delay for carousel (first on template)
    this.loadFavoriteAnimes();

    // Small delay for seasonal anime
    this.loadSeasonalAnimes();

    // Increasing delays for subsequent sections
    setTimeout(() => {
      this.loadTopAnimes();
    }, 1000);

    setTimeout(() => {
      this.loadTopCharacters();
    }, 2000);

    setTimeout(() => {
      this.selectRandomBackgroundImage();
    }, 2500);

    this.startCarouselAutoScroll();
  }

  mapTabToRankingType(
    tab: string
  ): "airing" | "upcoming" | "movies" | "popular" | "favorite" {
    switch (tab) {
      case "airing":
        return "airing";
      case "upcoming":
        return "upcoming";
      case "movies":
        return "movies";
      case "popular":
        return "popular";
      case "favorite":
        return "favorite";
      default:
        return "airing"; // Default fallback
    }
  }

  // Method to change carousel slide
  changeCarouselSlide(direction: number) {
    // Reset timer when manually changing slide
    if (this.carouselTimer) {
      clearInterval(this.carouselTimer);
    }

    this.currentCarouselIndex =
      (this.currentCarouselIndex + direction + this.favoriteAnimes().length) %
      this.favoriteAnimes().length;

    // Restart auto scroll
    this.startCarouselAutoScroll();
  }

  // Start automatic carousel scrolling
  startCarouselAutoScroll() {
    this.carouselTimer = setInterval(() => {
      this.changeCarouselSlide(1);
    }, 5000);
  }

  // Select random background image
  selectRandomBackgroundImage() {
    setTimeout(() => {
      const filteredAnimes = this.topAnimes().filter(
        (anime) => anime.images?.jpg?.large_image_url
      );

      if (filteredAnimes.length > 0) {
        const randomAnime =
          filteredAnimes[Math.floor(Math.random() * filteredAnimes.length)];

        this.randomBackgroundImage =
          randomAnime.images.jpg?.large_image_url || null;
      }
    }, 500);
  }

  // Select top anime tab
  selectTopAnimeTab(tab: string) {
    this.selectedTopAnimeTab = tab;
    this.loadTopAnimes();
  }

  // Load favorite animes
  loadFavoriteAnimes() {
    this.jikanService.anime
      .getTopAnime({ filter: "favorite", limit: 10 })
      .pipe(
        this.utilsService.retryWithDelay(),
        catchError((err) => {
          console.error("Failed to load favorite animes", err);
          return of({ data: [] });
        })
      )
      .subscribe({
        next: (result) => {
          const sortedAnimes = result.data
            .sort((a: any, b: any) => b.favorites - a.favorites)
            .slice(0, 10);
          this.favoriteAnimes.set(sortedAnimes);
        },
      });
  }

  // Load seasonal animes
  loadSeasonalAnimes() {
    this.jikanService.season
      .getSeasonNow()
      .pipe(
        this.utilsService.retryWithDelay(),
        catchError((err) => {
          console.error("Failed to load seasonal animes", err);
          return of({ data: [] });
        })
      )
      .subscribe({
        next: (result) => {
          const filteredAnimes = result.data
            .filter(
              (anime: { score: number; images: { jpg: { image_url: any } } }) =>
                anime.score > 0 && anime.images?.jpg?.image_url
            )
            .sort(
              (a: { score: number }, b: { score: number }) => b.score - a.score
            )
            .slice(0, 20);
          this.seasonalAnimes.set(filteredAnimes);
        },
      });
  }

  // Load top animes
  loadTopAnimes() {
    let filter: "airing" | "upcoming" | "bypopularity" | "favorite" | undefined;

    switch (this.selectedTopAnimeTab) {
      case "airing":
        filter = "airing";
        break;
      case "upcoming":
        filter = "upcoming";
        break;
      case "movies":
        this.jikanService.anime
          .getTopAnime({ type: "movie", limit: 25 })
          .pipe(
            this.utilsService.retryWithDelay(),
            catchError((err) => {
              console.error("Failed to load top movies", err);
              return of({ data: [] });
            })
          )
          .subscribe((result) => {
            this.topAnimes.set(result.data);
          });
        return;
      case "popular":
        filter = "bypopularity";
        break;
      case "favorite":
        filter = "favorite";
        break;
      default:
        filter = undefined;
    }

    this.jikanService.anime
      .getTopAnime({ filter, limit: 25 })
      .pipe(
        this.utilsService.retryWithDelay(),
        catchError((err) => {
          console.error("Failed to load top animes", err);
          return of({ data: [] });
        })
      )
      .subscribe({
        next: (result) => {
          this.topAnimes.set(result.data);
        },
      });
  }

  // Load top characters
  loadTopCharacters() {
    this.jikanService.character
      .getTopCharacters({ limit: 20 })
      .pipe(
        this.utilsService.retryWithDelay(),
        catchError((err) => {
          console.error("Failed to load top characters", err);
          return of({ data: [] });
        })
      )
      .subscribe({
        next: (result) => {
          this.topCharacters.set(result.data);
        },
      });
  }
  getFavoriteRank(anime: AnimeResult): number {
    const sortedAnimes = this.favoriteAnimes().sort(
      (a, b) => (b.favorites ?? 0) - (a.favorites ?? 0)
    );
    return sortedAnimes.findIndex((a) => a.mal_id === anime.mal_id) + 1;
  }

  getEpisodeHTML(anime: AnimeResult): string {
    return `
        <!-- Episodes (Top Left) -->
        <div class="absolute top-2 left-2 z-10 bg-green-600 text-white text-xs px-2 py-1 rounded opacity-90">
          <i class="fa-solid fa-tv mr-1"></i>
          Ep ${anime.episodes || "??"}
        </div>
    `;
  }

  // Cleanup
  ngOnDestroy() {
    if (this.carouselTimer) {
      clearInterval(this.carouselTimer);
    }
  }
}
