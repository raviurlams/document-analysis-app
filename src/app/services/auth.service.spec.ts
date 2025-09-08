import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService, User, AuthResponse } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    
    // Clear cookies and localStorage before each test
    document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and store authentication data', () => {
    const mockUser: User = { email: 'test@example.com', password: 'Password123!' };
    const mockResponse: AuthResponse = {
      token: 'jwt-token',
      user: { id: '1', email: 'test@example.com', name: 'Test User' }
    };

    service.login(mockUser).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(service.isAuthenticated()).toBeTrue();
    });

    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    // Check if cookie was set
    expect(document.cookie).toContain('auth_token=jwt-token');
    expect(localStorage.getItem('user_data')).toBeTruthy();
  });

  it('should logout and clear authentication data', () => {
    // First set up authentication
    document.cookie = 'auth_token=test-token;';
    localStorage.setItem('user_data', JSON.stringify({ id: '1', name: 'Test User' }));
    
    // Manually set the signals since we're bypassing normal login
    service.isAuthenticated.set(true);
    service.currentUser.set({ id: '1', name: 'Test User' });

    service.logout();
    
    expect(document.cookie).not.toContain('auth_token=test-token');
    expect(localStorage.getItem('user_data')).toBeNull();
    expect(service.isAuthenticated()).toBeFalse();
    expect(service.currentUser()).toBeNull();
  });

  it('should check authentication status on initialization', () => {
    // Set up cookies and localStorage before service initialization
    document.cookie = 'auth_token=existing-token;';
    localStorage.setItem('user_data', JSON.stringify({ id: '1', name: 'Existing User' }));

    // Create a new instance to test initialization
    const newService = TestBed.inject(AuthService);
    
    expect(newService.isAuthenticated()).toBeTrue();
    expect(newService.currentUser()).toEqual({ id: '1', name: 'Existing User' });
  });

  it('should return null token when not authenticated', () => {
    expect(service.getToken()).toBeNull();
  });

  it('should return token when authenticated', () => {
    document.cookie = 'auth_token=test-token;';
    expect(service.getToken()).toBe('test-token');
  });
});