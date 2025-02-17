import { Injectable } from "@angular/core";
import { Observable, timer, retry } from "rxjs";
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, TextOnlySnackBar } from "@angular/material/snack-bar";

@Injectable({ providedIn: "root" })
export class UtilsService {
  private activeRetrySnackbar: MatSnackBarRef<TextOnlySnackBar> | null = null;
  private readonly defaultDuration = 5000; // 5 seconds, to persist the snackbar

  constructor(private snackBar: MatSnackBar) {}

  // Snackbar configurations
  private snackBarConfig: MatSnackBarConfig = {
    horizontalPosition: "center",
    verticalPosition: "bottom",
    duration: this.defaultDuration,
  };

  private errorConfig: MatSnackBarConfig = {
    ...this.snackBarConfig,
    panelClass: ["error-snackbar"],
  };

  private successConfig: MatSnackBarConfig = {
    ...this.snackBarConfig,
    panelClass: ["success-snackbar"],
  };

  private infoConfig: MatSnackBarConfig = {
    ...this.snackBarConfig,
    panelClass: ["info-snackbar"],
  };

  // Snackbar methods
  showErrorSnackbar(message: string, duration?: number) {
    this.snackBar.open(message, "Close", {
      ...this.errorConfig,
      duration: duration || this.defaultDuration,
    });
  }

  showSuccessSnackbar(message: string, duration?: number) {
    this.snackBar.open(message, "Close", {
      ...this.successConfig,
      duration: duration || this.defaultDuration,
    });
  }

  showInfoSnackbar(message: string, duration?: number) {
    this.snackBar.open(message, "Close", {
      ...this.infoConfig,
      duration: duration || this.defaultDuration,
    });
  }

  // Custom retry operator for handling rate limits
  retryWithDelay = (maxRetries = 3, delayMs = 2500) => {
    return (source: Observable<any>) =>
      source.pipe(
        retry({
          count: maxRetries,
          delay: (error, retryCount) => {
            if (error.status === 429) {
              this.updateRetryNotification(retryCount, maxRetries);
              return timer(delayMs);
            }
            return timer(0); // Immediately throw for other errors
          },
        })
      );
  };

  private updateRetryNotification(currentRetry: number, maxRetries: number) {
    if (!this.activeRetrySnackbar) {
      this.activeRetrySnackbar = this.snackBar.open(
        `Rate limit reached. Retrying ${currentRetry}/${maxRetries}...`,
        "Dismiss",
        this.snackBarConfig
      );

      // Clear the reference when the snackbar is dismissed
      this.activeRetrySnackbar.afterDismissed().subscribe(() => {
        this.activeRetrySnackbar = null;
      });
    } else {
      // Update existing snackbar message
      this.activeRetrySnackbar.instance.data = {
        ...this.activeRetrySnackbar.instance.data,
        message: `Rate limit reached. Retrying ${currentRetry}/${maxRetries}...`,
      };
    }

    // If this is the last retry, dismiss the snackbar after a short delay
    if (currentRetry === maxRetries) {
      setTimeout(() => {
        if (this.activeRetrySnackbar) {
          this.activeRetrySnackbar.dismiss();
          this.activeRetrySnackbar = null;
        }
      }, 1000);
    }
  }
}

/*
this.utils.showErrorSnackbar('An error occurred!');
this.utils.showSuccessSnackbar('Operation completed successfully!');
this.utils.showInfoSnackbar('Please wait while we process your request...');

// With custom duration (in milliseconds)
this.utils.showErrorSnackbar('Custom duration error', 5000);
*/
