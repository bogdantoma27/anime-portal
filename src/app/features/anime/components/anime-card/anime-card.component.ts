import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
import { CommonModule } from "@angular/common";
import { Component, Input, Type, inject, input, signal } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule, Router } from "@angular/router";
import { AnimeResult } from "../../models/anime.model";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

@Component({
  selector: "app-anime-card",
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatIconModule],
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
    <div class="anime-card-wrapper cursor-pointer" [@cardAppear]>
      <mat-card
        class="relative overflow-hidden"
        (mouseenter)="isHovered = true"
        (mouseleave)="isHovered = false"
        [@cardHover]="isHovered ? 'hover' : 'normal'"
        (click)="navigateToAnimeDetails()"
      >
        <div class="card-content">
          <div class="relative">
            <!-- Custom Top Left Corner -->
            @if(customTopLeftContent()) {
            <div [innerHTML]="sanitizeHtml(customTopLeftContent())"></div>
            } @else {
            <div
              class="absolute top-2 left-2 z-10 bg-purple-600 text-white text-xs px-2 py-1 rounded opacity-90"
            >
              #{{ rank }}
            </div>
            }

            <!-- Custom Top Right Corner -->
            @if(customTopRightContent()) {
            <div [innerHTML]="sanitizeHtml(customTopRightContent())"></div>
            } @else {
            <div
              class="absolute top-2 right-2 z-10 bg-yellow-400 text-black text-xs px-2 py-1 rounded opacity-90 flex items-center"
            >
              <i class="fa-solid fa-star mr-1"></i>
              {{ anime().score || "N/A" }}
            </div>
            }

            <img
              [src]="anime().images.jpg?.image_url || '/assets/placeholder.png'"
              [alt]="anime().title"
              class="w-full h-72 object-cover"
            />

            <!-- Mobile Details -->
            <div
              class="md:hidden absolute inset-0 bg-black bg-opacity-70 p-4 text-white flex flex-col justify-between"
            >
              <div class="mb-4 mt-6">
                <h3 class="text-sm font-bold truncate text-yellow-400 mb-2">
                  {{ anime().title }}
                </h3>
                <div class="flex items-center gap-2 mb-2">
                  <i class="fa-solid fa-film text-xs w-4"></i>
                  <span class="text-sm flex-grow truncate">{{
                    anime().type
                  }}</span>
                </div>
                <div
                  class="flex-grow overflow-y-auto pr-2 custom-scrollbar max-h-[165px]"
                >
                  <p class="text-xs opacity-80">
                    {{ anime().synopsis || "No synopsis available" }}
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
                {{ anime().title }}
              </h3>
            </div>

            <!-- Desktop Hover Details Overlay -->
            @if(isHovered){
            <div
              class="hidden md:flex absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm items-center justify-center"
            >
              <div class="text-white w-full p-4 mt-8">
                <h3 class="text-base font-medium text-yellow-400 mb-2 truncate">
                  {{ anime().title }}
                </h3>
                <div class="flex items-center space-x-4 text-sm mb-2">
                  <div class="flex items-center space-x-1">
                    <mat-icon class="text-base text-yellow-400">star</mat-icon>
                    <span>{{ anime().score || "N/A" }} </span>
                  </div>
                  <div class="flex items-center space-x-1 w-full">
                    <i class="fa-solid fa-film text-xs w-4"></i>
                    <span
                      class="max-w-[55px] whitespace-nowrap overflow-hidden text-ellipsis"
                    >
                      {{ anime().type }}
                    </span>
                  </div>
                </div>
                <div
                  class="h-[160px] text-xs opacity-80 relative overflow-hidden line-clamp-[8]"
                >
                  {{ anime().synopsis || "No synopsis available" }}
                </div>
              </div>
            </div>
            }
          </div>
        </div>
      </mat-card>
    </div>
  `,
})
export class AnimeCardComponent {
  anime = input.required<AnimeResult>();
  rankingType = input<
    "airing" | "upcoming" | "movies" | "popular" | "favorite"
  >("airing");
  rankingList = input<AnimeResult[]>([]);
  customTopLeftContent = input<string | null>(null);
  customTopRightContent = input<string | null>(null);

  // Sanitize HTML to prevent XSS
  sanitizeHtml(html: string | null): SafeHtml {
    return html ? this.sanitizer.bypassSecurityTrustHtml(html) : "";
  }

  isHovered = false;
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);

  navigateToAnimeDetails() {
    this.router.navigate(["/anime", this.anime().mal_id], {
      queryParams: { title: this.anime().title },
    });
  }

  formatAiredDate(aired: any): string {
    if (!aired || !aired.from) return "Unknown";

    try {
      const date = new Date(aired.from);
      return date.getFullYear().toString();
    } catch {
      return "Unknown";
    }
  }

  get rank(): number | string {
    const anime = this.anime();
    const list = this.rankingList();

    if (list.length === 0) return "N/A";

    // Find the index of the current anime in the list based on ranking type
    let index = -1;
    switch (this.rankingType()) {
      case "airing":
        index = list.findIndex((a) => a.mal_id === anime.mal_id);
        break;
      case "upcoming":
        index = list.findIndex((a) => a.mal_id === anime.mal_id);
        break;
      case "movies":
        index = list.findIndex((a) => a.mal_id === anime.mal_id);
        break;
      case "popular":
        // Sort by popularity (lower value means more popular)
        const popularList = [...list].sort(
          (a, b) => (a.popularity || Infinity) - (b.popularity || Infinity)
        );
        index = popularList.findIndex((a) => a.mal_id === anime.mal_id);
        break;
      case "favorite":
        // Sort by favorites (higher value means more favorites)
        const favoriteList = [...list].sort(
          (a, b) => (b.favorites || 0) - (a.favorites || 0)
        );
        index = favoriteList.findIndex((a) => a.mal_id === anime.mal_id);
        break;
      default:
        index = list.findIndex((a) => a.mal_id === anime.mal_id);
    }

    // Add 1 to convert from zero-based index to rank
    return index !== -1 ? index + 1 : "N/A";
  }
}
