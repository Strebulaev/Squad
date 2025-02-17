import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VikushaComponent } from './vikusha.component';

describe('VikushaComponent', () => {
  let component: VikushaComponent;
  let fixture: ComponentFixture<VikushaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VikushaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VikushaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
