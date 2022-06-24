import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HierarchBarComponent } from './hierarch-bar.component';

describe('HierarchBarComponent', () => {
  let component: HierarchBarComponent;
  let fixture: ComponentFixture<HierarchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HierarchBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HierarchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
