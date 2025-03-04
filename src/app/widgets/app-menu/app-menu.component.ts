import { Component } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './app-menu.component.html',
  styleUrl: './app-menu.component.scss',
})
export class AppMenuComponent {
  apps = ['Theme', 'Music'];
  selectedApp: string = this.apps[0];

  constructor() {}

  ngOnInit(): void {}

  selectApp(app: string): void {
    this.selectedApp = app;
    console.log(this.selectedApp);
  }
}
