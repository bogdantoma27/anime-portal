import { Component, inject } from '@angular/core';
import { RecommendationService } from '../../service/recommendation.service';

@Component({
  selector: 'app-recommendation',
  imports: [],
  templateUrl: './recommendation.component.html',
  styleUrl: './recommendation.component.scss'
})
export class RecommendationComponent {
  recommendations: any[] = [];

  private recommendationService: RecommendationService = inject(RecommendationService);

  fetchAnimeRecommendations() {
    this.recommendationService.getRecentAnimeRecommendations().subscribe((res) => {
      this.recommendations = res.data;
    });
  }
}
