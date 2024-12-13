import { Injectable, inject } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpErrorResponse
} from '@angular/common/http';
import { catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorHandlerService } from '../service/error-handler.service';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    private errorHandlerService = inject(ErrorHandlerService);
    private spinnerService: NgxSpinnerService = inject(NgxSpinnerService);

    intercept(request: HttpRequest<any>, next: HttpHandler) {
        this.showLoader();
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                this.hideLoader();
                this.errorHandlerService.handleError(error);
                return throwError(() => new Error('Something bad happened; please try again later.'));
            }),
            finalize(async () => {
                this.hideLoader();
            })
        );
    }

    private showLoader(): void {
        this.spinnerService.show();
    }

    private hideLoader(): void {
        this.spinnerService.hide();
    }
}
