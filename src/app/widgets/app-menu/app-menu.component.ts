import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './app-menu.component.html',
  styleUrl: './app-menu.component.scss',
})
export class AppMenuComponent {
  apps = ['Theme', 'Music'];
  selectedApp: string = this.apps[0];
  @Output() closeMenu = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit(): void {}

  selectApp(app: string): void {
    this.selectedApp = app;
  }

  closeAppMenu() {
    this.closeMenu.emit(false);
  }
}
