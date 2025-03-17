import { TestBed } from '@angular/core/testing';

import { SettingListService } from './setting-list.service';

describe('SettingListService', () => {
  let service: SettingListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
