import { Component, signal, inject, HostListener } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  trigger,
  transition,
  style,
  animate,
  state,
} from "@angular/animations";
import { Router, RouterModule } from "@angular/router";
import { ThemeToggleComponent } from "../../../shared/components/theme-toggle/theme-toggle.component";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { SearchComponent } from "../../anime/components/search/search.component";

interface NavItem {
  label: string;
  link: string;
  icon: string;
  subItems?: NavItem[];
}

@Component({
  selector: "app-header",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ThemeToggleComponent,
    MatButtonModule,
    MatIconModule,
  ],
  animations: [
    trigger("toolbar", [
      state(
        "hidden",
        style({
          transform: "translateY(-100%)",
          opacity: 0,
        })
      ),
      state(
        "visible",
        style({
          transform: "translateY(0)",
          opacity: 1,
        })
      ),
      transition("hidden => visible", animate("300ms ease-out")),
      transition("visible => hidden", animate("300ms ease-in")),
    ]),
    trigger("menuAnimation", [
      transition(":enter", [
        style({ height: 0, opacity: 0 }),
        animate("200ms ease-out", style({ height: "*", opacity: 1 })),
      ]),
      transition(":leave", [
        animate("200ms ease-in", style({ height: 0, opacity: 0 })),
      ]),
    ]),
    trigger("hamburgerIcon", [
      transition("* => *", [animate("200ms ease-in-out")]),
    ]),
    trigger("dropdownAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(-10px)" }),
        animate(
          "200ms ease-out",
          style({ opacity: 1, transform: "translateY(0)" })
        ),
      ]),
      transition(":leave", [
        animate(
          "200ms ease-in",
          style({ opacity: 0, transform: "translateY(-10px)" })
        ),
      ]),
    ]),
  ],
  template: `
    <nav
      class="fixed w-full z-50 top-0 px-3 backdrop-blur-xl flex-none lg:z-50 border-b lg:border-slate-900/10 dark:border-slate-50/[0.06] bg-white/75 dark:bg-slate-900/75"
    >
      <div class="container mx-auto px-4 md:px-6">
        <div class="flex items-center justify-between h-20">
          <!-- Logo -->
          <div
            class="text-2xl lg:text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent animate-gradient-x hover:scale-105 transition-transform duration-300 cursor-pointer drop-shadow-[0_0_3px_rgba(59,130,246,0.5)] hover:drop-shadow-[0_0_9px_rgba(59,130,246,0.7)]"
            [routerLink]="['/home']"
            >
            AnimePortal
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center justify-end flex-1">
            <div class="flex items-center space-x-6 mr-6">
              <!-- Anime Dropdown for Desktop -->
              <div
                class="relative"
                (mouseenter)="openAnimeDropdown()"
                (mouseleave)="onButtonMouseLeave()"
              >
                <a
                  class="flex items-center px-3 py-2 rounded-lg transition-colors group text-base cursor-pointer"
                >
                  <span
                    class="group-hover:text-blue-600 dark:group-hover:text-blue-400 w-5 h-5 flex items-center justify-center"
                  >
                    <i class="fas fa-film"></i>
                  </span>
                  <span
                    class="group-hover:text-blue-600 dark:group-hover:text-blue-400 font-medium ml-2 me-2"
                    >Anime</span
                  >
                  <i
                    class="fas fa-chevron-down text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 ml-1"
                  ></i>
                </a>

                <!-- Desktop Dropdown Menu -->
                @if(animeDropdownOpen()) {
                <div
                  class="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-lg border dark:border-slate-700"
                  [@dropdownAnimation]
                  (mouseenter)="onDropdownMouseEnter()"
                  (mouseleave)="onDropdownMouseLeave()"
                >
                  <div class="py-1">
                    @for(item of animeDropdownItems; track item.label) {
                    <a
                      [routerLink]="item.link"
                      (click)="closeMobileMenu()"
                      class="px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center text-slate-700 dark:text-slate-300"
                    >
                      <i [class]="item.icon" class="mr-3 w-5 text-center"></i>
                      {{ item.label }}
                    </a>
                    }
                  </div>
                </div>
                }
              </div>

              <!-- Characters Item -->
              <!-- <a
                [routerLink]="'/characters'"
                class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors group text-base"
              >
                <span
                  class="group-hover:text-blue-600 dark:group-hover:text-blue-400 w-5 h-5 flex items-center justify-center"
                >
                  <i class="fas fa-users"></i>
                </span>
                <span
                  class="group-hover:text-blue-600 dark:group-hover:text-blue-400 font-medium"
                  >Characters</span
                >
              </a> -->
            </div>

            <!-- Theme Toggle and GitHub Button -->
            <div class="flex items-center space-x-4">
              <!-- GitHub Button -->
              <a
                href="https://github.com/bogdantoma27"
                target="_blank"
                class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center p-2 rounded-lg"
              >
                <i class="fab fa-github text-xl"></i>
              </a>

              <!-- Search Button -->
              <button
                (click)="openSearchDialog()"
                class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center p-2 rounded-lg"
              >
                <i class="fas fa-search text-xl"></i>
              </button>

              <!-- Theme Toggle -->
              <app-theme-toggle />
            </div>
          </div>

          <!-- Mobile Menu Controls -->
          <div class="flex items-center space-x-1 md:hidden">
            <!-- Search Button -->
            <button
              (click)="openSearchDialog()"
              class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
            >
              <i class="fas fa-search text-xl"></i>
            </button>

            <!-- GitHub Button -->
            <a
              href="https://github.com/bogdantoma27"
              target="_blank"
              class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center p-3 rounded-lg"
            >
              <i class="fab fa-github text-xl"></i>
            </a>

            <app-theme-toggle />

            <!-- Hamburger Menu Button -->
            <button
              class="md:hidden p-2 pl-0 rounded-lg transition-colors relative w-10 h-10 mx-4 cursor-pointer"
              (click)="toggleMobileMenu()"
              [@hamburgerIcon]
            >
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-6 h-6 relative">
                  <span
                    class="absolute w-full h-0.5 bg-slate-500 transform transition-all duration-300"
                    [style.top]="mobileMenuOpen() ? '50%' : '25%'"
                    [style.transform]="
                      mobileMenuOpen()
                        ? 'translateY(-50%) rotate(45deg)'
                        : 'none'
                    "
                  >
                  </span>
                  <span
                    class="absolute w-full h-0.5 bg-slate-500 top-1/2 transform -translate-y-1/2 transition-opacity duration-300"
                    [style.opacity]="mobileMenuOpen() ? '0' : '1'"
                  >
                  </span>
                  <span
                    class="absolute w-full h-0.5 bg-slate-500 transform transition-all duration-300"
                    [style.bottom]="mobileMenuOpen() ? '50%' : '25%'"
                    [style.transform]="
                      mobileMenuOpen()
                        ? 'translateY(50%) rotate(-45deg)'
                        : 'none'
                    "
                  >
                  </span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu Dropdown -->
      <div
        class="md:hidden overflow-hidden"
        *ngIf="mobileMenuOpen()"
        [@menuAnimation]
      >
        <div class="py-2">
          <!-- Anime Dropdown in Mobile Menu -->
          <div>
            <a
              class="flex items-center px-4 py-3 transition-colors w-full group text-base cursor-pointer"
              (click)="toggleMobileAnimeMenu()"
            >
              <span
                class="w-5 h-5 flex items-center justify-center text-slate-600 dark:text-slate-400"
              >
                <i class="fas fa-film"></i>
              </span>
              <span class="font-medium ml-3 text-slate-700 dark:text-slate-300"
                >Anime</span
              >
              <i
                class="fas fa-chevron-down ml-auto text-slate-600 dark:text-slate-400 transition-transform duration-200"
                [class.rotate-180]="mobileAnimeMenuOpen()"
              ></i>
            </a>

            <!-- Mobile Anime Submenu -->
            @if(mobileAnimeMenuOpen()) {
            <div [@menuAnimation]>
              @for(item of animeDropdownItems; track item.label) {
              <a
                [routerLink]="item.link"
                (click)="closeMobileMenu()"
                class="flex items-center px-8 py-2 transition-colors w-full group text-sm hover:bg-slate-100/50 dark:hover:bg-slate-800/50 active:bg-slate-200/50 dark:active:bg-slate-700/50"
              >
                <i
                  [class]="item.icon"
                  class="mr-3 w-5 text-center text-slate-600 dark:text-slate-400"
                ></i>
                <span class="text-slate-700 dark:text-slate-300">{{
                  item.label
                }}</span>
              </a>
              }
            </div>
            }
          </div>

          <!-- Characters Item -->
          <!-- <a
            [routerLink]="'/characters'"
            (click)="closeMobileMenu()"
            class="flex items-center px-4 py-3 transition-colors w-full group text-base hover:bg-slate-100/50 dark:hover:bg-slate-800/50 active:bg-slate-200/50 dark:active:bg-slate-700/50"
          >
            <span
              class="w-5 h-5 flex items-center justify-center text-slate-600 dark:text-slate-400"
            >
              <i class="fas fa-users"></i>
            </span>
            <span class="font-medium ml-3 text-slate-700 dark:text-slate-300"
              >Characters</span
            >
          </a> -->
        </div>
      </div>
    </nav>
  `,
})
export class HeaderComponent {
  toolbarVisible = signal(true);
  mobileMenuOpen = signal(false);
  mobileAnimeMenuOpen = signal(false);
  animeDropdownOpen = signal(false);
  isDesktop = true;
  protected dialog = inject(MatDialog);
  protected router = inject(Router);

  private isButtonHovered = false;
  private isDropdownHovered = false;
  private closeDropdownTimer: any = null;

  constructor() {
    this.checkDeviceType();
  }

  @HostListener("window:resize")
  checkDeviceType() {
    this.isDesktop = window.innerWidth >= 768;
  }

  animeDropdownItems = [
    { label: "Top Anime", link: "/top/anime", icon: "fas fa-trophy" },
    { label: "Top Airing", link: "/top/airing", icon: "fas fa-play-circle" },
    {
      label: "Top Upcoming",
      link: "/top/upcoming",
      icon: "fas fa-calendar-alt",
    },
    { label: "Top Movies", link: "/top/movies", icon: "fas fa-film" },
    { label: "Most Popular", link: "/top/popular", icon: "fas fa-fire" },
    { label: "Most Favorite", link: "/top/favorite", icon: "fas fa-heart" },
  ];

  toggleAnimeDropdown() {
    if (!this.isDesktop) {
      this.animeDropdownOpen.update((value) => !value);
    }
  }

  openAnimeDropdown() {
    if (this.isDesktop) {
      this.cancelCloseDropdownTimer();
      this.isButtonHovered = true;
      this.animeDropdownOpen.set(true);
    }
  }

  onButtonMouseLeave() {
    if (this.isDesktop) {
      this.isButtonHovered = false;
      this.startCloseDropdownTimer();
    }
  }

  onDropdownMouseEnter() {
    if (this.isDesktop) {
      this.cancelCloseDropdownTimer();
      this.isDropdownHovered = true;
    }
  }

  onDropdownMouseLeave() {
    if (this.isDesktop) {
      this.isDropdownHovered = false;
      this.startCloseDropdownTimer();
    }
  }

  startCloseDropdownTimer() {
    if (!this.isButtonHovered && !this.isDropdownHovered) {
      this.closeDropdownTimer = setTimeout(() => {
        this.animeDropdownOpen.set(false);
      }, 150);
    }
  }

  cancelCloseDropdownTimer() {
    if (this.closeDropdownTimer) {
      clearTimeout(this.closeDropdownTimer);
      this.closeDropdownTimer = null;
    }
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.update((value) => !value);
    this.mobileAnimeMenuOpen.set(false);
  }

  toggleMobileAnimeMenu() {
    setTimeout(() => {
      this.mobileAnimeMenuOpen.update((value) => !value);
    }, 0);
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
    this.mobileAnimeMenuOpen.set(false);
    this.animeDropdownOpen.set(false);
  }

  openSearchDialog() {
    const dialogRef = this.dialog.open(SearchComponent, {
      width: "90%",
      maxWidth: "500px",
      height: "90%",
      maxHeight: "600px",
      panelClass: "custom-search-dialog",
      backdropClass: "backdrop-blur-lg",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // console.log("Selected Anime:", result);
        this.router.navigate(["/anime", result.mal_id]);
      }
    });
  }
}
