import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ClockConfig, ClockState, ClockStatus } from '../models/clock.model';
import { state } from '@angular/animations';

@Injectable({
  providedIn: 'root',
})
export class ClockService {
  private readonly STORAGE_KEY = 'clockConfig';
  private clockConfig: ClockConfig = this.loadClockConfig();
  private clockState: BehaviorSubject<ClockState> =
    new BehaviorSubject<ClockState>({
      status: ClockStatus.Stopped,
      remainingTime: this.clockConfig.focusTime,
    });

  private timer: any;

  constructor() {}

  // Load config from local storage (fallback to default values)
  private loadClockConfig(): ClockConfig {
    const storedConfig = localStorage.getItem(this.STORAGE_KEY);
    if (storedConfig) {
      return JSON.parse(storedConfig);
    }
    return {
      focusTime: 25 * 60,
      restTime: 5 * 60,
    };
  }

  // Save config to local storage
  private saveClockConfig() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.clockConfig));
  }

  getClockConfig() {
    return this.clockConfig;
  }

  getClockState() {
    return this.clockState.getValue();
  }

  getClockState$() {
    return this.clockState.asObservable();
  }

  setClockConfig(clockConfig: ClockConfig) {
    const curState = this.getClockState();
    if (curState.status === ClockStatus.Stopped) {
      this.clockConfig = clockConfig;
      this.saveClockConfig();
      this.setClockState({
        ...curState,
        remainingTime: this.clockConfig.focusTime,
      });
    } else {
      console.error('[ERROR] Setting Clock Config during clock running');
    }
  }

  setClockState(state: ClockState) {
    this.clockState.next(state);
  }

  private startTimer() {
    this.timer = setInterval(() => {
      const state = this.getClockState();
      if (state.remainingTime > 0) {
        const remainingTime = state.remainingTime - 1;
        this.setClockState({ ...state, remainingTime });
      } else {
        if (state.status === ClockStatus.Resting) {
          this.startFocus();
        } else {
          this.startRest();
        }
      }
    }, 1000);
  }

  startFocus() {
    clearInterval(this.timer);
    if (this.getClockState().status !== ClockStatus.Started) {
      const initilStartState: ClockState = {
        status: ClockStatus.Started,
        remainingTime: this.clockConfig.focusTime,
      };
      this.setClockState(initilStartState);
      this.startTimer();
    }
  }

  startRest() {
    clearInterval(this.timer);
    this.setClockState({
      status: ClockStatus.Resting,
      remainingTime: this.clockConfig.restTime,
    });
    this.startTimer();
  }

  StopClock() {
    clearInterval(this.timer);
    this.setClockState({
      status: ClockStatus.Stopped,
      remainingTime: this.clockConfig.focusTime,
    });
  }

  PauseClock() {
    clearInterval(this.timer);
    const state = this.getClockState();
    if (state.status === ClockStatus.Started) {
      this.setClockState({ ...state, status: ClockStatus.Paused });
    }
  }

  ResumeClock() {
    const state = this.getClockState();
    if (state.status === ClockStatus.Paused) {
      this.setClockState({ ...state, status: ClockStatus.Started });
      this.startTimer();
    }
  }
}
