import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat',
})
export class TimeFormatPipe implements PipeTransform {
  transform(value: number): string {
    if (value < 0 || isNaN(value)) {
      return '00:00'; // Handle invalid input
    }

    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    const seconds = value % 60;

    if (hours > 0) {
      return `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(
        seconds
      )}`;
    } else {
      return `${this.padZero(minutes)}:${this.padZero(seconds)}`;
    }
  }

  private padZero(num: number): string {
    return num.toString().padStart(2, '0');
  }
}
