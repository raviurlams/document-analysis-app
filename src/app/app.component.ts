import { Component, OnInit, ViewChild, signal, effect } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from './services/auth.service';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Document Analysis App';
  isAuthenticated = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  currentUser = signal<any>(null);

  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor(
    private authService: AuthService,
    private loadingService: LoadingService
  ) {
    // Use effects to react to signal changes
    effect(() => {
      this.isAuthenticated.set(this.authService.isAuthenticated());
    });

    effect(() => {
      this.currentUser.set(this.authService.currentUser());
    });

    effect(() => {
      this.isLoading.set(this.loadingService.isLoading());
    });
  }

  ngOnInit(): void {
    // Initial values
    this.isAuthenticated.set(this.authService.isAuthenticated());
    this.currentUser.set(this.authService.currentUser());
    this.isLoading.set(this.loadingService.isLoading());
  }

  logout(): void {
    this.authService.logout();
    if (this.sidenav) {
      this.sidenav.close();
    }
  }

  toggleSidenav(): void {
    if (this.sidenav) {
      this.sidenav.toggle();
    }
  }
}