import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Category } from '../models/category.model';
import { ApiResponse } from '../../../core/models/api-response';
import { ApiEndpoints } from '../../../core/constants/api-endpoints';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly apiUrl = `${ApiEndpoints.baseUrl}/categories`;

  constructor(private http: HttpClient) {}

  /**
   * Get all categories
   * GET /api/categories
   */
  getAll(): Observable<ApiResponse<Category>> {
    return this.http.get<ApiResponse<Category>>(this.apiUrl);
  }

  /**
   * Get category by ID
   * GET /api/categories/:id
   */
  getById(id: string): Observable<ApiResponse<Category>> {
    return this.http.get<ApiResponse<Category>>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new category
   * POST /api/categories
   */
  create(category: Omit<Category, '_id' | 'createdAt' | 'updatedAt'>): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category);
  }

  /**
   * Update an existing category
   * PUT /api/categories/:id
   */
  update(category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${category._id}`, category);
  }

  /**
   * Delete category(s)
   * DELETE /api/categories/:id (single)
   * POST /api/categories/bulk-delete (multiple)
   */
  delete(ids: string[]): Observable<{ ids: string[] }> {
    if (ids.length === 0) {
      return throwError(() => ({
        code: 'VALIDATION_ERROR',
        message: 'No category IDs provided for deletion',
      }));
    }

    if (ids.length === 1) {
      return this.http.delete<void>(`${this.apiUrl}/${ids[0]}`).pipe(
        map(() => ({ ids })),
        catchError(this.handleError)
      );
    } else {
      return this.http
        .post<{
          success: boolean;
          message: string;
          data: { deletedCount: number; requestedCount: number };
        }>(`${this.apiUrl}/bulk-delete`, { ids })
        .pipe(
          map((response) => {
            if (response.success) {
              return { ids };
            } else {
              throw new Error(response.message || 'Bulk delete failed');
            }
          }),
          catchError(this.handleError)
        );
    }
  }

  /**
   * Handle HTTP errors
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
