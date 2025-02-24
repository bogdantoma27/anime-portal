import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
import { CommonModule } from "@angular/common";
import { Component, computed, inject, signal, input } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule, Router } from "@angular/router";
import {
  Character,
  CharacterCardMode,
  CharacterInput,
} from "../../models/character.model";

@Component({
  selector: "app-character-card",
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
  ],
  template: `
   <mat-card
      class="relative overflow-hidden cursor-pointer"
      (mouseenter)="isHovered.set(!simplifiedView())"
      (mouseleave)="isHovered.set(false)"
      [@cardHover]="!simplifiedView() ? (isHovered() ? 'hover' : 'normal') : 'normal'"
      (click)="navigateToCharacterDetails()">
      <div class="card-content">
        <div class="relative">
          <!-- Dynamic Badge (Rank or Role) -->
          <div
            class="absolute top-2 left-2 z-10 text-white text-xs px-2 py-1 rounded opacity-90"
            [class.bg-purple-600]="displayType() === 'rank'"
            [class.bg-green-500]="displayType() === 'role' && role() === 'Main'"
            [class.bg-orange-500]="displayType() === 'role' && role() !== 'Main'">
            {{displayType() === "rank" ? "#" + rank() : role()}}
          </div>

          <!-- Favorites Badge - Conditionally rendered -->
          @if(showFavoritesBadge()) {
            <div class="absolute top-2 right-2 z-10 bg-yellow-400 text-black text-xs px-2 py-1 rounded opacity-90">
              <div class="flex items-center justify-between">
                <span>
                  <i class="fa-solid fa-heart mr-2 text-red-600"></i>
                  {{characterData().favorites}}
                </span>
              </div>
            </div>
          }

          <img
            [src]="characterData().images.jpg?.image_url || '/assets/placeholder-character.png'"
            [alt]="characterData().name"
            class="w-full h-72 object-cover"/>

          <!-- Mobile Details (only when not simplified and mode is default) -->
          @if(!simplifiedView() && showMobileDetails()) {
            <div class="md:hidden absolute inset-0 bg-black bg-opacity-70 p-4 text-white flex flex-col justify-between">
              <div class="mb-4 mt-6">
                <h3 class="text-sm font-bold truncate text-yellow-400 mb-2">{{characterData().name}}</h3>
                @let parsedAbout = parseCharacterAbout(characterData().about || '');
                @if(parsedAbout | keyvalue) {
                  <div class="space-y-1 max-h-[175px] overflow-y-auto overflow-x-hidden custom-scrollbar pr-2">
                    @for(item of parsedAbout | keyvalue; track item.key) {
                      <div class="text-xs">
                        <span class="font-medium capitalize">{{item.key}}:</span>
                        <span class="opacity-80">{{item.value}}</span>
                      </div>
                    }
                  </div>
                }
              </div>
            </div>
          }

          <!-- Simplified View Title (always shown when simplified) -->
          @if(simplifiedView()) {
            <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-2">
              <h3 class="text-yellow-400 text-center font-medium text-sm truncate">
                {{characterData().name}}
              </h3>
            </div>
          }

          <!-- Regular Desktop Title (only when not simplified and not hovered) -->
          @if(!simplifiedView() && !isHovered()) {
            <div class="hidden md:block absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-2">
              <h3 class="text-yellow-400 text-center font-medium text-sm truncate">
                {{characterData().name}}
              </h3>
            </div>
          }

          <!-- Regular Desktop Hover Details (only when not simplified) -->
          @if(!simplifiedView() && isHovered()) {
            <div class="hidden md:flex absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm items-center justify-center">
              <div class="text-white w-full p-4 mt-4">
                <h3 class="text-base font-medium text-yellow-400 mb-4 truncate">{{characterData().name}}</h3>
                @let parsedAbout = parseCharacterAbout(characterData().about || '');
                @if(parsedAbout | keyvalue) {
                  <div class="h-[185px] text-xs opacity-80 relative overflow-y-auto custom-scrollbar pr-2">
                    @for(item of parsedAbout | keyvalue; track item.key) {
                      <div class="mb-1">
                        <span class="font-medium capitalize">{{item.key}}:</span>
                        <span class="opacity-80">{{item.value}}</span>
                      </div>
                    }
                  </div>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </mat-card>
  `,
})
export class CharacterCardComponent {
  // Signals for inputs
  character = input.required<CharacterInput>();
  characterList = input<Character[]>([]);
  role = input<string>('Supporting');
  displayType = input<'rank' | 'role'>('rank');
  showFavoritesBadge = input<boolean>(true);
  mode = input<CharacterCardMode>('default');
  simplifiedView = input<boolean>(false);

  // Local state signal
  isHovered = signal(false);

  private router = inject(Router);

  // Computed character data
  characterData = computed<Character>(() => {
    const input = this.character();

    // Check if it's an AnimeCharacter-like object with a nested character
    if (input && 'character' in input) {
      const nestedChar = input.character;
      return {
        mal_id: nestedChar.mal_id,
        url: nestedChar.url,
        images: {
          jpg: {
            image_url:
              nestedChar.images.jpg?.image_url ||
              nestedChar.images.jpg?.small_image_url ||
              "/assets/placeholder-character.png",
          },
        },
        name: nestedChar.name,
        favorites: nestedChar.favorites ?? 0,
        about: "", // Add default empty string for about
      };
    }

    // If it's already a Character type, return as-is
    return input as Character;
  });

  // Computed properties
  name = computed(() => this.characterData().name);
  mal_id = computed(() => this.characterData().mal_id);

  // Computed to replicate the original getter logic
  showMobileDetails = computed(() => this.mode() === 'default');

  rank = computed(() => {
    if (this.displayType() !== 'rank') return 'N/A';

    const list = this.characterList();
    if (list.length === 0) return 'N/A';

    const index = list.findIndex((c) => c.mal_id === this.mal_id());
    return index !== -1 ? index + 1 : 'N/A';
  });

  navigateToCharacterDetails() {
    this.router.navigate(["/character", this.mal_id()], {
      queryParams: { name: this.name() },
    });
  }

  parseCharacterAbout(about: string): { [key: string]: string } {
    if (!about) return {};

    const categories: { [key: string]: string } = {};

    const lines = about.split("\n");

    lines.forEach((line) => {
      line = line.trim().replace(/[:.]$/, "");

      const colonIndex = line.indexOf(":");

      if (colonIndex !== -1) {
        const category = line.slice(0, colonIndex).trim();
        const value = line.slice(colonIndex + 1).trim();

        if (category && value) {
          categories[category] = value;
        }
      }
    });

    return categories;
  }
}
