import { TestBed } from '@angular/core/testing';

import { BarchartDetailsService } from './barchart-details.service';

describe('BarchartDetailsService', () => {
  let service: BarchartDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BarchartDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
