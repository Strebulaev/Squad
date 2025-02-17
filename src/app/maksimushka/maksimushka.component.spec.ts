import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaksimushkaComponent } from './maksimushka.component';

describe('MaksimushkaComponent', () => {
  let component: MaksimushkaComponent;
  let fixture: ComponentFixture<MaksimushkaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaksimushkaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaksimushkaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
