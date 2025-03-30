import { Component, inject } from '@angular/core';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { InfoDialogComponent } from '../../pages/dialog/info-dialog/info-dialog.component';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent {
  readonly dialog = inject(MatDialog);
  private subscription = new Subscription();
  logoPath = '';
  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.subscription.add(
      this.themeService.theme$.subscribe((theme) => {
        this.logoPath = theme.logoImgPath;
      })
    );
  }

  openDialog(): void {
    this.dialog.open(InfoDialogComponent, {
      width: '50%',
    });
  }
}
