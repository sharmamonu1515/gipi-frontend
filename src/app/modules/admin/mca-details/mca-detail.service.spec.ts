import { TestBed } from '@angular/core/testing';

import { McaDetailService } from './mca-detail.service';

describe('McaDetailService', () => {
  let service: McaDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(McaDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
