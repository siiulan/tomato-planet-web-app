import { Injectable } from '@angular/core';
import { Theme } from '../models/theme.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME_KEY = 'theme';
  private themes: Theme[] = [
    {
      name: 'Minimalist',
      previewImgPath: 'assets/themes/preview/Minimalist-preview.svg',
      logoImgPath: 'assets/icons/light-logo.svg',
      styleSheet: 'light-theme',
      background: {
        type: 'color',
        color: 'linear-gradient(45deg,rgb(180, 180, 180),rgb(236, 236, 236))',
      },
    },
    {
      name: 'Illume',
      previewImgPath: 'assets/themes/preview/Illume-preview.svg',
      logoImgPath: 'assets/icons/light-logo.svg',
      styleSheet: 'light-theme',
      background: {
        type: 'video',
        path: 'assets/videos/gradient-background.mp4',
      },
    },
    {
      name: 'Black Mabma',
      previewImgPath: 'assets/themes/preview/Black-Mamba-preview.svg',
      logoImgPath: 'assets/icons/dark-logo.svg',
      styleSheet: 'dark-theme',
      background: {
        type: 'video',
        path: 'assets/videos/black-maba.mp4',
      },
    },
  ];
  private defaultTheme: Theme = this.themes[0];
  private $theme = new BehaviorSubject<Theme>(this.defaultTheme);
  private currentThemeStyleSheet: string | null = null;

  constructor() {
    this.applyStoredTheme(); // Apply the theme immediately on service creation
  }

  getThemes() {
    return this.themes;
  }

  get theme$() {
    return this.$theme.asObservable();
  }

  private removeCurrentThemeStyle(themeName: string) {
    // Remove the current theme stylesheet class if one exists
    if (this.currentThemeStyleSheet) {
      document.documentElement.classList.remove(this.currentThemeStyleSheet);
    }

    // Get all possible theme stylesheet classes to ensure clean removal
    const allThemeStyleSheets = this.themes.map((t) => t.styleSheet);
    allThemeStyleSheets.forEach((styleSheet) => {
      if (styleSheet !== styleSheet) {
        document.documentElement.classList.remove(styleSheet);
      }
    });
  }

  setTheme(theme: Theme) {
    this.removeCurrentThemeStyle(theme.styleSheet);
    // Add the new theme stylesheet class
    document.documentElement.classList.add(theme.styleSheet);

    // Store the current theme stylesheet for future reference
    this.currentThemeStyleSheet = theme.styleSheet;

    // Save to localStorage and update the BehaviorSubject
    localStorage.setItem(this.THEME_KEY, theme.name);
    this.$theme.next(theme);
  }

  getTheme(): Theme {
    const themeName = localStorage.getItem(this.THEME_KEY);
    return themeName
      ? this.themes.find((t) => t.name === themeName) || this.defaultTheme
      : this.defaultTheme;
  }

  applyStoredTheme() {
    const savedTheme = this.getTheme();
    savedTheme && this.setTheme(savedTheme);
  }
}
