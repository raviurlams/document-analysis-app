import { Component, OnInit, ViewChild, signal, computed } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from './services/auth.service';
import { LoadingService } from './services/loading.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Document Analysis App';
  
  // Use computed signals to derive values from services
  isAuthenticated = computed(() => this.authService.isAuthenticated());
  isLoading = computed(() => this.loadingService.isLoading());
  currentUser = computed(() => this.authService.currentUser());

  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor(
    private authService: AuthService,
    private loadingService: LoadingService,
      private router: Router
  ) {}

  ngOnInit(): void {
  }

  logout(): void {
    this.authService.logout();
    if (this.sidenav) {
      this.sidenav.close();
      this.router.navigate(['/login']);
    }
  }

  toggleSidenav(): void {
    if (this.sidenav) {
      this.sidenav.toggle();
    }
  }
}