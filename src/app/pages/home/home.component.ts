import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  notificationEnabled: boolean = true;
  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationEnabled = this.notificationService.isNotificationEnabled();
  }

  toggleNotification() {
    this.notificationEnabled = !this.notificationEnabled;
    this.notificationService.enableNotification(this.notificationEnabled);
  }
}
