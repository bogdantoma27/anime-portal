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

@Component({
  selector: "app-anime-details",
  standalone: true,
  imports: [CommonModule, CharacterCardComponent, GenericCarouselComponent],
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
      <!-- <div className="relative">
        <div class="absolute inset-0">
          <img
            [src]="animeDetails()!.data.images.jpg?.large_image_url"
            class="absolute inset-0 w-full lg:h-[575px] sm:h-[650px] md:h-[650px] mm:h-[935px] object-cover z-0"
          />
          <div
            class="absolute inset-0 bg-black/60 backdrop-blur-sm lg:h-[575px] sm:h-[650px] md:h-[650px] mm:h-[935px]"
          ></div>
        </div>

        <div class="container mx-auto px-4 relative z-20 pt-6 pb-16">
          <div
            class="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-8"
          > -->
      <div class="relative">
        <!-- Full Width Background Image with Blur -->
        <div class="absolute -inset-x-6 -top-12 bottom-0 overflow-hidden">
          <img
            [src]="animeDetails()!.data.images.jpg?.large_image_url"
            class="absolute inset-0 w-full min-h-[1100px] sm:min-h-[1200px] md:min-h-[900px] object-cover z-0"
          />
          <div
            class="absolute inset-0 bg-black/60 backdrop-blur-sm min-h-[1100px] sm:min-h-[1200px] md:min-h-[900px]"
          ></div>
        </div>

        <div class="container mx-auto px-4 relative z-20 pt-6 pb-16">
          <div
            class="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-8 relative z-30"
          >
            <!-- Poster -->
            <img
              [src]="animeDetails()!.data.images.jpg?.image_url"
              class="w-[250px] lg:h-[395px] mm:h-[325px] object-cover rounded-lg shadow-lg self-center md:self-start"
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
                class="max-h-[150px] overflow-y-auto custom-scrollbar text-gray-300 mb-4 text-sm md:text-base pr-2"
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
        class="container mx-auto px-4 mt-8 md:mt-[120px] lg:mt-[20px] relative z-10"
      >
        <app-generic-carousel
          title="Characters"
          [items]="animeCharacters()?.data ?? []"
          [isLoading]="isCharactersLoading()"
          [itemsPerPage]="10"
          [itemsPerPageMobile]="2"
          [showDots]="true"
          [showMobileDots]="false"
          desktopGridClass="grid-cols-5 gap-4"
          mobileGridClass="grid-cols-2 gap-4"
          [loadingTemplateRef]="characterLoadingTemplate"
          [itemTemplateRef]="characterTemplate"
          #characterCarousel
        ></app-generic-carousel>

        <!-- Mobile Pagination Text -->
        <div class="md:hidden text-center mt-4 text-gray-400">
          Page {{ characterCarousel.currentPage + 1 }} of
          {{ characterCarousel.getMaxPages() + 1 }}
        </div>

        <!-- Desktop Dots -->
        <div class="hidden md:flex justify-center mt-4 space-x-2">
          @for(dot of characterCarousel.getPaginationDots(); track $index) {
          <button
            class="w-2 h-2 rounded-full"
            [class.bg-blue-500]="characterCarousel.currentPage === $index"
            [class.bg-gray-300]="characterCarousel.currentPage !== $index"
            (click)="characterCarousel.goToPage($index)"
          ></button>
          }
        </div>
      </div>

      <!-- Reviews Section -->
      <div class="container mx-auto px-4 mt-12">
        <app-generic-carousel
          title="What People Say"
          [items]="reviews()?.data ?? []"
          [isLoading]="isReviewsLoading()"
          [itemsPerPage]="3"
          [itemsPerPageMobile]="1"
          [showDots]="true"
          [showMobileDots]="false"
          desktopGridClass="grid-cols-3 gap-4"
          mobileGridClass="grid-cols-1 gap-4"
          [loadingTemplateRef]="reviewLoadingTemplate"
          [itemTemplateRef]="reviewTemplate"
          #reviewCarousel
        ></app-generic-carousel>

        <!-- Mobile Pagination Text -->
        @if (!(reviews()?.data)) {
        <div class="md:hidden text-center mt-4 text-gray-400">
          Page {{ reviewCarousel.currentPage + 1 }} of
          {{ reviewCarousel.getMaxPages() + 1 }}
        </div>
        }

        <!-- Desktop Dots -->
        <div class="hidden md:flex justify-center mt-4 space-x-2">
          @for(dot of reviewCarousel.getPaginationDots(); track $index) {
          <button
            class="w-2 h-2 rounded-full"
            [class.bg-blue-500]="reviewCarousel.currentPage === $index"
            [class.bg-gray-300]="reviewCarousel.currentPage !== $index"
            (click)="reviewCarousel.goToPage($index)"
          ></button>
          }
        </div>
      </div>

      <!-- Recommendations Section -->
      <div class="container mx-auto px-4 mt-12 mb-8">
        <app-generic-carousel
          title="More Like This"
          [items]="recommendations()?.data ?? []"
          [isLoading]="isRecommendationsLoading()"
          [itemsPerPage]="10"
          [itemsPerPageMobile]="2"
          [showDots]="true"
          [showMobileDots]="false"
          desktopGridClass="grid-cols-5 gap-4"
          mobileGridClass="grid-cols-2 gap-4"
          [loadingTemplateRef]="recommendationLoadingTemplate"
          [itemTemplateRef]="recommendationTemplate"
          #recommendationCarousel
        ></app-generic-carousel>

        <!-- Mobile Pagination Text -->
        @if (!(recommendations()?.data)) {
        <div class="md:hidden text-center mt-4 text-gray-400">
          Page {{ recommendationCarousel.currentPage + 1 }} of
          {{ recommendationCarousel.getMaxPages() + 1 }}
        </div>
        }

        <!-- Desktop Dots -->
        <div class="hidden md:flex justify-center mt-4 space-x-2">
          @for(dot of recommendationCarousel.getPaginationDots(); track $index)
          {
          <button
            class="w-2 h-2 rounded-full"
            [class.bg-blue-500]="recommendationCarousel.currentPage === $index"
            [class.bg-gray-300]="recommendationCarousel.currentPage !== $index"
            (click)="recommendationCarousel.goToPage($index)"
          ></button>
          }
        </div>
      </div>
      }
    </div>

    <!-- Templates -->
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

    <!-- <ng-template #characterTemplate let-characters>
  @for(character of characters; track character.mal_id + '_' + $index) {
    <div class="relative">

      <div
        class="absolute top-2 left-2 z-10 text-white text-xs px-2 py-1 rounded opacity-90"
        [class.bg-green-500]="character.role === 'Main'"
        [class.bg-orange-500]="character.role !== 'Main'">
        {{character.role}}
      </div>

      <img
        [src]="character.character.images.jpg?.image_url || '/assets/placeholder-character.png'"
        [alt]="character.character.name"
        class="w-full h-72 object-cover rounded-lg" />


      <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-2 rounded-b-lg">
        <h3 class="text-yellow-400 text-center font-medium text-sm truncate">
          {{character.character.name}}
        </h3>
      </div>
    </div>
  }
</ng-template> -->

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

  // Carousel states
  currentReviewIndex = 0;
  currentCharactersPage = 0;
  currentRecommendationsPage = 0;

  // Items per page constants
  private readonly DESKTOP_ITEMS_PER_PAGE = 10; // 2 rows of 5
  private readonly MOBILE_ITEMS_PER_PAGE = 2; // 1 row of 2

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

  // ngOnInit() {
  //   const animeId = this.route.snapshot.paramMap.get("id");
  //   if (animeId) {
  //     this.fetchAnimeData(Number(animeId));
  //   }
  // }

  // Characters pagination methods
  getCurrentCharacters(): Character[] {
    const characters = this.animeCharacters()?.data ?? [];
    const itemsPerPage =
      window.innerWidth >= 768
        ? this.DESKTOP_ITEMS_PER_PAGE
        : this.MOBILE_ITEMS_PER_PAGE;
    const startIndex = this.currentCharactersPage * itemsPerPage;
    return characters.slice(startIndex, startIndex + itemsPerPage);
  }

  getMaxCharactersPages(): number {
    const characters = this.animeCharacters()?.data ?? [];
    const itemsPerPage =
      window.innerWidth >= 768
        ? this.DESKTOP_ITEMS_PER_PAGE
        : this.MOBILE_ITEMS_PER_PAGE;
    return Math.ceil(characters.length / itemsPerPage) - 1;
  }

  prevCharactersPage() {
    if (this.currentCharactersPage > 0) {
      this.currentCharactersPage--;
    }
  }

  nextCharactersPage() {
    const maxPages = this.getMaxCharactersPages();
    if (this.currentCharactersPage < maxPages) {
      this.currentCharactersPage++;
    }
  }

  goToCharactersPage(page: number) {
    this.currentCharactersPage = page;
  }

  getCharactersPaginationDots(): number[] {
    const characters = this.animeCharacters()?.data ?? [];
    const itemsPerPage = this.MOBILE_ITEMS_PER_PAGE;
    return Array(Math.ceil(characters.length / itemsPerPage))
      .fill(0)
      .map((_, i) => i);
  }

  // Recommendations pagination methods
  getCurrentRecommendations(): Recommendation[] {
    const recommendations = this.recommendations()?.data ?? [];
    const itemsPerPage =
      window.innerWidth >= 768
        ? this.DESKTOP_ITEMS_PER_PAGE
        : this.MOBILE_ITEMS_PER_PAGE;
    const startIndex = this.currentRecommendationsPage * itemsPerPage;
    return recommendations.slice(startIndex, startIndex + itemsPerPage);
  }

  getMaxRecommendationsPages(): number {
    const recommendations = this.recommendations()?.data ?? [];
    const itemsPerPage =
      window.innerWidth >= 768
        ? this.DESKTOP_ITEMS_PER_PAGE
        : this.MOBILE_ITEMS_PER_PAGE;
    return Math.ceil(recommendations.length / itemsPerPage) - 1;
  }

  prevRecommendationsPage() {
    if (this.currentRecommendationsPage > 0) {
      this.currentRecommendationsPage--;
    }
  }

  nextRecommendationsPage() {
    const maxPages = this.getMaxRecommendationsPages();
    if (this.currentRecommendationsPage < maxPages) {
      this.currentRecommendationsPage++;
    }
  }

  goToRecommendationsPage(page: number) {
    this.currentRecommendationsPage = page;
  }

  getRecommendationsPaginationDots(): number[] {
    const recommendations = this.recommendations()?.data ?? [];
    const itemsPerPage = this.MOBILE_ITEMS_PER_PAGE;
    return Array(Math.ceil(recommendations.length / itemsPerPage))
      .fill(0)
      .map((_, i) => i);
  }

  // Reviews pagination methods (kept from original)
  get maxReviewIndex(): number {
    return this.reviews()?.data
      ? Math.max(0, Math.floor((this.reviews()!.data.length - 1) / 3))
      : 0;
  }

  prevReview() {
    this.currentReviewIndex = Math.max(0, this.currentReviewIndex - 1);
  }

  nextReview() {
    this.currentReviewIndex = Math.min(
      this.maxReviewIndex,
      this.currentReviewIndex + 1
    );
  }

  goToReview(index: number) {
    this.currentReviewIndex = index;
  }

  getReviewDots(): number[] {
    const reviewsCount = this.reviews()?.data?.length ?? 0;
    return Array(Math.ceil(reviewsCount / 3))
      .fill(0)
      .map((_, i) => i);
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
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });

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
