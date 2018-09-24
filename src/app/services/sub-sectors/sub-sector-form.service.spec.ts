import { TestBed, inject } from '@angular/core/testing';

import { SubSectorFormService } from './sub-sector-form.service';

describe('SubSectorFormService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubSectorFormService]
    });
  });

  it('should be created', inject([SubSectorFormService], (service: SubSectorFormService) => {
    expect(service).toBeTruthy();
  }));
});
