import {
  ApplicationConfig,
  ErrorHandler,
  importProvidersFrom,
  Provider,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { CacheInterceptor } from './shared/interceptor/cache.interceptor';
import { CacheResolverService } from './shared/service/cache-resolver.service';
import { ErrorHandlerService } from './shared/service/error-handler.service';
import { ErrorInterceptor } from './shared/interceptor/error.interceptor';
import { provideToastr } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

/* Provider for the requests caching interceptor */
const CacheInterceptorProvider: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: CacheInterceptor,
  multi: true,
};

/* Provider for Error handling service */
const ErrorHandlerProvider: Provider = {
  provide: ErrorHandler,
  useClass: ErrorHandlerService,
};

/* Provider for the errors interceptor */
const ErrorInterceptorProvider: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  multi: true,
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    provideToastr(),
    importProvidersFrom(
      NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }),
      NgxSkeletonLoaderModule.forRoot({
        theme: {
          // Enabliong theme combination
          extendsFromRoot: true,
        },
      })
    ),
    // CacheResolverService,
    // CacheInterceptorProvider,
    // ErrorHandlerProvider,
    // ErrorInterceptorProvider,
  ],
};
