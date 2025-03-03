import { Component } from '@angular/core';
import { APP_VERSION, RELEASE_DATE } from '../../../../version';

@Component({
  selector: 'info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrl: './info-dialog.component.scss',
})
export class InfoDialogComponent {
  version = APP_VERSION;
  releaseDate = RELEASE_DATE;
}
