import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DndchessComponent } from './dndchess.component';

describe('DndchessComponent', () => {
  let component: DndchessComponent;
  let fixture: ComponentFixture<DndchessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DndchessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DndchessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
