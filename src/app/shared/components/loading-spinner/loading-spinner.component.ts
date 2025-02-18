// loading-spinner.component.ts
import { Component, Input } from "@angular/core";

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    <div class="relative w-full h-full">
      <div class="absolute inset-0 flex items-center justify-center">
        <div [class]="spinnerClass"></div>
      </div>
    </div>
  `
})
export class LoadingSpinnerComponent {
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() color: 'current' | 'primary' | 'secondary' = 'current';

  private get sizeMap() {
    return {
      sm: 'h-3 w-3 border',
      md: 'h-4 w-4 border-2',
      lg: 'h-6 w-6 border-2',
      xl: 'h-8 w-8 border-3',
    };
  }

  private get colorMap() {
    return {
      current: 'border-current',
      primary: 'border-blue-500',
      secondary: 'border-gray-500',
    };
  }

  get spinnerClass(): string {
    return `
      ${this.sizeMap[this.size]}
      animate-spin
      rounded-full
      border-solid
      ${this.colorMap[this.color]}
      border-r-transparent
      motion-reduce:animate-[spin_1.5s_linear_infinite]
    `.trim();
  }
}


/*

// Small spinner with specific height
<app-loading-spinner size="sm" containerHeight="h-20" />

// Large primary colored spinner
<app-loading-spinner size="lg" color="primary" />

// Custom container height
<app-loading-spinner containerHeight="min-h-[200px]" />

*/
