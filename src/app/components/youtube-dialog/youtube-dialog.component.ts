import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { YouTubePlayerModule } from '@angular/youtube-player';

@Component({
  selector: 'app-youtube-dialog',
  imports: [YouTubePlayerModule, MatDialogModule, MatButtonModule],
  templateUrl: './youtube-dialog.component.html',
  styleUrl: './youtube-dialog.component.scss',
})
export class YoutubeDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  playerHeight: number = 315; // Default height for desktop
  playerWidth: number = 570; // Default width for desktop
  @ViewChild('youtubePlayer', { static: false, read: ElementRef })
  youtubePlayer!: ElementRef;

  // Adjust player size based on screen size
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.adjustPlayerSize();
  }

  ngOnInit(): void {
    this.adjustPlayerSize();
  }

  adjustPlayerSize(): void {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    if (screenWidth <= 600) {
      // Mobile
      this.playerWidth = screenWidth - 80; // Adjust for padding
      this.playerHeight = this.playerWidth * 0.8625; // 16:9 aspect ratio
    } else if (screenWidth <= 1024) {
      // Tablet
      this.playerWidth = screenWidth - 430; // Adjust for padding
      this.playerHeight = this.playerWidth * 0.5425; // 16:9 aspect ratio
    } else {
      // Desktop
      this.playerWidth = 560;
      this.playerHeight = 315;
    }
  }
}
