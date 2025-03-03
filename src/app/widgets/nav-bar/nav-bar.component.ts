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

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent {
  readonly dialog = inject(MatDialog);

  openDialog(): void {
    this.dialog.open(InfoDialogComponent, {
      width: '50%',
    });
  }
}
