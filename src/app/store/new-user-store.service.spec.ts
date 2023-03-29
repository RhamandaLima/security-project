import { TestBed } from '@angular/core/testing';

import { NewUserStoreService } from './new-user-store.service';

describe('NewUserStoreService', () => {
  let service: NewUserStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewUserStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
