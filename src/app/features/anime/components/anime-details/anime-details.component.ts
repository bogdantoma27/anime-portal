import { Component, OnInit, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { AnimeResult } from "../../models/anime.model";
import { AnimeService } from "../../services/anime.service";
import { Recommendation } from "../../models/recommendation.model";
import { Review } from "../../models/review.model";
import { catchError, finalize, switchMap } from "rxjs/operators";
import { CharacterCardComponent } from "../character-card/character-card.component";
import { Character } from "../../models/character.model";
import { GenericCarouselComponent } from "../../../../shared/components/generic-carousel/generic-carousel.component";
import { of, EMPTY } from "rxjs";
import { UtilsService } from "../../../../core/services/utils.service";
import { MatDialog } from "@angular/material/dialog";
import { JoinNamesPipe } from "../../../../core/pipes/join-names.pipe";
import { NextBroadcastPipe } from "../../../../core/pipes/next-broadcast.pipe";
import { ExpandableTextDirective } from "../../../../core/directives/expandable-text.directive";
import { LoadingSpinnerComponent } from "../../../../shared/components/loading-spinner/loading-spinner.component";

@Component({
  selector: "app-anime-details",
  standalone: true,
  imports: [
    CommonModule,
    CharacterCardComponent,
    GenericCarouselComponent,
    JoinNamesPipe,
    NextBroadcastPipe,
    ExpandableTextDirective,
    LoadingSpinnerComponent,
  ],
  template: `
    <div class="min-h-screen bg-dark-900 text-white">
      <!-- Error Handling -->
      @if(errorMessage()) {
      <div class="bg-red-500 text-white p-4 text-center">
        {{ errorMessage() }}
      </div>
      }

      <!-- Main Content Section -->
      @if(isMainLoading()) {
      <!-- Main Content Skeleton -->
      <div class="animate-pulse relative">
        <div class="bg-gray-700 absolute inset-0 w-full h-[400px]"></div>
        <div class="absolute top-0 left-0 right-0">
          <div class="relative pt-[200px] container mx-auto px-0">
            <div
              class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 px-4"
            >
              <div class="flex-1 space-y-4">
                <div class="h-6 bg-gray-700 w-1/2"></div>
                <div class="h-4 bg-gray-700 w-full"></div>
                <div class="h-4 bg-gray-700 w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      }

      <!-- Anime Details Content -->
      @if(!isMainLoading() && animeDetails()) {
      <div class="relative">
        <!-- Full Width Background Image with Blur -->
        <div class="absolute -inset-x-6 -top-12 bottom-0 overflow-hidden">
          <img
            [src]="animeDetails()!.data.images.jpg?.large_image_url"
            class="absolute inset-0 w-full min-h-[1375px] md:min-h-[900px] object-cover z-0"
          />
          <div
            class="absolute inset-0 bg-black/60 backdrop-blur-sm min-h-[1375px] md:min-h-[900px]"
          ></div>
        </div>

        <div class="container mx-auto px-4 relative z-20 pt-6 pb-16">
          <div
            class="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-8 relative z-30"
          >
            <!-- Poster -->
            <img
              [src]="animeDetails()!.data.images.jpg?.image_url"
              class="w-[300px] lg:h-[550px] lg:w-[355px] mm:h-[275px] mm:w-[175px] object-cover rounded-lg shadow-lg self-center md:self-start"
            />

            <!-- Details -->
            <div
              class="flex-1 text-white text-center md:text-left flex flex-col justify-end"
            >
              <h1 class="text-2xl md:text-3xl font-bold mb-4 text-yellow-400">
                {{ animeDetails()!.data.title }}
              </h1>

              <!-- Information Rectangles -->
              <div
                class="flex flex-wrap justify-center md:justify-start gap-2 mb-4"
              >
                <span
                  class="bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3 py-1 rounded text-sm whitespace-nowrap"
                >
                  {{ animeDetails()!.data.type }}
                </span>
                <span
                  class="bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3 py-1 rounded text-sm whitespace-nowrap"
                >
                  {{
                    animeDetails()!.data.type != "Movie"
                      ? "Eps: " + animeDetails()!.data.episodes
                      : animeDetails()!.data.source
                  }}
                </span>
                <span
                  class="bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3 py-1 rounded text-sm whitespace-nowrap"
                >
                  {{ animeDetails()!.data.duration }}
                </span>
                <span
                  class="bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3 py-1 rounded text-sm whitespace-nowrap"
                >
                  {{
                    animeDetails()!.data.aired.prop.from.year +
                      (animeDetails()!.data.aired.prop.to.year
                        ? "-" + animeDetails()!.data.aired.prop.to.year
                        : "")
                  }}
                </span>
                <span
                  class="bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3 py-1 rounded text-sm whitespace-nowrap"
                >
                  <i class="fas fa-star text-yellow-400 mr-1"></i>
                  {{ animeDetails()!.data.score }}
                </span>
                <span
                  class="bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3 py-1 rounded text-sm whitespace-nowrap"
                >
                  <i class="fas fa-heart text-red-600 mr-1"></i>
                  {{ animeDetails()!.data.favorites }}
                </span>
              </div>

              <!-- Additional Information Section -->
              <div
                class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-4 mt-2"
              >
                <!--Broadcast Information-->
                @if (animeDetails()!.data.broadcast) {
                <div
                  class="bg-gradient-to-br from-blue-900/50 to-purple-900/50 border border-blue-800/30 rounded-lg p-4"
                >
                  <div class="flex items-start space-x-3">
                    <div class="flex-1 min-w-0">
                      <!-- Added min-w-0 for text truncation -->
                      <h3 class="text-sm font-semibold text-blue-300 mb-1">
                        Broadcast
                      </h3>
                      <p class="text-white text-sm break-words mm:min-h-[65px] lg:min-h-[35px]" expandableText>
                        @if ((animeDetails()!.data.broadcast?.string |
                        nextBroadcast | async); as broadcastData) {
                        {{ broadcastData }}
                        } @else if (!(animeDetails()!.data.broadcast?.string)) {
                        No data available } @else {
                          <div class="h-10">
                            <app-loading-spinner size="md" />
                          </div>
                        }
                      </p>
                    </div>
                  </div>
                </div>
                }

                <!--Producers-->
                @if (animeDetails()!.data.producers) {
                <div
                  class="bg-gradient-to-br from-green-900/50 to-teal-900/50 border border-green-800/30 rounded-lg p-4"
                >
                  <div class="flex items-start space-x-3">
                    <div class="flex-1 min-w-0">
                      <h3 class="text-sm font-semibold text-green-300 mb-1">
                        Producers
                      </h3>
                      <p class="text-white text-sm break-words" expandableText>
                        {{
                          (animeDetails()!.data.producers | joinNames) ||
                            "No data available"
                        }}
                      </p>
                    </div>
                  </div>
                </div>
                }

                <!--Studios-->
                @if (animeDetails()!.data.studios) {
                <div
                  class="bg-gradient-to-br from-red-900/50 to-pink-900/50 border border-red-800/30 rounded-lg p-4"
                >
                  <div class="flex items-start space-x-3">
                    <div class="flex-1 min-w-0">
                      <h3 class="text-sm font-semibold text-red-300 mb-1">
                        Studios
                      </h3>
                      <p class="text-white text-sm break-words" expandableText>
                        {{
                          (animeDetails()!.data.studios | joinNames) ||
                            "No data available"
                        }}
                      </p>
                    </div>
                  </div>
                </div>
                }

                <!--Licensors-->
                @if (animeDetails()!.data.licensors) {
                <div
                  class="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 border border-yellow-800/30 rounded-lg p-4"
                >
                  <div class="flex items-start space-x-3">
                    <div class="flex-1 min-w-0">
                      <h3 class="text-sm font-semibold text-yellow-300 mb-1">
                        Licensors
                      </h3>
                      <p class="text-white text-sm break-words" expandableText>
                        {{
                          (animeDetails()!.data.licensors | joinNames) ||
                            "No data available"
                        }}
                      </p>
                    </div>
                  </div>
                </div>
                }
              </div>

              <!-- Action Buttons -->
              <div
                class="flex justify-center md:justify-start space-x-4 mb-4 mt-2"
              >
                <button
                  class="border-2 border-white hover:bg-blue-600 px-4 py-2 rounded flex items-center"
                  (click)="playTrailer()"
                >
                  <i class="fas fa-play mr-2"></i>Watch Trailer
                </button>
                <button
                  class="border-none hover:bg-white hover:text-black px-4 py-2 rounded flex items-center"
                >
                  <i class="fas fa-bookmark mr-2"></i>Bookmark
                </button>
              </div>

              <!-- Synopsis -->
              <div
                class="max-h-[240px] lg:max-h-[187px] overflow-y-auto custom-scrollbar text-gray-300 mb-4 text-sm md:text-base pr-2"
              >
                {{ animeDetails()?.data?.synopsis }}
              </div>

              <!-- Genres -->
              @if(animeDetails()!.data.genres ?? []) {
              <div
                class="flex flex-wrap gap-2 justify-center md:justify-start mt-auto"
              >
                @for(genre of animeDetails()!.data.genres ?? []; track
                genre.mal_id) {
                <span class="bg-purple-900 px-3 py-1 rounded text-sm">{{
                  genre.name
                }}</span>
                }
              </div>
              }
            </div>
          </div>
        </div>
      </div>
      } @if(!isMainLoading()) {
      <!-- Characters Section -->
      <div
        class="container mx-auto px-4 mt-8 md:mt-[120px] lg:mt-[30px] relative z-10"
      >
        <app-generic-carousel
          title="Characters"
          [items]="animeCharacters()?.data ?? []"
          [isLoading]="isCharactersLoading()"
          [itemsPerPage]="10"
          [itemsPerPageMobile]="4"
          desktopGridClass="grid-cols-5 gap-4"
          mobileGridClass="grid-cols-2 gap-4"
          [loadingTemplateRef]="characterLoadingTemplate"
          [itemTemplateRef]="characterTemplate"
        ></app-generic-carousel>
      </div>

      <!-- Reviews Section -->
      <div class="container mx-auto px-4 mt-12">
        <app-generic-carousel
          title="What People Say"
          [items]="reviews()?.data ?? []"
          [isLoading]="isReviewsLoading()"
          [itemsPerPage]="3"
          [itemsPerPageMobile]="1"
          desktopGridClass="grid-cols-3 gap-4"
          mobileGridClass="grid-cols-1 gap-4"
          [loadingTemplateRef]="reviewLoadingTemplate"
          [itemTemplateRef]="reviewTemplate"
        ></app-generic-carousel>
      </div>

      <!-- Recommendations Section -->
      <div class="container mx-auto px-4 mt-12 mb-8">
        <app-generic-carousel
          title="More Like This"
          [items]="recommendations()?.data ?? []"
          [isLoading]="isRecommendationsLoading()"
          [itemsPerPage]="10"
          [itemsPerPageMobile]="4"
          desktopGridClass="grid-cols-5 gap-4"
          mobileGridClass="grid-cols-2 gap-4"
          [loadingTemplateRef]="recommendationLoadingTemplate"
          [itemTemplateRef]="recommendationTemplate"
        ></app-generic-carousel>
      </div>
      }
    </div>

    <!-- Templates remain the same as in the previous implementation -->
    <ng-template #characterLoadingTemplate>
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4 animate-pulse">
        @for(i of [1,2,3,4,5,6,7,8,9,10]; track i) {
        <div class="flex flex-col items-center space-y-2">
          <div class="w-full aspect-[2/3] bg-gray-700 rounded-lg"></div>
          <div class="h-4 w-3/4 bg-gray-700 rounded"></div>
        </div>
        }
      </div>
    </ng-template>

    <ng-template #characterTemplate let-characters>
      @for(character of characters; track character.mal_id + '_' + $index) {
      <app-character-card
        [character]="character"
        [role]="character.role ?? ''"
        [displayType]="'role'"
        [showFavoritesBadge]="false"
        [mode]="'anime-details'"
        [simplifiedView]="true"
      ></app-character-card>
      }
    </ng-template>

    <ng-template #reviewLoadingTemplate>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        @for(i of [1,2,3]; track i) {
        <div
          class="bg-gray-800 rounded-lg p-6 flex flex-col items-center justify-center text-center"
        >
          <i
            class="fas fa-exclamation-triangle text-4xl text-yellow-500 mb-4"
          ></i>
          <p class="text-gray-300">
            There are no reviews for this anime yet or this anime is still
            ongoing.
          </p>
        </div>
        }
      </div>
    </ng-template>

    <ng-template #reviewTemplate let-reviews>
      @for(review of reviews; track review.mal_id) {
      <div
        class="bg-gray-800 rounded-lg p-6 max-h-[400px] overflow-y-auto custom-scrollbar"
      >
        <div class="flex items-start gap-4 mb-4">
          <img
            [src]="review.user.images.jpg.image_url"
            class="w-10 h-10 rounded-full"
            alt="User avatar"
          />
          <div>
            <p class="font-medium">{{ review.user.username }}</p>
            <p class="text-gray-400 text-sm">MAL ID: {{ review.mal_id }}</p>
          </div>
          <div class="ml-auto">
            <span
              class="bg-yellow-400/20 text-yellow-400 px-2 py-1 rounded text-sm"
              >★ {{ review.score }}</span
            >
          </div>
        </div>
        <p class="text-gray-300 text-sm">{{ review.review }}</p>
      </div>
      }
    </ng-template>

    <ng-template #recommendationLoadingTemplate>
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
        @for(i of [1,2,3,4,5,6,7,8,9,10]; track i) {
        <div class="animate-pulse">
          <div class="w-full aspect-[2/3] bg-gray-700 rounded-lg"></div>
        </div>
        }
      </div>
    </ng-template>

    <ng-template #recommendationTemplate let-recommendations>
      @for(rec of recommendations; track rec.entry.mal_id + '-' + $index) {
      <div
        class="relative cursor-pointer"
        (click)="navigateToRecommendation(rec.entry.mal_id, rec.entry.title)"
      >
        <img
          [src]="rec.entry.images.jpg.image_url"
          class="w-full aspect-[2/3] object-cover rounded-lg"
          [alt]="rec.entry.title"
        />

        <div
          class="block absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-2"
        >
          <h3 class="text-yellow-400 text-center font-medium text-sm truncate">
            {{ rec.entry.title }}
          </h3>
        </div>
      </div>
      }
    </ng-template>
  `,
})
export class AnimeDetailsComponent implements OnInit {
  private animeService = inject(AnimeService);
  private utilsService = inject(UtilsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  // Separate loading states for different sections
  isMainLoading = signal<boolean>(true);
  isCharactersLoading = signal<boolean>(true);
  isReviewsLoading = signal<boolean>(true);
  isRecommendationsLoading = signal<boolean>(true);

  // Data signals
  animeDetails = signal<{ data: AnimeResult } | null>(null);
  animeCharacters = signal<{ data: Character[] } | null>(null);
  reviews = signal<{ data: Review[] } | null>(null);
  recommendations = signal<{ data: Recommendation[] } | null>(null);
  randomBackgroundImage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  ngOnInit() {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const animeId = params.get("id");
          if (animeId) {
            // Reset loading states
            this.isMainLoading.set(true);
            this.isCharactersLoading.set(true);
            this.isReviewsLoading.set(true);
            this.isRecommendationsLoading.set(true);

            // Reset data signals
            this.animeDetails.set(null);
            this.animeCharacters.set(null);
            this.reviews.set(null);
            this.recommendations.set(null);

            // Fetch new anime data
            return of(Number(animeId));
          }
          return EMPTY;
        })
      )
      .subscribe((animeId) => {
        this.fetchAnimeData(animeId);
      });
  }

  private fetchAnimeData(animeId: number) {
    // Main details
    this.animeService
      .getById(animeId)
      .pipe(
        this.utilsService.retryWithDelay(),
        catchError((error) => {
          this.handleError(error);
          return [];
        }),
        finalize(() => this.isMainLoading.set(false))
      )
      .subscribe((details) => {
        if (details) {
          this.animeDetails.set(details);
          this.selectRandomBackgroundImage();
        }
      });

    // Characters
    setTimeout(() => {
      this.animeService
        .getCharacters(animeId)
        .pipe(
          this.utilsService.retryWithDelay(),
          catchError((error) => {
            console.error("Characters fetch error:", error);
            return [];
          }),
          finalize(() => this.isCharactersLoading.set(false))
        )
        .subscribe((characters) => {
          if (characters) {
            this.animeCharacters.set(characters);
          }
        });
    }, 300);

    // Reviews
    setTimeout(() => {
      this.animeService
        .getReviews(animeId)
        .pipe(
          this.utilsService.retryWithDelay(),
          catchError((error) => {
            console.error("Reviews fetch error:", error);
            return [];
          }),
          finalize(() => this.isReviewsLoading.set(false))
        )
        .subscribe((reviews) => {
          if (reviews) {
            this.reviews.set(reviews);
          }
        });
    }, 600);

    // Recommendations
    setTimeout(() => {
      this.animeService
        .getRecommendations(animeId)
        .pipe(
          this.utilsService.retryWithDelay(),
          catchError((error) => {
            console.error("Recommendations fetch error:", error);
            return [];
          }),
          finalize(() => this.isRecommendationsLoading.set(false))
        )
        .subscribe((recommendations) => {
          if (recommendations) {
            this.recommendations.set(recommendations);
          }
        });
    }, 900);
  }

  private handleError(error: any) {
    console.error("Anime details fetch error:", error);
    this.errorMessage.set("Failed to load anime details. Please try again.");
  }

  private selectRandomBackgroundImage() {
    if (this.animeDetails()?.data.images?.jpg?.large_image_url) {
      const largeImageUrl =
        this.animeDetails()?.data.images?.jpg?.large_image_url ?? null;
      this.randomBackgroundImage.set(largeImageUrl);
    }
  }

  navigateToRecommendation(recommendationId: number, title: string) {
    // Force a complete route reload
    this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
      this.router.navigate(["/anime", recommendationId], {
        queryParams: { title: title },
      });
    });
  }

  playTrailer() {
    window.open(this.animeDetails()!.data.trailer?.url, "_blank");
  }
}
