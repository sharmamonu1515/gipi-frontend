import { TestBed } from '@angular/core/testing';

import { UBOService } from './ubo.service';

describe('UBOService', () => {
  let service: UBOService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UBOService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
