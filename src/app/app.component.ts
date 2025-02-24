import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "./features/layout/header/header.component";
import { FooterComponent } from "./features/layout/footer/footer.component";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <!-- Header -->
    <app-header />

    <main class="px-4 sm:px-6 pt-20 sm:pt-28 pb-[6rem] min-h-screen">
      <router-outlet />
    </main>

    <!-- Footer -->
    <app-footer />
  `,
  styles: [],
})
export class AppComponent {}
