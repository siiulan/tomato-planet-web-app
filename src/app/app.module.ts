import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './pages/home/home.component';
import { NavBarComponent } from './widgets/nav-bar/nav-bar.component';
import { ClockComponent } from './widgets/clock/clock.component';
import { TimeFormatPipe } from './pipes/time-format.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClockEditViewComponent } from './widgets/clock/clock-edit-view/clock-edit-view.component';
import { ReactiveFormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { InfoDialogComponent } from './pages/dialog/info-dialog/info-dialog.component';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { AppBoxComponent } from './widgets/app-box/app-box.component';
import { AppMenuComponent } from './widgets/app-menu/app-menu.component';
import { ThemeComponent } from './widgets/app/theme/theme.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavBarComponent,
    ClockComponent,
    TimeFormatPipe,
    ClockEditViewComponent,
    InfoDialogComponent,
    AppBoxComponent,
    AppMenuComponent,
    ThemeComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
  ],
  providers: [provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule {}
