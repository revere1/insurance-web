import { TestBed, inject } from '@angular/core/testing';

import { TickerFormService } from './ticker-form.service';

describe('TickerFormService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TickerFormService]
    });
  });

  it('should be created', inject([TickerFormService], (service: TickerFormService) => {
    expect(service).toBeTruthy();
  }));
});
