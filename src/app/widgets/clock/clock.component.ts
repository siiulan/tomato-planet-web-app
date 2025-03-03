import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ClockService } from '../../services/clock.service';
import { ClockConfig, ClockState, ClockStatus } from '../../models/clock.model';
import {
  trigger,
  transition,
  style,
  animate,
  group,
  query,
  state,
} from '@angular/animations';
import _ from 'lodash';
import { TabTitleService } from '../../services/tab-title.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate(
          '300ms ease-in',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '300ms ease-in',
          style({ opacity: 0, transform: 'translateY(-10px)' })
        ),
      ]),
    ]),
  ],
})
export class ClockComponent implements OnInit, OnDestroy {
  protected clockstate: ClockState = {
    status: ClockStatus.Stopped,
    remainingTime: 0,
  };
  protected clockConfig: ClockConfig = {
    focusTime: 0,
    restTime: 0,
  };
  protected isEditing: boolean = false;
  private clockSubscription!: Subscription;
  private animationFrame: any;
  private lastTimestamp: number = 0;
  private totalTime = this.clockConfig.focusTime;
  protected mode: 'Focus' | 'Break' = 'Focus';

  // Circle Progress properties
  radius: number = 200;
  circumference: number = 2 * Math.PI * this.radius;
  progressOffset: number = 0;
  isAnimating: boolean = false; // Track animation state

  constructor(
    private clockService: ClockService,
    private tabTitleService: TabTitleService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.clockConfig = this.clockService.getClockConfig();
    this.totalTime = this.clockConfig.focusTime;
    this.clockSubscription = this.clockService
      .getClockState$()
      .subscribe((state) => {
        this.tomatoClockLogic(state);
      });
    this.tabTitleService.start();
    this.notificationService.start();
  }

  ngOnDestroy() {
    this.clockSubscription.unsubscribe();
    cancelAnimationFrame(this.animationFrame);
    this.tabTitleService.stopListening(); // Stop when component is destroyed
  }

  private tomatoClockLogic(state: ClockState) {
    const prevState = _.cloneDeep(this.clockstate);
    this.clockstate = state;
    console.log('state update', state, this);
    switch (prevState.status) {
      case ClockStatus.Stopped:
      case ClockStatus.Resting:
        if (this.clockstate.status === ClockStatus.Started) {
          this.mode = 'Focus';
          // this.animateProgress();
        }
        break;
      case ClockStatus.Started:
        if (this.clockstate.status === ClockStatus.Resting) {
          this.mode = 'Break';
        }
        break;
      default:
        break;
    }
  }

  startClock() {
    this.clockService.startFocus();
  }

  pauseClock() {
    this.clockService.PauseClock();
    this.stopAnimation();
  }

  resumeClock() {
    this.clockService.ResumeClock();
    this.resumeAnimation();
  }

  stopClock() {
    this.clockService.StopClock();
    this.stopAnimation();
    this.progressOffset = -this.circumference; // Reset progress ring
  }

  editClock() {
    this.isEditing = true;
  }

  onEditComplete(event?: ClockConfig) {
    if (event) {
      // Update the clock config if user clicked Finish
      this.clockConfig = event ?? this.clockConfig;
      this.totalTime = this.clockConfig.focusTime;
      this.clockService.setClockConfig(this.clockConfig);
    }
    this.isEditing = false;
  }

  protected canDisplayStartButton() {
    return (
      this.clockstate.status === ClockStatus.Paused ||
      this.clockstate.status === ClockStatus.Stopped
    );
  }

  protected canDisplayPauseButton() {
    return (
      this.clockstate.status === ClockStatus.Started ||
      this.clockstate.status === ClockStatus.Resting
    );
  }

  protected isClockRunning() {
    return (
      this.clockstate.status === ClockStatus.Started ||
      this.clockstate.status === ClockStatus.Resting ||
      this.clockstate.status === ClockStatus.Paused
    );
  }

  protected canDisableStopButton() {
    return this.clockstate.status === ClockStatus.Stopped;
  }

  private resumeAnimation() {
    if (!this.isAnimating) {
      this.isAnimating = true;
      this.lastTimestamp = performance.now();
      this.animateProgress();
    }
  }

  private stopAnimation() {
    this.isAnimating = false;
    cancelAnimationFrame(this.animationFrame);
  }

  private animateProgress() {
    if (!this.isAnimating) return;

    const now = performance.now();
    const elapsed = (now - this.lastTimestamp) / 1000; // Convert ms to seconds
    const progress = Math.max(0, 1 - elapsed / this.totalTime);
    if (this.clockstate.remainingTime > 0) {
      this.progressOffset = this.circumference * (progress - 1);
      this.animationFrame = requestAnimationFrame(() => this.animateProgress());
    } else {
      this.stopAnimation();
    }
  }
}
