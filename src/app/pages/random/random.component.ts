import { Component, inject } from '@angular/core';
import { RandomService } from '../../service/random.service';

@Component({
  selector: 'app-random',
  imports: [],
  templateUrl: './random.component.html',
  styleUrl: './random.component.scss'
})
export class RandomComponent {
  randomAnime: any;

  private randomService: RandomService = inject(RandomService);

  fetchRandomAnime() {
    this.randomService.getRandomAnime().subscribe((res) => {
      this.randomAnime = res.data;
    });
  }
}
