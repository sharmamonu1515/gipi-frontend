import { TestBed } from '@angular/core/testing';

import { PEPService } from './pep.service';

describe('PEPService', () => {
  let service: PEPService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PEPService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
