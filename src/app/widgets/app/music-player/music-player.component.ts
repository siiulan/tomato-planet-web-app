import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  AudioPlayerService,
  DEFAULT_EMPTY_TRACK,
  PlayerState,
  Track,
} from '../../../services/audio-player.service';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AddMusicDialogComponent } from '../../../pages/dialog/add-music-dialog/add-music-dialog.component';

@Component({
  selector: 'music-player',
  templateUrl: './music-player.component.html',
  styleUrl: './music-player.component.scss',
})
export class MusicPlayerComponent implements OnInit, OnDestroy {
  playerState: PlayerState = {
    videoId: null,
    isPlaying: false,
    duration: 0,
    currentTime: 0,
    progress: 0,
    volume: 100,
  };
  readonly dialog = inject(MatDialog);
  currentTrack: Track = DEFAULT_EMPTY_TRACK;
  playlist: Track[] = [];

  private subscriptions: Subscription[] = [];

  constructor(private playerService: AudioPlayerService) {}

  ngOnInit(): void {
    // Subscribe to player state changes
    this.subscriptions.push(
      this.playerService.playerState$.subscribe((state) => {
        this.playerState = state;
      })
    );

    // Subscribe to current track changes
    this.subscriptions.push(
      this.playerService.currentTrack$.subscribe((track) => {
        this.currentTrack = track;
        console.log(this.currentTrack);
      })
    );

    // Load the initial playlist
    this.playlist = this.playerService.getPlaylist();
  }

  addTrack(event: Event): void {
    const dialogRef = this.dialog.open(AddMusicDialogComponent, {
      width: '50%',
    });

    // Listen for the dialog close event
    dialogRef.afterClosed().subscribe((newTrack) => {
      if (newTrack) {
        this.playlist = this.playerService.getPlaylist();
      }
    });
  }

  playTrack(track: Track): void {
    if (this.currentTrack.id) {
      this.playerService.selectTrack(track);
      this.playerService.play();
    }
  }

  togglePlayPause(): void {
    if (this.playerState.isPlaying) {
      this.playerService.pause();
    } else {
      this.playerService.play();
    }
  }

  playNext(): void {
    if (this.currentTrack.id) this.playerService.playNext();
  }

  playPrevious(): void {
    if (this.currentTrack.id) this.playerService.playPrevious();
  }

  seek(event: any): void {
    const seekPercentage = event.target.value;
    this.playerService.seekToPercent(seekPercentage);
  }

  setVolume(event: any): void {
    const volume = event.target.value;
    this.playerService.setVolume(volume);
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  removeTrack(track: Track, event: Event): void {
    event.stopPropagation(); // Prevent triggering play event
    this.playlist = this.playlist.filter((t) => t.id !== track.id);
    this.playerService.removeTrackFromPlaylist(track);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
