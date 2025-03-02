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
  private enabled = true;

  constructor(private clockService: ClockService) {}

  start() {
    this.clockService.getClockState$().subscribe((state) => {
      if (this.enabled) {
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
      }
      this.curState = state.status;
    });
  }

  setNotification(enabled: true) {
    this.enabled = enabled;
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
