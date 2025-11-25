import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { ApiResponse } from '../../../core/models/api-response';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  /**
   * Get all products
   * GET /api/products
   * @param page - Page number (default: 1)
   * @param limit - Number of records per page (default: 10)
   */
  getAll(page: number = 1, limit: number = 10): Observable<ApiResponse<Product>> {
    const params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    return this.http.get<ApiResponse<Product>>(this.apiUrl, { params });
  }

  /**
   * Get product by ID
   * GET /api/products/:id
   */
  getById(id: string): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new product
   * POST /api/products
   */
  create(product: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>): Observable<Product> {
    return this.http.post<any>(this.apiUrl, product);
  }

  /**
   * Update an existing product
   * PUT /api/products/:id
   */
  update(product: Product): Observable<Product> {
    return this.http.put<any>(`${this.apiUrl}/${product._id}`, product);
  }

  /**
   * Delete product(s)
   * DELETE /api/products/:id (single)
   * POST /api/products/bulk-delete (multiple)
   */
  delete(ids: string[]): Observable<{ ids: string[] }> {
    if (ids.length === 0) {
      return throwError(() => ({
        code: 'VALIDATION_ERROR',
        message: 'No product IDs provided for deletion',
      }));
    }

    if (ids.length === 1) {
      // Single delete: DELETE /api/products/:id
      return this.http.delete<void>(`${this.apiUrl}/${ids[0]}`).pipe(
        map(() => ({ ids })),
        catchError(this.handleError)
      );
    } else {
      // Bulk delete: POST /api/products/bulk-delete
      return this.http
        .post<{
          success: boolean;
          message: string;
          data: {
            deletedCount: number;
            requestedCount: number;
          };
        }>(`${this.apiUrl}/bulk-delete`, { ids })
        .pipe(
          map((response) => {
            // Return the IDs that were successfully deleted
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
   * Transform API response to Product model
   * Handles both _id and id formats, and converts date strings to Date objects
   */

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    let errorCode = 'UNKNOWN_ERROR';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
      errorCode = 'CLIENT_ERROR';
    } else {
      // Server-side error
      errorCode = `HTTP_${error.status}`;
      errorMessage =
        error.error?.message || error.message || `Server returned code ${error.status}`;

      // Map common HTTP status codes
      switch (error.status) {
        case 404:
          errorCode = 'NOT_FOUND';
          errorMessage = 'Resource not found';
          break;
        case 400:
          errorCode = 'VALIDATION_ERROR';
          errorMessage = error.error?.message || 'Invalid request';
          break;
        case 409:
          errorCode = 'DUPLICATE_SKU';
          errorMessage = error.error?.message || 'Duplicate resource';
          break;
        case 500:
          errorCode = 'SERVER_ERROR';
          errorMessage = 'Internal server error';
          break;
      }
    }

    return throwError(() => ({
      code: errorCode,
      message: errorMessage,
      originalError: error,
    }));
  }
}
