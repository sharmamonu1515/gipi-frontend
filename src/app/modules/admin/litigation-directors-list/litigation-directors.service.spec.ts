import { TestBed } from '@angular/core/testing';

import { LitigationDirectorsService } from './litigation-directors.service';

describe('LitigationDirectorsService', () => {
  let service: LitigationDirectorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LitigationDirectorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
