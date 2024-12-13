import { Inject, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToasterService } from './toaster.service';


@Injectable({
    providedIn: 'root'
})
export class ErrorHandlerService {

    constructor(@Inject(Injector) private injector: Injector) { }

    // Need to get ToastrService from injector rather than constructor injection to avoid cyclic dependency error
    private get toasterService(): ToasterService {
        return this.injector.get(ToasterService);
    }


    public handleError(error: HttpErrorResponse): void {
        if (error.error instanceof ErrorEvent) {
            // Client-side or network error
            this.toasterService.error(`An error occurred: ${error.error.message}`, '')
        } else {
            this.handleServerError(error);
        }
    }

    private handleServerError(error: any): void {
        if (error instanceof HttpErrorResponse) {
            console.log(error)
            // HTTP errors will be handled in interceptor itself.
            switch (error.status) {
                case 401:
                    // Handle unauthorized error
                    this.toasterService.error(`Unauthorized access. You must authenticate before receiving the requested response`, 'Status code: 401')
                    break;
                case 403:
                    // Handle forbidden error
                    this.toasterService.error(`You not have access rights to the content, most likely due to your role assignments`, 'Status code: 403')
                    break;
                case 404:
                    // Handle not found error
                    this.toasterService.error(`Server indicates that the resource you are trying to access is missing. It's most likely that this issue will get fixed ASAP`, 'Status code: 404')
                    break;
                case 500:
                    // Handle internal server error
                    this.toasterService.error(`The server has encountered a situation it does not know how to handle. You should contact the application responsible`, 'Status code: 500')
                    break;
                case 412:
                    // Handle "Precondition failed"
                    this.toasterService.error(`Precondition failed! This usually means that the request could not be fulfilled because the result was already the one expected.
           For e.g.: you tried to set a transfer status from 'approved' to 'finished', but by the time you actually tried to do it, the status of that transfer changed in the meantime to 'finished'`)
                    break;
                case 429:
                    // Handle "Too many requests"
                    this.toasterService.error(`You have exceeded the number of requests you can make in a given time frame. Please wait and try again later (${error.url})`, 'Status code: 429')
                    break;
                // Add more cases as needed
                default:
                    // Handle other errors
                    this.toasterService.error(`An unexpected error occured for API: ${error.url}`, `Status code: ${error.status}`)
                    break;
            }
        }
    }
}
