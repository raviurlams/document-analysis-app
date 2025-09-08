import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  isLoading = signal<boolean>(false);
  private loadingCount = 0;

  show(): void {
    this.loadingCount++;
    this.isLoading.set(true);
  }

  hide(): void {
    this.loadingCount--;
    if (this.loadingCount <= 0) {
      this.loadingCount = 0;
      this.isLoading.set(false);
    }
  }

  reset(): void {
    this.loadingCount = 0;
    this.isLoading.set(false);
  }
}