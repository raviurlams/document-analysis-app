import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadingService]
    });
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show loading state', () => {
    service.show();
    expect(service.isLoading()).toBeTrue();
  });

  it('should hide loading state', () => {
    service.show();
    service.hide();
    expect(service.isLoading()).toBeFalse();
  });

  it('should handle multiple show/hide calls correctly', () => {
    service.show(); // count = 1
    service.show(); // count = 2
    expect(service.isLoading()).toBeTrue();
    
    service.hide(); // count = 1
    expect(service.isLoading()).toBeTrue();
    
    service.hide(); // count = 0
    expect(service.isLoading()).toBeFalse();
  });

  it('should reset loading state', () => {
    service.show();
    service.show();
    service.reset();
    expect(service.isLoading()).toBeFalse();
  });
});