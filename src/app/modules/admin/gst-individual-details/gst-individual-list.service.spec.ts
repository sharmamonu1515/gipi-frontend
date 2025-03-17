import { TestBed } from '@angular/core/testing';

import { GstIndividualListService } from './gst-individual-list.service';

describe('GstIndividualListService', () => {
  let service: GstIndividualListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GstIndividualListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
