import { TestBed } from '@angular/core/testing';

import { BlueskyService } from './bluesky.service';

describe('BlueskyService', () => {
  let service: BlueskyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlueskyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
