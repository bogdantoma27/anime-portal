import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { ThemeService } from "../../../core/services/theme.service";

@Component({
  selector: "app-theme-toggle",
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <a
      (click)="themeService.toggleDarkMode()"
      class="
              text-gray-700 dark:text-gray-300
              hover:text-blue-600 dark:hover:text-blue-400
              transition-colors
              flex items-center
              p-2 pr-0
              rounded-lg
              cursor-pointer
            "
    >
      <mat-icon class="text-yellow-500 dark:text-blue-400 focus:outline-none
      hover:text-yellow-600 dark:hover:text-blue-500 transition-colors">
        {{ themeService.isDarkMode() ? "dark_mode" : "light_mode" }}
      </mat-icon>
    </a>
  `,
})
export class ThemeToggleComponent {
  protected themeService = inject(ThemeService);
}
