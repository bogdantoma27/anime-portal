import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full", // Default route
  },
  {
    path: "home",
    loadComponent: () =>
      import("./features/home/home.component").then((m) => m.HomeComponent),
    // Automatically scroll to the top of the page when navigating to a new route
    data: { scrollPositionRestoration: "top" },
  },
  {
    path: "top/anime",
    loadComponent: () =>
      import("./features/anime/components/top-anime/top-anime.component").then(
        (m) => m.TopAnimeComponent
      ),
    // Automatically scroll to the top of the page when navigating to a new route
    data: { scrollPositionRestoration: "top" },
  },
  {
    path: "top/movies",
    loadComponent: () =>
      import(
        "./features/anime/components/top-movies/top-movies.component"
      ).then((m) => m.TopMoviesComponent),
    // Automatically scroll to the top of the page when navigating to a new route
    data: { scrollPositionRestoration: "top" },
  },
  {
    path: "top/airing",
    loadComponent: () =>
      import(
        "./features/anime/components/top-airing/top-airing.component"
      ).then((m) => m.TopAiringComponent),
    // Automatically scroll to the top of the page when navigating to a new route
    data: { scrollPositionRestoration: "top" },
  },
  {
    path: "top/upcoming",
    loadComponent: () =>
      import(
        "./features/anime/components/top-upcoming/top-upcoming.component"
      ).then((m) => m.TopUpcomingComponent),
    // Automatically scroll to the top of the page when navigating to a new route
    data: { scrollPositionRestoration: "top" },
  },
  {
    path: "top/favorite",
    loadComponent: () =>
      import(
        "./features/anime/components/top-favorite/top-favorite.component"
      ).then((m) => m.TopFavoriteComponent),
    // Automatically scroll to the top of the page when navigating to a new route
    data: { scrollPositionRestoration: "top" },
  },
  {
    path: "top/popular",
    loadComponent: () =>
      import(
        "./features/anime/components/top-popular/top-popular.component"
      ).then((m) => m.TopPopularComponent),
    // Automatically scroll to the top of the page when navigating to a new route
    data: { scrollPositionRestoration: "top" },
  },
  {
    path: "anime/:id",
    loadComponent: () =>
      import(
        "./features/anime/components/anime-details/anime-details.component"
      ).then((m) => m.AnimeDetailsComponent),
    // Automatically scroll to the top of the page when navigating to a new route
    data: { scrollPositionRestoration: "top" },
  },
];
