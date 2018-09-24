import { TestBed, inject } from '@angular/core/testing';

import { SectorFormService } from './sector-form.service';

describe('SectorFormService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SectorFormService]
    });
  });

  it('should be created', inject([SectorFormService], (service: SectorFormService) => {
    expect(service).toBeTruthy();
  }));
});
