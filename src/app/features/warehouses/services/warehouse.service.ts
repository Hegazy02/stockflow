import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Warehouse, WarehouseManager } from '../models/warehouse.model';
import { ApiResponse } from '../../../core/models/api-response';
import { ApiEndpoints } from '../../../core/constants/api-endpoints';

@Injectable({
  providedIn: 'root',
})
export class WarehouseService {
    private readonly apiUrl = `${ApiEndpoints.baseUrl}/warehouses`;

  constructor(private http: HttpClient) {}

  /**
   * Get all warehouse managers
   * GET /api/warehouses/managers
   */
  getManagers(): Observable<ApiResponse<WarehouseManager>> {
    return this.http.get<ApiResponse<WarehouseManager>>(`${this.apiUrl}/managers`);
  }

  /**
   * Get all warehouses
   * GET /api/warehouses
   * @param page - Page number (default: 1)
   * @param limit - Number of records per page (default: 10)
   */
  getAll(page: number = 1, limit: number = 10): Observable<ApiResponse<Warehouse>> {
    const params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    return this.http.get<ApiResponse<Warehouse>>(this.apiUrl, { params });
  }

  /**
   * Get warehouse by ID
   * GET /api/warehouses/:id
   */
  getById(id: string): Observable<ApiResponse<Warehouse>> {
    return this.http.get<ApiResponse<Warehouse>>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new warehouse
   * POST /api/warehouses
   */
  create(warehouse: Omit<Warehouse, '_id' | 'createdAt' | 'updatedAt'>): Observable<Warehouse> {
    return this.http.post<Warehouse>(this.apiUrl, warehouse);
  }

  /**
   * Update an existing warehouse
   * PUT /api/warehouses/:id
   */
  update(warehouse: Warehouse): Observable<Warehouse> {
    return this.http.put<Warehouse>(`${this.apiUrl}/${warehouse._id}`, warehouse);
  }

  /**
   * Delete warehouse(s)
   * DELETE /api/warehouses/:id (single)
   * POST /api/warehouses/bulk-delete (multiple)
   */
  delete(ids: string[]): Observable<{ ids: string[] }> {
    if (ids.length === 0) {
      return throwError(() => ({
        code: 'VALIDATION_ERROR',
        message: 'No warehouse IDs provided for deletion',
      }));
    }

    if (ids.length === 1) {
      // Single delete: DELETE /api/warehouses/:id
      return this.http.delete<void>(`${this.apiUrl}/${ids[0]}`).pipe(
        map(() => ({ ids })),
        catchError(this.handleError)
      );
    } else {
      // Bulk delete: POST /api/warehouses/bulk-delete
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
          errorMessage = 'Warehouse not found';
          break;
        case 400:
          errorCode = 'VALIDATION_ERROR';
          errorMessage = error.error?.message || 'Invalid request';
          break;
        case 409:
          errorCode = 'DUPLICATE';
          errorMessage = error.error?.message || 'Duplicate warehouse';
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
