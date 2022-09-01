import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarchartDetailsMenu } from './barchart-details-menu.component';

describe('BarchartDetailsMenu', () => {
  let component: BarchartDetailsMenu;
  let fixture: ComponentFixture<BarchartDetailsMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BarchartDetailsMenu],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarchartDetailsMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
