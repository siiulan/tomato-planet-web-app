import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ClockService } from './clock.service';
import { ClockState, ClockStatus } from '../models/clock.model';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TabTitleService {
  private clockSubscription!: Subscription;

  constructor(
    private titleService: Title,
    private clockService: ClockService
  ) {}

  start() {
    this.clockSubscription = this.clockService
      .getClockState$()
      .subscribe((state) => {
        this.updateTitle(state);
      });
  }

  stopListening() {
    if (this.clockSubscription) {
      this.clockSubscription.unsubscribe();
    }
  }

  private updateTitle(clockState: ClockState) {
    let newTitle = 'Tomato Planet'; // Default title

    switch (clockState.status) {
      case ClockStatus.Started:
        newTitle = `[Focus]: ${this.formatTime(clockState.remainingTime)}`;
        break;
      case ClockStatus.Resting:
        newTitle = `[Rest]: ${this.formatTime(clockState.remainingTime)}`;
        break;
      case ClockStatus.Paused:
        newTitle = `⏸️ Paused`;
        break;
      // case ClockStatus.Stopped:
      //   newTitle = `⏹️ Stopped`;
      //   break;
    }

    this.titleService.setTitle(newTitle);
  }

  private formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }
}
