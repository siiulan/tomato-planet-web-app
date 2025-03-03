import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClockConfig } from '../../../models/clock.model';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'clock-edit-view',
  templateUrl: './clock-edit-view.component.html',
  styleUrls: ['./clock-edit-view.component.scss'],
})
export class ClockEditViewComponent {
  @Input() clockConfig: ClockConfig = { focusTime: 25, restTime: 5 };
  @Output() closeEdit = new EventEmitter<ClockConfig>();
  clockForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Initialize the form with minutes
    this.clockForm = this.fb.group({
      focusTime: [
        this.clockConfig.focusTime / 60, // Convert seconds to minutes
        [Validators.required, Validators.min(1)],
      ],
      restTime: [
        this.clockConfig.restTime / 60, // Convert seconds to minutes
        [Validators.required, Validators.min(1)],
      ],
    });
  }

  finishEdit(): void {
    if (this.clockForm.valid) {
      const updatedConfig: ClockConfig = {
        focusTime: this.clockForm.value.focusTime * 60, // Convert minutes to seconds
        restTime: this.clockForm.value.restTime * 60, // Convert minutes to seconds
      };
      this.closeEdit.emit(updatedConfig);
    }
  }
  cancelEdit() {
    this.closeEdit.emit();
  }
}
