import { Component } from '@angular/core';
import { ToolbarComponent } from "./components/toolbar/toolbar.component";
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-root',
  imports: [ToolbarComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  ngOnInit() {
    const title = document.title;
    console.log('Page title is:', title);
    const currentLink = window.location.href;
    console.log('Current link is:', currentLink);
  }
}
