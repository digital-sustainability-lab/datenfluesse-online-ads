import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypesSizesMenuComponent } from './types-sizes-menu.component';

describe('TypesSizesMenuComponent', () => {
  let component: TypesSizesMenuComponent;
  let fixture: ComponentFixture<TypesSizesMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypesSizesMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypesSizesMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
