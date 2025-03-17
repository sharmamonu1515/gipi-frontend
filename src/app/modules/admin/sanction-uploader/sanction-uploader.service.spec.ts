import { TestBed } from '@angular/core/testing';

import { SanctionUploaderService } from './sanction-uploader.service';

describe('SanctionUploaderService', () => {
  let service: SanctionUploaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SanctionUploaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
