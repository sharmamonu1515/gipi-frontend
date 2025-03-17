import { TestBed } from '@angular/core/testing';

import { GipiApiService } from './gipi-api.service';

describe('SettingListService', () => {
  let service: GipiApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GipiApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
