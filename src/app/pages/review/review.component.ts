import { Component, inject } from '@angular/core';
import { ReviewService } from '../../service/review.service';

@Component({
  selector: 'app-review',
  imports: [],
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss'
})
export class ReviewComponent {
  reviews: any[] = [];

  private reviewService: ReviewService = inject(ReviewService);

  fetchAnimeReviews() {
    this.reviewService.getAnimeReviews(1).subscribe((res) => {
      this.reviews = res.data;
    });
  }
}
