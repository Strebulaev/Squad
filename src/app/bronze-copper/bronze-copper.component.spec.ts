import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BronzeCopperComponent } from './bronze-copper.component';

describe('BronzeCopperComponent', () => {
  let component: BronzeCopperComponent;
  let fixture: ComponentFixture<BronzeCopperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BronzeCopperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BronzeCopperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
