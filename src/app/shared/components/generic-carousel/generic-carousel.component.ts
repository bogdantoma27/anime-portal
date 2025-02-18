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
    <div
      (touchstart)="onTouchStart($event)"
      (touchmove)="onTouchMove($event)"
      (touchend)="onTouchEnd()"
    >
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
      } @else { @if(items.length > 0) {
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
      <ng-container
        *ngTemplateOutlet="
          emptyStateTemplateRef ||
          (isDesktop ? desktopEmptyStateTemplate : defaultEmptyStateTemplate)
        "
      ></ng-container>
      } }

      <!-- Pagination -->
      @if (items.length > 0) { @if (items.length > 20) {
      <div class="grid md:hidden text-center mt-4 text-gray-400">
        <div
          class="flex items-center justify-center gap-2 text-sm text-gray-500 mb-2"
        >
          <i class="fas fa-hand-point-left mr-1"></i>
          Swipe to explore more
          <i class="fas fa-hand-point-right ml-1"></i>
        </div>
        <div class="text-center mt-4">
          <div
            class="inline-flex items-center
                border border-blue-100
                bg-blue-50/50
                dark:border-blue-800
                dark:bg-blue-900/50
                rounded-full
                px-4
                py-1
                text-sm
                text-blue-600
                dark:text-blue-300
                shadow-sm"
          >
            <i class="fas fa-ellipsis-h mr-2 opacity-70"></i>
            {{ currentPage + 1 }} of {{ getMaxPages() + 1 }}
          </div>
        </div>
      </div>
      } @if (getMaxPages() > 0) { @if (getMaxPages() <= 20) {
      <div class="hidden md:flex justify-center mt-4 space-x-2">
        @for(dot of getPaginationDots(); track $index) {
        <button
          class="w-2 h-2 rounded-full"
          [class.bg-blue-500]="currentPage === $index"
          [class.bg-gray-300]="currentPage !== $index"
          (click)="goToPage($index)"
        ></button>
        }
      </div>
      } @else {
      <div class="hidden md:flex justify-center mt-4">
        <div
          class="inline-flex items-center
                border border-blue-100
                bg-blue-50/50
                dark:border-blue-800
                dark:bg-blue-900/50
                rounded-full
                px-4
                py-1
                text-sm
                text-blue-600
                dark:text-blue-300
                shadow-sm"
        >
          <i class="fas fa-ellipsis-h mr-2 opacity-70"></i>
          {{ currentPage + 1 }} of {{ getMaxPages() + 1 }}
        </div>
      </div>
      } } }
    </div>

    <ng-template #defaultEmptyStateTemplate>
      <div class="grid grid-cols-1 gap-4">
        <div
          class="bg-gray-800 rounded-lg p-6 flex flex-col items-center justify-center text-center"
        >
          <i
            class="fas fa-exclamation-triangle text-4xl text-yellow-500 mb-4"
          ></i>
          <p class="text-gray-300">No data available</p>
        </div>
      </div>
    </ng-template>

    <ng-template #desktopEmptyStateTemplate>
      <div class="grid grid-cols-3 gap-4">
        @for(i of [1,2,3]; track i) {
        <div
          class="bg-gray-800 rounded-lg p-6 flex flex-col items-center justify-center text-center"
        >
          <i
            class="fas fa-exclamation-triangle text-4xl text-yellow-500 mb-4"
          ></i>
          <p class="text-gray-300">No data available</p>
        </div>
        }
      </div>
    </ng-template>
  `,
})
export class GenericCarouselComponent implements OnInit {
  @Input() title: string = "";
  @Input() items: any[] = [];
  @Input() isLoading: boolean = false;
  @Input() itemsPerPage: number = 4;
  @Input() itemsPerPageMobile: number = 2;
  @Input() desktopGridClass: string = "grid-cols-4 gap-4";
  @Input() mobileGridClass: string = "grid-cols-2 gap-4";
  @Input() loadingTemplateRef!: TemplateRef<any>;
  @Input() itemTemplateRef!: TemplateRef<any>;
  @Input() emptyStateTemplateRef?: TemplateRef<any>;
  @Input() onPageChange?: (page: number) => void;
  @Input() minSwipeDistance: number = 50;
  @Input() maxVerticalDistance: number = 30;
  @Output() pageChange = new EventEmitter<number>();

  // Touch event properties
  private touchStartX: number = 0;
  private touchStartY: number = 0;
  private touchEndX: number = 0;
  private touchEndY: number = 0;

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
      this.emitPageChange();
    }
  }

  nextPage(): void {
    const maxPages = this.getMaxPages();
    if (this.currentPage < maxPages) {
      this.currentPage++;
      this.emitPageChange();
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.emitPageChange();
  }

  private emitPageChange() {
    this.pageChange.emit(this.currentPage);
    if (this.onPageChange) {
      this.onPageChange(this.currentPage);
    }
  }

  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
    this.touchEndX = 0;
    this.touchEndY = 0;
  }

  onTouchMove(event: TouchEvent) {
    this.touchEndX = event.touches[0].clientX;
    this.touchEndY = event.touches[0].clientY;
  }

  onTouchEnd() {
    if (this.touchStartX && this.touchEndX) {
      const swipeDistanceX = this.touchEndX - this.touchStartX;
      const swipeDistanceY = Math.abs(this.touchEndY - this.touchStartY);

      if (
        Math.abs(swipeDistanceX) >= this.minSwipeDistance &&
        swipeDistanceY <= this.maxVerticalDistance
      ) {
        if (swipeDistanceX > 0) {
          this.prevPage();
        } else {
          this.nextPage();
        }
      }
    }

    // Reset touch coordinates
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchEndX = 0;
    this.touchEndY = 0;
  }
}
