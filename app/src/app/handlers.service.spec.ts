import { TestBed, inject } from '@angular/core/testing';

import { HandlersService } from './handlers.service';

describe('HandlersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HandlersService]
    });
  });

  it('should be created', inject([HandlersService], (service: HandlersService) => {
    expect(service).toBeTruthy();
  }));
});
