// core/services/theme.service.ts
import { Injectable } from '@angular/core';
import { Signal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = signal(false);
  isDarkMode: Signal<boolean> = this.darkMode.asReadonly();

  constructor() {
    this.initTheme();
  }

  private initTheme() {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === null) {
      // First time user - use system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.darkMode.set(prefersDark);
    } else {
      // Use saved preference
      this.darkMode.set(savedTheme === 'dark');
    }

    this.updateTheme();
  }

  toggleDarkMode(): void {
    this.darkMode.update(current => !current);
    localStorage.setItem('theme', this.darkMode() ? 'dark' : 'light');
    this.updateTheme();
  }

  private updateTheme(): void {
    if (this.darkMode()) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
