import { TestBed } from '@angular/core/testing';

import { GstListService } from './gst-list.service';

describe('GstListService', () => {
  let service: GstListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GstListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
