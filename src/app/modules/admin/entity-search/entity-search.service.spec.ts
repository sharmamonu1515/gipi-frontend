import { TestBed } from '@angular/core/testing';

import { EntitySearchService } from './entity-search.service';

describe('EntitySearchService', () => {
  let service: EntitySearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntitySearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
