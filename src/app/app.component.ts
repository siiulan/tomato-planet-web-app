import { Component } from '@angular/core';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  themes = ['light-theme', 'dark-theme'];
  currentTheme: string = this.themes[0];

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.currentTheme = this.themeService.getTheme();
    this.themeService.applyStoredTheme();
  }

  switchTheme(theme: string) {
    this.currentTheme = theme;
    this.themeService.setTheme(theme);
  }
}
