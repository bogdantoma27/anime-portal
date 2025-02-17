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
  },
  {
    path: "top/anime",
    loadComponent: () =>
      import("./features/anime/components/top-anime/top-anime.component").then(
        (m) => m.TopAnimeComponent
      ),
  },
  {
    path: "top/movies",
    loadComponent: () =>
      import(
        "./features/anime/components/top-movies/top-movies.component"
      ).then((m) => m.TopMoviesComponent),
  },
  {
    path: "top/airing",
    loadComponent: () =>
      import(
        "./features/anime/components/top-airing/top-airing.component"
      ).then((m) => m.TopAiringComponent),
  },
  {
    path: "top/upcoming",
    loadComponent: () =>
      import(
        "./features/anime/components/top-upcoming/top-upcoming.component"
      ).then((m) => m.TopUpcomingComponent),
  },
  {
    path: "top/favorite",
    loadComponent: () =>
      import(
        "./features/anime/components/top-favorite/top-favorite.component"
      ).then((m) => m.TopFavoriteComponent),
  },
  {
    path: "top/popular",
    loadComponent: () =>
      import(
        "./features/anime/components/top-popular/top-popular.component"
      ).then((m) => m.TopPopularComponent),
  },
  {
    path: "anime/:id",
    loadComponent: () =>
      import(
        "./features/anime/components/anime-details/anime-details.component"
      ).then((m) => m.AnimeDetailsComponent),
  },
];
