import { TestBed } from '@angular/core/testing';

import { BarchartTypesSizesService } from './barchart-types-sizes.service';

describe('BarchartTypesSizesService', () => {
  let service: BarchartTypesSizesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BarchartTypesSizesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
