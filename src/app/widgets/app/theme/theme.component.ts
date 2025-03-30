import { Component, OnDestroy, OnInit } from '@angular/core';
import { Theme } from '../../../models/theme.model';
import { ThemeService } from '../../../services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-theme',
  templateUrl: './theme.component.html',
  styleUrl: './theme.component.scss',
})
export class ThemeComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  themes: Theme[] = [];
  currentTheme: Theme | undefined = undefined;

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.themes = this.themeService.getThemes();
    this.subscription.add(
      this.themeService.theme$.subscribe((theme) => {
        this.currentTheme = theme;
      })
    );
  }

  selectTheme(theme: Theme) {
    this.themeService.setTheme(theme);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
