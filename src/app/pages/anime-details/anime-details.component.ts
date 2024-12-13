import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { forkJoin } from 'rxjs';
import { ToasterService } from '../../shared/service/toaster.service';

@Component({
  selector: 'app-anime-details',
  imports: [CommonModule, MatDividerModule, MatExpansionModule, MatProgressSpinnerModule, MatChipsModule],
  templateUrl: './anime-details.component.html',
  styleUrl: './anime-details.component.scss',
})
export class AnimeDetailsComponent {
  private apiService = inject(ApiService);
  private route = inject(ActivatedRoute);

  anime: any = null;  // Holds anime data after API response
  isLoading = true;  // Track loading state

  constructor() {}

  ngOnInit() {
    const animeId = this.route.snapshot.paramMap.get('id');
    forkJoin([
      this.apiService.get<any>(`/anime/${animeId}`),
      this.apiService.get<any>(`/anime/${animeId}/characters`),
      this.apiService.get<any>(`/anime/${animeId}/staff`),
      this.apiService.get<any>(`/anime/${animeId}/themes`),
      this.apiService.get<any>(`/anime/${animeId}/relations`),
      this.apiService.get<any>(`/anime/${animeId}/recommendations`),
      this.apiService.get<any>(`/anime/${animeId}/reviews`),
    ]).subscribe(
      ([animeData, characterData, staffData, themeData, relationData, recommendationData, reviewData]) => {
        this.anime = animeData.data;
        this.anime.characters = characterData.data.map((char) => ({
          name: char.character.name,
          image: char.character.images.jpg.image_url,
          role: char.role,
          voice_actors: char.voice_actors.map((va) => ({
            language: va.language,
            person: va.person.name,
          })),
        }));
        this.anime.staff = staffData.data;
        this.anime.opening_theme = themeData.data.openings;
        this.anime.ending_theme = themeData.data.endings;
        this.anime.relations = relationData.data;
        this.anime.recommendations = recommendationData.data;
        this.anime.reviews = reviewData.data;
        this.isLoading = false;
      }
    );
  }

  getFormattedGenres(): string {
    return this.anime?.genres?.map((g: any) => g.name).join(', ') || 'N/A';
  }

  getFormattedStudios(): string {
    return this.anime?.studios?.map((s: any) => s.name).join(', ') || 'N/A';
  }

  getFormattedProducers(): string {
    return this.anime?.producers?.map((p: any) => p.name).join(', ') || 'N/A';
  }

  getFormattedLicensors(): string {
    return this.anime?.licensors?.map((l: any) => l.name).join(', ') || 'N/A';
  }

  getFormattedStreaming(): string {
    return this.anime?.streaming?.map((s: any) => s.service).join(', ') || 'N/A';
  }
}
