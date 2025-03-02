import { Injectable } from '@angular/core';
import { ClockService } from './clock.service';
import { ClockStatus } from '../models/clock.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private audioFocus = new Audio('assets/sound/notifications/focus-1.wav');
  private audioRest = new Audio('assets/sound/notifications/rest-1.wav');
  private curState: ClockStatus = ClockStatus.Stopped;

  constructor(private clockService: ClockService) {
    this.subscribeToClockChanges();
  }

  private subscribeToClockChanges() {
    this.clockService.getClockState$().subscribe((state) => {
      switch (this.curState) {
        case ClockStatus.Started:
          if (state.status === ClockStatus.Resting) {
            this.playRestNotification();
          }
          break;
        case ClockStatus.Resting:
          if (state.status === ClockStatus.Started) {
            this.playFocusNotification();
          }
          break;
      }
      this.curState = state.status;
    });
  }

  private playRestNotification() {
    this.audioRest
      .play()
      .catch((err) => console.error('Error playing rest sound:', err));
  }

  private playFocusNotification() {
    this.audioFocus
      .play()
      .catch((err) => console.error('Error playing focus sound:', err));
  }
}
