import { TestBed } from '@angular/core/testing';

import { AMLService } from './aml.service';

describe('AMLService', () => {
  let service: AMLService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AMLService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
