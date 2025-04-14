import { TestBed } from '@angular/core/testing';

import { KarzaLogsService } from './karza-logs.service';

describe('KarzaLogsService', () => {
  let service: KarzaLogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KarzaLogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
