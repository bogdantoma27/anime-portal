import { Component, inject } from '@angular/core';
import { ThemeService } from '../../service/theme.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-theme-toggle',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss'
})
export class ThemeToggleComponent {
  #theme: ThemeService = inject(ThemeService);

  switchTheme(): void {
    this.#theme.toggleTheme();
  }

  isDarkThemeActive(): boolean {
    return this.#theme.isDarkThemeActive();
  }

  getThemeToggleLabel(): string {
    return this.#theme.getToggleLabel();
  }
}

