import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DubStepComponent } from './dub-step.component';

describe('DubStepComponent', () => {
  let component: DubStepComponent;
  let fixture: ComponentFixture<DubStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DubStepComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DubStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
