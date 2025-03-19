import { TestBed } from '@angular/core/testing';

import { SBOService } from './sbo.service';

describe('SBOService', () => {
  let service: SBOService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SBOService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
