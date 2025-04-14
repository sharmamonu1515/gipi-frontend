import { TestBed } from '@angular/core/testing';

import { PeerComparisonService } from './peer-comparison.service';

describe('PeerComparisonService', () => {
  let service: PeerComparisonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PeerComparisonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
