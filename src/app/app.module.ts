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
import { AppBoxComponent } from './widgets/app-box/app-box.component';
import { AppMenuComponent } from './widgets/app-menu/app-menu.component';
import { ThemeComponent } from './widgets/app/theme/theme.component';
import { MusicPlayerComponent } from './widgets/app/music-player/music-player.component';
import { AddMusicDialogComponent } from './pages/dialog/add-music-dialog/add-music-dialog.component';
// Angular Material Module
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';

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
    MusicPlayerComponent,
    AddMusicDialogComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    // Angular Material Module
    MatDialogModule,
    MatTooltipModule,
  ],
  providers: [provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule {}
