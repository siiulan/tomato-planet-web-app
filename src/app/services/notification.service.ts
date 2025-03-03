import { Injectable } from '@angular/core';
import { ClockService } from './clock.service';
import { ClockStatus } from '../models/clock.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly STORAGE_KEY = 'enableNotification';
  private audioFocus = new Audio('assets/sound/notifications/focus-1.wav');
  private audioRest = new Audio('assets/sound/notifications/rest-1.wav');
  private curState: ClockStatus = ClockStatus.Stopped;
  private enabled = this.loadNotificationEnableConfig();

  constructor(private clockService: ClockService) {}

  // Load config from local storage (fallback to default values)
  private loadNotificationEnableConfig(): boolean {
    const storedConfig = localStorage.getItem(this.STORAGE_KEY);
    if (storedConfig) {
      return JSON.parse(storedConfig);
    }
    return true;
  }

  // Save config to local storage
  private saveClockConfig() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.enabled));
  }

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

  isNotificationEnabled() {
    return this.enabled;
  }

  enableNotification(enabled: boolean) {
    this.enabled = enabled;
    this.saveClockConfig();
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
