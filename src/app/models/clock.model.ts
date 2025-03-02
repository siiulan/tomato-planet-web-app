export enum ClockStatus {
  Started = 'STARTED',
  Paused = 'PAUSED',
  Stopped = 'STOPPED',
  Resting = 'RESTING',
}

export interface ClockState {
  status: ClockStatus;
  remainingTime: number; // seconds
}

export interface ClockConfig {
  focusTime: number; // seconds
  restTime: number; // seconds
}
