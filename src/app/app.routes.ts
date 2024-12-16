import { Routes } from '@angular/router';
import { AnimeComponent } from './pages/anime/anime.component';
import { SeasonComponent } from './pages/season/season.component';
import { MangaComponent } from './pages/manga/manga.component';
import { ReviewComponent } from './pages/review/review.component';
import { UserComponent } from './pages/user/user.component';
import { HomeComponent } from './components/home/home.component';
import { AnimeDetailsComponent } from './pages/anime-details/anime-details.component';
import { MangaReadComponent } from './pages/manga-read/manga-read.component';
import { MangaSearchComponent } from './pages/manga-search/manga-search.component';
import { UpcomingAnimeComponent } from './pages/upcoming-anime/upcoming-anime.component';
import { TopAnimeComponent } from './pages/top-anime/top-anime.component';
import { TopMangaComponent } from './pages/top-manga/top-manga.component';
import { MangaDetailsComponent } from './pages/manga-details/manga-details.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'anime', component: AnimeComponent },
  { path: 'anime/:id', component: AnimeDetailsComponent },
  { path: 'upcoming-anime', component: UpcomingAnimeComponent },
  { path: 'top-anime', component: TopAnimeComponent },
  { path: 'manga', component: MangaComponent },
  { path: 'manga/:id', component: MangaDetailsComponent },
  { path: 'manga-read', component: MangaSearchComponent },
  { path: 'manga-read/:id', component: MangaReadComponent },
  { path: 'top-manga', component: TopMangaComponent },
  { path: 'season', component: SeasonComponent },
  { path: 'user', component: UserComponent },
  { path: 'review', component: ReviewComponent },
];
