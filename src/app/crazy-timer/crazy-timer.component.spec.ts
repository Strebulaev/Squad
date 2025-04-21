import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrazyTimerComponent } from './crazy-timer.component';


describe('CrazyTimerComponent', () => {
  let component: CrazyTimerComponent;
  let fixture: ComponentFixture<CrazyTimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrazyTimerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrazyTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
