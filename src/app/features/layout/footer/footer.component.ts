import { Component, OnInit, HostListener } from "@angular/core";

@Component({
  selector: 'app-footer',
  template: `
    <footer
      class="fixed bottom-0 left-0 w-full py-4 text-center bg-white
      dark:bg-gradient-to-l dark:from-slate-800 dark:to-slate-900 border-t
      border-slate-200 dark:border-slate-200/5 transition-opacity duration-300"
      [class.opacity-0]="!showFooter"
      [class.pointer-events-none]="!showFooter"
    >
      <div class="container mx-auto px-4">
        <p class="text-sm text-slate-500">
          Made with ❤️ by BGD Solutions | © {{currentYear}} All Rights Reserved
        </p>
        <p class="text-xs mt-1 text-slate-500">
          Powered by
          <a
            href="https://jikan.moe/"
            target="_blank"
            class="text-blue-600 hover:text-blue-700"
          >
            Jikan API
          </a>
        </p>
      </div>
    </footer>
  `
})
export class FooterComponent implements OnInit {
  currentYear = new Date().getFullYear();
  showFooter = true;

  ngOnInit() {
    // Check initial position
    this.checkScrollPosition();
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    this.checkScrollPosition();
  }

  private checkScrollPosition() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    // Show footer only when we're near the bottom (within 20px)
    this.showFooter = (windowHeight + scrollTop >= documentHeight - 20);
  }
}


/*

import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <!-- <footer class="fixed bottom-0 left-0 w-full bg-white dark:bg-gradient-to-l dark:from-slate-800 dark:to-slate-900 border-t border-slate-200 dark:border-slate-200/5 py-4 text-center z-10"> -->
    <footer class="pt-6 text-center border-t border-slate-200 dark:border-slate-200/5 mt-8">
      <div class="container mx-auto px-4">
        <p class="text-sm text-slate-500">
          Made with ❤️ by BGD Solutions | © {{currentYear}} All Rights Reserved
        </p>
        <p class="text-xs mt-1 text-slate-500">
          Many thanks to
          <a
            href="https://jikan.moe/"
            target="_blank"
            class="text-blue-600 hover:text-blue-700"
          >
            Jikan API
          </a>
          for providing the data
        </p>
      </div>
    </footer>
  `
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}


*/
