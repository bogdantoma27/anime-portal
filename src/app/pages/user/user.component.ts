import { Component, inject } from '@angular/core';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-user',
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
  user: any;

  private userService: UserService = inject(UserService);

  fetchUser() {
    this.userService.getUserById('username').subscribe((res) => {
      this.user = res.data;
    });
  }
}
