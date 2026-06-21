import { TestBed } from '@angular/core/testing';
import { WindowRefService } from './window-ref.service';

describe('WindowRefService', () => {
  let service: WindowRefService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WindowRefService],
    });

    service = TestBed.inject(WindowRefService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should return hostname when window exists', () => {
    spyOnProperty(service, 'nativeWindow', 'get').and.returnValue({
      location: { hostname: 'localhost' },
    } as any);

    expect(service.isAvailable).toBeTrue();
    expect(service.hostname).toBe('localhost');
  });

  it('should return undefined when window does not exist', () => {
    spyOnProperty(service, 'nativeWindow', 'get').and.returnValue(undefined);

    expect(service.isAvailable).toBeFalse();
    expect(service.hostname).toBeUndefined();
  });
});