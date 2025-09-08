import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { LoadingService } from '../../services/loading.service';
import { AngularMaterialModule } from '../../angular-material.module';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let loadingService: jasmine.SpyObj<LoadingService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login', 'isAuthenticated']);
    const loadingSpy = jasmine.createSpyObj('LoadingService', [], { isLoading: of(false) });
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule, AngularMaterialModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: LoadingService, useValue: loadingSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    loadingService = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize login form', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.get('email')).toBeTruthy();
    expect(component.loginForm.get('password')).toBeTruthy();
  });

  it('should validate email field', () => {
    const email = component.loginForm.get('email');
    
    email?.setValue('');
    expect(email?.hasError('required')).toBeTrue();
    
    email?.setValue('invalid-email');
    expect(email?.hasError('email')).toBeTrue();
    
    email?.setValue('valid@example.com');
    expect(email?.valid).toBeTrue();
  });

  it('should validate password field', () => {
    const password = component.loginForm.get('password');
    
    password?.setValue('');
    expect(password?.hasError('required')).toBeTrue();
    
    password?.setValue('short');
    expect(password?.hasError('minlength')).toBeTrue();
    
    password?.setValue('validpassword');
    expect(password?.valid).toBeTrue();
  });

  it('should submit form and navigate on successful login', fakeAsync(() => {
    const mockResponse = { token: 'test-token', user: { id: '1', email: 'test@example.com', name: 'Test User' } };
    authService.login.and.returnValue(of(mockResponse));
    
    component.loginForm.setValue({ email: 'test@example.com', password: 'password123' });
    component.onSubmit();
    
    tick();
    
    expect(authService.login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
    expect(router.navigate).toHaveBeenCalledWith(['/document-analysis']);
  }));

  it('should show error message on login failure', fakeAsync(() => {
    const errorResponse = { error: { message: 'Invalid credentials' } };
    authService.login.and.returnValue(throwError(() => errorResponse));
    
    component.loginForm.setValue({ email: 'test@example.com', password: 'wrongpassword' });
    component.onSubmit();
    
    tick();
    
    expect(component.errorMessage).toBe('Invalid credentials');
  }));

  it('should redirect if already authenticated', () => {
    authService.isAuthenticated = jasmine.createSpy().and.returnValue(true);
    
    component.ngOnInit();
    
    expect(router.navigate).toHaveBeenCalledWith(['/document-analysis']);
  });
});