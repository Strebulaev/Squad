import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SergeyComponent } from './sergey.component';

describe('SergeyComponent', () => {
  let component: SergeyComponent;
  let fixture: ComponentFixture<SergeyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SergeyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SergeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
