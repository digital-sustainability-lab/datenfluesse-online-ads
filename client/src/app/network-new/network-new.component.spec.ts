import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkNewComponent } from './network-new.component';

describe('NetworkNewComponent', () => {
  let component: NetworkNewComponent;
  let fixture: ComponentFixture<NetworkNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetworkNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
