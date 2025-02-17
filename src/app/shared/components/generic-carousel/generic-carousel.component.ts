import {
  Component,
  Input,
  Output,
  EventEmitter,
  TemplateRef,
  OnInit,
  HostListener,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-generic-carousel",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <!-- Section Header -->
      <div class="flex items-center justify-between mb-6">
        <h2
          class="text-2xl font-bold flex items-center text-black dark:text-slate-400"
        >
          <div class="w-1 h-6 bg-blue-600 mr-3"></div>
          {{ title }}
        </h2>

        <!-- Navigation Buttons (only show if there are items) -->
        @if(items.length > 0) {
        <div class="flex items-center space-x-2">
          <button
            (click)="prevPage()"
            [disabled]="currentPage === 0"
            class="p-2 rounded-full bg-gray-500 dark:bg-gray-700 disabled:opacity-50 transition-opacity"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          <button
            (click)="nextPage()"
            [disabled]="currentPage >= getMaxPages()"
            class="p-2 rounded-full bg-gray-500 dark:bg-gray-700 disabled:opacity-50 transition-opacity"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
        }
      </div>

      <!-- Loading State -->
      @if(isLoading) {
      <ng-container *ngTemplateOutlet="loadingTemplateRef"></ng-container>
      } @if(!isLoading) { @if(items.length > 0) {
      <!-- Desktop View -->
      <div [class]="desktopGridClass" class="hidden md:grid">
        <ng-container
          *ngTemplateOutlet="
            itemTemplateRef;
            context: { $implicit: getCurrentItems(true) }
          "
        ></ng-container>
      </div>

      <!-- Mobile View -->
      <div [class]="mobileGridClass" class="grid md:hidden">
        <ng-container
          *ngTemplateOutlet="
            itemTemplateRef;
            context: { $implicit: getCurrentItems(false) }
          "
        ></ng-container>
      </div>
      } @else {
      <!-- Empty State -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- First item: always visible -->
        <div
          class="bg-gray-800 rounded-lg p-6 flex flex-col items-center justify-center text-center"
        >
        <i class="fas fa-exclamation-triangle text-4xl text-yellow-500 mb-4"></i>
          <p class="text-gray-300">No data available</p>
        </div>

        <!-- Second and third items: hidden on mobile, visible on md and up -->
        @for(item of [2, 3]; track item) {
        <div
          class="hidden md:flex bg-gray-800 rounded-lg p-6 flex-col items-center justify-center text-center"
        >
          <i class="fas fa-exclamation-triangle text-4xl text-yellow-500 mb-4"></i>
          <p class="text-gray-300">No data available</p>
        </div>
        }
      </div>
      } }
    </div>
  `,
})
export class GenericCarouselComponent implements OnInit {
  @Input() title: string = "";
  @Input() items: any[] = [];
  @Input() isLoading: boolean = false;
  @Input() itemsPerPage: number = 4;
  @Input() itemsPerPageMobile: number = 2;
  @Input() showDots: boolean = false;
  @Input() showMobileDots: boolean = true;
  @Input() itemsLabel: string = "items";
  @Input() desktopGridClass: string = "grid-cols-4 gap-4";
  @Input() mobileGridClass: string = "grid-cols-2 gap-4";
  @Input() loadingTemplateRef!: TemplateRef<any>;
  @Input() itemTemplateRef!: TemplateRef<any>;
  @Output() pageChange = new EventEmitter<number>();

  currentPage: number = 0;
  isDesktop: boolean = window.innerWidth >= 768;

  @HostListener("window:resize")
  onResize() {
    this.isDesktop = window.innerWidth >= 768;
  }

  ngOnInit() {
    this.isDesktop = window.innerWidth >= 768;
  }

  getCurrentItems(isDesktop: boolean): any[] {
    const itemsPerPage = isDesktop
      ? this.itemsPerPage
      : this.itemsPerPageMobile;
    const startIndex = this.currentPage * itemsPerPage;
    return this.items.slice(startIndex, startIndex + itemsPerPage);
  }

  getMaxPages(): number {
    const itemsPerPage = this.isDesktop
      ? this.itemsPerPage
      : this.itemsPerPageMobile;
    return Math.ceil(this.items.length / itemsPerPage) - 1;
  }

  getPaginationDots(): number[] {
    return Array(this.getMaxPages() + 1)
      .fill(0)
      .map((_, i) => i);
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.pageChange.emit(this.currentPage);
    }
  }

  nextPage(): void {
    const maxPages = this.getMaxPages();
    if (this.currentPage < maxPages) {
      this.currentPage++;
      this.pageChange.emit(this.currentPage);
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.pageChange.emit(this.currentPage);
  }
}
