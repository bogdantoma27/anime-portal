import { Injectable, inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, finalize, retryWhen, scan, switchMap, timer } from 'rxjs';
import { throwError } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorHandlerService } from '../service/error-handler.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private errorHandlerService = inject(ErrorHandlerService);
  private spinnerService: NgxSpinnerService = inject(NgxSpinnerService);
  private maxRetryAttempts = 3;
  private retryDelayMs = 1500;

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    this.showLoader();
    return next.handle(request).pipe(
      retryWhen((errors) =>
        errors.pipe(
          scan((attempts, error) => {
            if (error instanceof HttpErrorResponse && error.status === 429 && attempts < this.maxRetryAttempts) {
              attempts++;
              this.errorHandlerService.showRetryMessage(attempts); // Show retry message via toastr
              return attempts;
            }
            throw error; // Stop retrying if not 429 or max attempts exceeded
          }, 0),
          switchMap((attempts) =>
            attempts < this.maxRetryAttempts
              ? timer(this.retryDelayMs) // Retry after 1000ms if rate-limited
              : throwError(() => new Error('Max retry attempts reached'))
          )
        )
      ),
      catchError((error: HttpErrorResponse) => {
        this.hideLoader();
        this.errorHandlerService.handleError(error); // Handle error globally
        return throwError(() => error); // Re-throw the error to propagate it
      }),
      finalize(() => {
        this.hideLoader(); // Hide loader after request completes
      })
    );
  }

  private showLoader(): void {
    this.spinnerService.show(); // Show loading spinner
  }

  private hideLoader(): void {
    this.spinnerService.hide(); // Hide loading spinner
  }
}
