import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ClockConfig, ClockState, ClockStatus } from '../models/clock.model';
import { state } from '@angular/animations';

@Injectable({
  providedIn: 'root',
})
export class ClockService {
  private clockConfig: ClockConfig = {
    focusTime: 0.2 * 60,
    restTime: 0.1 * 60,
  };
  private clockState: BehaviorSubject<ClockState> =
    new BehaviorSubject<ClockState>({
      status: ClockStatus.Stopped,
      remainingTime: this.clockConfig.focusTime,
    });

  private timer: any;

  constructor() {}

  getClockConfig() {
    return this.clockConfig;
  }

  getClockState() {
    return this.clockState.getValue();
  }

  getClockState$() {
    return this.clockState.asObservable();
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
