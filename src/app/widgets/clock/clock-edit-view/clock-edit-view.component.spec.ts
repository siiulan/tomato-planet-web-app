import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClockEditViewComponent } from './clock-edit-view.component';

describe('ClockEditViewComponent', () => {
  let component: ClockEditViewComponent;
  let fixture: ComponentFixture<ClockEditViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClockEditViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClockEditViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
