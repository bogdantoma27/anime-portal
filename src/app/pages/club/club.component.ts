import { Component, inject } from '@angular/core';
import { ClubService } from '../../service/club.service';

@Component({
  selector: 'app-club',
  imports: [],
  templateUrl: './club.component.html',
  styleUrl: './club.component.scss',
})
export class ClubComponent {
  club: any;

  private clubService: ClubService = inject(ClubService);

  fetchClub() {
    this.clubService.getClubById(1).subscribe((res) => {
      this.club = res.data;
    });
  }
}
