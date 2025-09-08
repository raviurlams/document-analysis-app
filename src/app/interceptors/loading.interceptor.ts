import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private loadingService: LoadingService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Skip showing loader for certain requests if needed
    if (!request.url.includes('/api/')) {
      return next.handle(request);
    }

    this.loadingService.show();
    
    return next.handle(request).pipe(
      finalize(() => {
        this.loadingService.hide();
      })
    );
  }
}