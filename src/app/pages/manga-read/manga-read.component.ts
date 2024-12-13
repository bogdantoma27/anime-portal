import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-manga-read',
  imports: [MatProgressSpinnerModule, MatButtonModule, MatCardModule, MatIconModule
  ],
  templateUrl: './manga-read.component.html',
  styleUrls: ['./manga-read.component.scss'],
})
export class MangaReadComponent implements OnInit {
  mangaId: string;
  chapterId: string = ''; // Current chapter ID
  chapterData: any = null;
  baseUrl: string = '';
  images: string[] = [];
  chapters: any[] = []; // List of all chapters
  currentChapterIndex: number = 0; // Current chapter index in the list
  isImagesLoaded = false;
  mangaTitle: string = ''; // Title of the manga, passed from the manga-search component

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.mangaId = this.route.snapshot.paramMap.get('id')!;
    this.fetchChapterFeed(this.mangaId);
    this.mangaTitle = this.route.snapshot.queryParamMap.get('title')!; // Capture manga title passed during routing
    console.log(this.mangaTitle)
  }

  fetchChapterFeed(mangaId: string): void {
    this.http
      .get<any>(`https://api.mangadex.org/manga/${mangaId}/feed`)
      .subscribe((response) => {
        if (response.result === 'ok' && response.data.length > 0) {
          this.mangaTitle = response.data[0].attributes.title;
          // Filter the chapters to only include those with translatedLanguage "en"
          this.chapters = response.data.filter((chapter) =>
            chapter.attributes.translatedLanguage === 'en'
          );

          // If there are any English chapters, load the first one
          if (this.chapters.length > 0) {
            this.loadChapterData(this.chapters[this.currentChapterIndex].id); // Load first chapter
          } else {
            console.error('No English chapters available.');
          }
        }
      });
  }

  loadChapterData(chapterId: string): void {
    this.isImagesLoaded = false;
    this.http
      .get<any>(`https://api.mangadex.org/at-home/server/${chapterId}`)
      .subscribe((response) => {
        if (response.result === 'ok' && response.chapter) {
          this.baseUrl = response.baseUrl;
          this.chapterData = response.chapter;

          // Generate image URLs
          const chapterHash = this.chapterData.hash;
          const imagePaths = this.chapterData.data;
          this.images = imagePaths.map(
            (imagePath) => `${this.baseUrl}/data/${chapterHash}/${imagePath}`
          );

          // Wait for all images to load before displaying
          const imageLoadPromises = this.images.map((src) =>
            this.loadImage(src)
          );
          Promise.all(imageLoadPromises).then(() => {
            this.isImagesLoaded = true;
            this.scrollToTop(); // Scroll to top after images are loaded
          });
        } else {
          console.error('Failed to load chapter data');
        }
      });
  }

  loadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = src;
    });
  }

  navigateChapter(direction: 'next' | 'previous'): void {
    const newIndex =
      direction === 'next'
        ? this.currentChapterIndex + 1
        : this.currentChapterIndex - 1;

    if (newIndex >= 0 && newIndex < this.chapters.length) {
      this.currentChapterIndex = newIndex;
      this.loadChapterData(this.chapters[this.currentChapterIndex].id); // Load the new chapter
    }
  }

  hasNextChapter(): boolean {
    return this.currentChapterIndex < this.chapters.length - 1;
  }

  hasPreviousChapter(): boolean {
    return this.currentChapterIndex > 0;
  }

  // Navigate back to the search page
  navigateBackToSearch(): void {
    this.router.navigate(['/manga-read']);
  }

  scrollToTop(): void {
    this.renderer.setProperty(document.body, 'scrollTop', 0);
    this.renderer.setProperty(document.documentElement, 'scrollTop', 0);
  }
}
