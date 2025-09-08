import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service';
import { LoadingService } from './services/loading.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let loadingService: jasmine.SpyObj<LoadingService>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['logout', 'isAuthenticatedValue'], {
      isAuthenticated: jasmine.createSpy().and.returnValue(false),
      currentUser: jasmine.createSpy().and.returnValue(null)
    });
    
    const loadingSpy = jasmine.createSpyObj('LoadingService', [], {
      isLoading: jasmine.createSpy().and.returnValue(false)
    });

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        MatSidenavModule,
        MatToolbarModule,
        MatIconModule,
        MatListModule
      ],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: LoadingService, useValue: loadingSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    loadingService = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;
    
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with authentication state', () => {
    expect(component.isAuthenticated()).toBeFalse();
    expect(component.currentUser()).toBeNull();
  });

  it('should call logout on auth service when logout is called', () => {
    component.logout();
    expect(authService.logout).toHaveBeenCalled();
  });

  it('should toggle sidenav', () => {
    // Mock the sidenav
    const mockSidenav = jasmine.createSpyObj('MatSidenav', ['toggle', 'close']);
    component.sidenav = mockSidenav;

    component.toggleSidenav();
    expect(mockSidenav.toggle).toHaveBeenCalled();

    component.logout();
    expect(mockSidenav.close).toHaveBeenCalled();
  });

  it('should handle undefined sidenav gracefully', () => {
    component.sidenav = undefined as any;

    // These should not throw errors
    expect(() => component.toggleSidenav()).not.toThrow();
    expect(() => component.logout()).not.toThrow();
  });
});