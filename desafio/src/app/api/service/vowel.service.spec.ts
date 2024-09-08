import { TestBed } from '@angular/core/testing';

import { VowelService } from './vowel.service';

describe('VowelService', () => {
  let service: VowelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VowelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
