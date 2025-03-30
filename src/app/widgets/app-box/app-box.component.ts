import { Component } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-box',
  templateUrl: './app-box.component.html',
  styleUrl: './app-box.component.scss',
  animations: [
    trigger('listAnimation', [
      // Define the "void => *" transition
      // This handles the entering animation (when element is added to DOM)
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'scale(0.95)',
        }),
        animate(
          '300ms ease-out',
          style({
            opacity: 1,
            transform: 'scale(1)',
          })
        ),
      ]),
      // Define the "* => void" transition
      // This handles the leaving animation (when element is removed from DOM)
      transition(':leave', [
        style({
          opacity: 1,
          transform: 'scale(1)',
        }),
        animate(
          '250ms ease-in',
          style({
            opacity: 0,
            transform: 'scale(0.95)',
          })
        ),
      ]),
    ]),
  ],
})
export class AppBoxComponent {
  displayAppList: boolean = false;
  displayButton: boolean = true;

  toggleAppList() {
    this.displayAppList = !this.displayAppList;
    this.displayButton = false;
  }

  onMenuClose($event: boolean) {
    this.displayAppList = $event;
    setTimeout(() => {
      this.displayButton = true;
    }, 300); // async display to match animation
  }
}
