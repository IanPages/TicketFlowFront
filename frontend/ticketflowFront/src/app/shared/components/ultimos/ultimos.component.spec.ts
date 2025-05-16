import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UltimosComponent } from './ultimos.component';

describe('UltimosComponent', () => {
  let component: UltimosComponent;
  let fixture: ComponentFixture<UltimosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UltimosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UltimosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
