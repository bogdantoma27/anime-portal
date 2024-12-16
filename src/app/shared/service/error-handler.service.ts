import { Inject, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToasterService } from './toaster.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor(@Inject(Injector) private injector: Injector, private snack: MatSnackBar) {}

  // Need to get ToastrService from injector rather than constructor injection to avoid cyclic dependency error
  private get toasterService(): ToasterService {
    return this.injector.get(ToasterService);
  }

  public handleError(error: HttpErrorResponse): void {
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      this.toasterService.error(
        `An error occurred: ${error.error.message}`,
        ''
      );
    } else {
      this.handleServerError(error);
    }
  }

  private handleServerError(error: HttpErrorResponse): void {
    console.log(error);

    switch (error.status) {
      case 401:
        this.toasterService.error(
          `Unauthorized access. You must authenticate before receiving the requested response`,
          'Status code: 401'
        );
        break;
      case 403:
        this.toasterService.error(
          `You do not have access rights to the content, most likely due to your role assignments`,
          'Status code: 403'
        );
        break;
      case 404:
        this.toasterService.error(
          `The requested resource is missing. We are working to resolve the issue`,
          'Status code: 404'
        );
        break;
      case 500:
        this.toasterService.error(
          `Internal server error. Please contact the application support team`,
          'Status code: 500'
        );
        break;
      case 412:
        this.toasterService.error(
          `Precondition failed! The request could not be fulfilled due to conflicting conditions`,
          'Status code: 412'
        );
        break;
      case 429:
        // Handle Too Many Requests (rate limit) error
        this.toasterService.error(
          `Too many requests. Please wait and try again later.`,
          'Status code: 429'
        );
        break;
      default:
        this.toasterService.error(
          `Unexpected error occurred. Please try again later.`,
          `Status code: ${error.status}`
        );
        break;
    }
  }

  // For retries, show an info message about retry attempts
  public showRetryMessage(attempts: number): void {
    this.snack.open(`Retrying... Attempt ${attempts}/3. Please be patient.`, 'Close' ,
      {
        duration: 3000,
      }
    );
  }

  // When retry limit is reached, show a max retry reached message
  public showMaxRetryMessage(): void {
    this.snack.open('Maximum retry attempts reached. Please try again later.', 'Close',
      {
        duration: 3000,
      }
    );
  }
}
