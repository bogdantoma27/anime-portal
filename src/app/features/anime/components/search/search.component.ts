import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import {
  Subject,
  Subscription,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  of,
  finalize,
} from "rxjs";
import { SearchService } from "../../services/search.service";

@Component({
  selector: "app-search-dialog",
  template: `
    <div
      class="bg-white dark:bg-slate-900 dark:bg-gradient-to-l dark:from-slate-800 w-full max-w-[500px] h-screen md:h-[600px] flex flex-col overflow-hidden"
    >
      <div class="p-6 pb-0">
        <h2 class="text-3xl font-bold mb-2 dark:text-white">Search</h2>
        <p class="text-gray-500 dark:text-gray-400 mb-6">
          Discover anime by title
        </p>

        <div class="relative mb-4">
          <i
            class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          ></i>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (input)="debouncedSearch()"
            placeholder="Type anime title"
            class="
              w-full
              px-10
              py-3
              bg-gray-100
              dark:bg-slate-700
              rounded-lg
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
              placeholder-gray-500
            "
          />
        </div>
      </div>

      <div class="flex-grow overflow-y-auto scrollbar-hide px-6 pt-2 pb-6">
        @if(searchQuery.length === 0) {
        <div class="text-center py-8 text-gray-500">
          Type something to search...
        </div>
        } @if(isLoading) {
        <div class="flex justify-center items-center py-8">
          <div
            class="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
          ></div>
        </div>
        } @if(!isLoading && searchQuery.length > 0) { @if(searchResults.length
        === 0) {
        <div class="text-center py-8 text-gray-500">No results found</div>
        } @for(item of searchResults; track item.mal_id + '_' + $index) {
        <div
          class="
                flex
                items-center
                px-4
                py-3
                hover:bg-gray-100
                dark:hover:bg-slate-700
                cursor-pointer
                transition-colors
                rounded-lg
                mb-2
              "
          (click)="selectAnime(item)"
        >
          <img
            [src]="item.images.webp.small_image_url"
            alt="{{ item.title_english || item.title }}"
            class="w-12 h-16 object-cover rounded-md mr-4 flex-shrink-0"
          />
          <div class="flex-grow overflow-hidden">
            <h3 class="text-md font-semibold dark:text-white truncate">
              {{ item.title_english || item.title }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ item.type }} · {{ item.year || "Unknown Year" }}
            </p>
          </div>
        </div>
        } }
      </div>
    </div>
  `,
  imports: [FormsModule, CommonModule],
  styles: [
    `
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      .scrollbar-hide {
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
      }
    `,
  ],
})
export class SearchComponent implements OnInit, OnDestroy {
  searchQuery = "";
  searchResults: any[] = [];
  isLoading = false;
  private searchSubject = new Subject<string>();
  private searchSubscription: Subscription = new Subscription();

  constructor(
    private searchService: SearchService,
    public dialogRef: MatDialogRef<SearchComponent>
  ) {}

  ngOnInit() {
    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((query) => {
          if (query.length < 2) {
            return of([]);
          }

          this.isLoading = true;
          return this.searchService
            .searchAnime(query)
            .pipe(finalize(() => (this.isLoading = false)));
        })
      )
      .subscribe((results) => {
        this.searchResults = results;
      });
  }

  ngOnDestroy() {
    this.searchSubscription?.unsubscribe();
  }

  debouncedSearch() {
    this.searchSubject.next(this.searchQuery);
  }

  selectAnime(anime: any) {
    this.dialogRef.close(anime);
  }
}
