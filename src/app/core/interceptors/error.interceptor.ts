import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';

interface ValidationError {
  field: string;
  message: string;
}

interface ErrorResponse {
  success: boolean;
  message: string;
  errors?: ValidationError[];
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.error && typeof error.error === 'object') {
        const errorResponse = error.error as ErrorResponse;

        // Handle validation errors with field-specific messages
        if (errorResponse.errors && Array.isArray(errorResponse.errors)) {
          const errorDetails = errorResponse.errors
            .map((validationError: ValidationError) => 
              `• ${validationError.field}: ${validationError.message}`
            )
            .join('\n');

          messageService.add({
            severity: 'error',
            summary: errorResponse.message || 'Validation Error',
            detail: errorDetails,
            life: 5000,
          });
        } else if (errorResponse.message) {
          // Handle general error message
          messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errorResponse.message,
            life: 5000,
          });
        }
      } else if (error.status === 0) {
        // Network error
        messageService.add({
          severity: 'error',
          summary: 'Network Error',
          detail: 'Unable to connect to the server. Please check your connection.',
          life: 5000,
        });
      } else if (error.status >= 500) {
        // Server error
        messageService.add({
          severity: 'error',
          summary: 'Server Error',
          detail: 'An unexpected server error occurred. Please try again later.',
          life: 5000,
        });
      } else if (error.message) {
        // Fallback to error message
        messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
          life: 5000,
        });
      }

      return throwError(() => error);
    })
  );
};
