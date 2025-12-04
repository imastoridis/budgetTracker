import { TestBed, async, inject } from '@angular/core/testing';
import { CategoriesService } from './categories.service';

describe('Service: Categories.service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CategoriesService],
    });
  });

  it('should ...', inject([CategoriesService], (service: CategoriesService) => {
    expect(service).toBeTruthy();
  }));
});
