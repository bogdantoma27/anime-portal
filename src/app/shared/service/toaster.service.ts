import { Injectable, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class ToasterService {
    private toastr = inject(ToastrService);

    options = {
        positionClass: 'toast-top-right',
        progressBar: false,
        preventDuplicates: true,
        closeButton: true,

    }

    success(message: string, title?: string) {
        this.toastr.success(message, title, this.options);
    }

    error(message: string, title?: string) {
        this.toastr.error(message, title, this.options);
    }

    warning(message: string, title?: string) {
        this.toastr.warning(message, title, this.options);
    }

    info(message: string, title?: string) {
        this.toastr.info(message, title, this.options);
    }

}
