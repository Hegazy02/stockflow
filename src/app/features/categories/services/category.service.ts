import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Category } from '../models/category.model';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  /**
   * Get all categories
   * GET /api/categories
   * @returns Observable of ProductCategory array
   */
  getAll(): Observable<ApiResponse<Category[]>> {
    return this.http.get<ApiResponse<Category[]>>(this.apiUrl);
  }

  /**
   * Handle HTTP errors
   * @param error - HTTP error response
   * @returns Observable that throws a structured error object
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Failed to load categories';
    let errorCode = 'UNKNOWN_ERROR';

    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = 'Network error. Please check your connection.';
      errorCode = 'NETWORK_ERROR';
    } else {
      // Server-side error
      errorCode = `HTTP_${error.status}`;

      // Map common HTTP status codes to user-friendly messages
      if (error.status === 0) {
        errorMessage = 'Network error. Please check your connection.';
        errorCode = 'NETWORK_ERROR';
      } else if (error.status === 404) {
        errorMessage = 'Categories endpoint not found';
        errorCode = 'NOT_FOUND';
      } else if (error.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
        errorCode = 'SERVER_ERROR';
      } else if (error.status >= 400) {
        errorMessage = error.error?.message || 'Failed to load categories';
        errorCode = 'CLIENT_ERROR';
      }
    }

    return throwError(() => ({
      code: errorCode,
      message: errorMessage,
      originalError: error,
    }));
  }
}
