import { Component } from '@angular/core';
import { AudioPlayerService } from '../../../services/audio-player.service';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-music-dialog',
  templateUrl: './add-music-dialog.component.html',
  styleUrl: './add-music-dialog.component.scss',
})
export class AddMusicDialogComponent {
  urlControl = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/),
  ]);

  constructor(
    private playerService: AudioPlayerService,
    private dialogRef: MatDialogRef<AddMusicDialogComponent>
  ) {}

  addTrack(event: Event): void {
    if (this.urlControl.invalid) {
      return;
    }
    const url = this.urlControl.value as string;
    const newTrack = this.playerService.addTrack(url);

    // Close the dialog and return the new track
    this.urlControl.reset();
    this.dialogRef.close(newTrack);
  }
}
