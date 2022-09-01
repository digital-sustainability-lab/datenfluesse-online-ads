import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarchartDetailsComponent } from './barchart-details.component';

describe('BarchartDetailsComponent', () => {
  let component: BarchartDetailsComponent;
  let fixture: ComponentFixture<BarchartDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BarchartDetailsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarchartDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
