import { effect, Injectable, Renderer2, RendererFactory2, signal, WritableSignal } from '@angular/core';

export const storageKey = 'theme';
@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  themeSignal: WritableSignal<string> = signal<string>('light-theme');
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.initializeThemeFromPreferences();

    effect(() => {
      this.updateRenderedTheme();
    });
  }

  toggleTheme(): void {
    this.themeSignal.update((prev) =>
      this.isDarkThemeActive() ? 'light-theme' : 'dark-theme'
    );
  }

  private initializeThemeFromPreferences(): void {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.themeSignal.update(() => prefersDark ? 'dark-theme' : 'light-theme');

    const storedTheme = localStorage.getItem(storageKey);

    if (storedTheme) {
      this.themeSignal.update(() => storedTheme);
    }
  }

  getToggleLabel(): string {
    return `Switch to ${
      this.isDarkThemeActive() ? 'light-theme' : 'dark-theme'
    }`;
  }

  isDarkThemeActive(): boolean {
    return this.themeSignal() === 'dark-theme' ? true : false;
  }

  private updateRenderedTheme(): void {
    const previousColorTheme =
      this.themeSignal() === 'dark-theme' ? 'light-theme' : 'dark-theme';
    this.renderer.removeClass(document.body, previousColorTheme);
    this.renderer.addClass(document.body, this.themeSignal());

    // if (this.themeSignal() === 'dark-theme')
    //   document.documentElement.setAttribute('data-bs-theme', 'dark');
    // else document.documentElement.removeAttribute('data-bs-theme');

    localStorage.setItem(storageKey, this.themeSignal());
  }
}




// const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
// this.setTheme(prefersDark ? 'dark' : 'light');
