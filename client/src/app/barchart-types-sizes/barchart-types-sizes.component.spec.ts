import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarchartTypesSizesComponent } from './barchart-types-sizes.component';

describe('BarchartTypesSizesComponent', () => {
  let component: BarchartTypesSizesComponent;
  let fixture: ComponentFixture<BarchartTypesSizesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarchartTypesSizesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarchartTypesSizesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
