import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionarSeatsComponent } from './seleccionar-seats.component';

describe('SeleccionarSeatsComponent', () => {
  let component: SeleccionarSeatsComponent;
  let fixture: ComponentFixture<SeleccionarSeatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeleccionarSeatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeleccionarSeatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
