import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME_KEY = 'theme';
  private defaultTheme: string = 'light-theme';

  constructor() {
    this.applyStoredTheme(); // Apply the theme immediately on service creation
  }

  setTheme(themeName: string) {
    document.documentElement.classList.remove('light-theme', 'dark-theme'); // Remove old theme
    document.documentElement.classList.add(themeName);
    localStorage.setItem(this.THEME_KEY, themeName);
    console.log(document.documentElement.classList);
  }

  getTheme(): string {
    console.log(localStorage.getItem(this.THEME_KEY));
    return localStorage.getItem(this.THEME_KEY) || this.defaultTheme;
  }

  applyStoredTheme() {
    const savedTheme = this.getTheme();
    this.setTheme(savedTheme);
  }
}
