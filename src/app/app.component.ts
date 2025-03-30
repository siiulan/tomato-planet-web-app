import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ThemeService } from './services/theme.service';
import { Theme } from './models/theme.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  currentTheme: Theme | undefined = undefined;
  backgroundType: 'color' | 'video' | 'image' = 'color';
  backgroundValue: string = ''; // Stores color, video URL, or image URL
  videoKey: number = 0; // Add a key to force video recreation
  private subscription = new Subscription();

  @ViewChild('bgVideo') bgVideo!: ElementRef<HTMLVideoElement>;

  constructor(
    private themeService: ThemeService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.themeService.theme$.subscribe((theme) => {
        this.currentTheme = theme;

        // Force video recreation by incrementing key when video theme changes
        if (
          theme.background.type === 'video' &&
          this.backgroundType === 'video' &&
          this.backgroundValue !== theme.background.path
        ) {
          this.videoKey++;
        }

        this.applyBackground(theme);
        this.cdRef.detectChanges();

        // Handle video playback after change detection
        setTimeout(() => {
          if (this.bgVideo && this.backgroundType === 'video') {
            this.bgVideo.nativeElement.muted = true;
            this.bgVideo.nativeElement.load(); // Force reload of video

            try {
              this.bgVideo.nativeElement.play();
            } catch (error) {
              console.error('Video play error:', error);
            }
          }
        }, 0);
      })
    );
  }

  applyBackground(theme: Theme) {
    const body = document.body;

    if (theme.background.type === 'video' && theme.background.path) {
      this.backgroundType = 'video';
      this.backgroundValue = theme.background.path;
      body.style.backgroundColor = 'transparent'; // Remove body background for video
    } else if (theme.background.type === 'image' && theme.background.path) {
      this.backgroundType = 'image';
      this.backgroundValue = theme.background.path;
      body.style.backgroundColor = 'transparent'; // Remove body background for image
    } else {
      this.backgroundType = 'color';
      this.backgroundValue = theme.background.color || '#ffffff'; // Default color
      body.style.backgroundColor = this.backgroundValue; // Apply color directly
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
