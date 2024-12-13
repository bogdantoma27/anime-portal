import { Routes } from '@angular/router';
import { AnimeComponent } from './pages/anime/anime.component';
import { SeasonComponent } from './pages/season/season.component';
import { MangaComponent } from './pages/manga/manga.component';
import { ReviewComponent } from './pages/review/review.component';
import { UserComponent } from './pages/user/user.component';
import { HomeComponent } from './components/home/home.component';
import { AnimeDetailsComponent } from './pages/anime-details/anime-details.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'anime', component: AnimeComponent },
  { path: 'anime/:id', component: AnimeDetailsComponent },
  { path: 'manga', component: MangaComponent },
  { path: 'season', component: SeasonComponent },
  { path: 'user', component: UserComponent },
  { path: 'review', component: ReviewComponent },
];
