import { TestBed } from '@angular/core/testing';

import { LitigationBiService } from './litigation-bi.service';

describe('LitigationBiService', () => {
  let service: LitigationBiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LitigationBiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
