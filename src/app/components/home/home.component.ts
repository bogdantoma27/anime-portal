import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpcomingAnimeComponent } from "../../pages/upcoming-anime/upcoming-anime.component";
import { TopAnimeComponent } from "../../pages/top-anime/top-anime.component";
import { MatCardModule } from '@angular/material/card';
import { TopMangaComponent } from "../../pages/top-manga/top-manga.component";


@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    UpcomingAnimeComponent,
    TopAnimeComponent,
    MatCardModule,
    TopMangaComponent
],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
