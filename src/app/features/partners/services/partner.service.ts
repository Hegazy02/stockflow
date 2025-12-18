import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Partner } from '../models/partner.model';
import { ApiResponse } from '../../../core/models/api-response';
import { ApiEndpoints } from '../../../core/constants/api-endpoints';

@Injectable({
  providedIn: 'root',
})
export class PartnerService {
  private readonly apiUrl = `${ApiEndpoints.baseUrl}/partners`;

  constructor(private http: HttpClient) {}

  /**
   * Get all partners
   * GET /api/partners
   * @param page - Page number (default: 1)
   * @param limit - Number of records per page (default: 10)
   */
  getAll({
    page,
    limit,
    type,
    name,
  }: {
    page: number;
    limit: number;
    type?: string;
    name?: string;
  }): Observable<ApiResponse<Partner>> {
    let params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    if (type) {
      params = params.append('type', type);
    }

    if (name) {
      params = params.append('name', name);
    }

    return this.http.get<ApiResponse<Partner>>(this.apiUrl, { params });
  }

  /**
   * Get partner by ID
   * GET /api/partners/:id
   */
  getById(id: string): Observable<ApiResponse<Partner>> {
    return this.http.get<ApiResponse<Partner>>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new partner
   * POST /api/partners
   */
  create(partner: Omit<Partner, '_id' | 'createdAt' | 'updatedAt'>): Observable<Partner> {
    return this.http.post<Partner>(this.apiUrl, partner);
  }

  /**
   * Update an existing partner
   * PUT /api/partners/:id
   */
  update(partner: Partner): Observable<Partner> {
    return this.http.put<Partner>(`${this.apiUrl}/${partner._id}`, partner);
  }

  /**
   * Delete partner(s)
   * DELETE /api/partners/:id (single)
   * POST /api/partners/bulk-delete (multiple)
   */
  delete(ids: string[]): Observable<{ ids: string[] }> {
    if (ids.length === 0) {
      return throwError(() => ({
        code: 'VALIDATION_ERROR',
        message: 'No partner IDs provided for deletion',
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
    let errorMessage = 'An unknown error occurred';
    let errorCode = 'UNKNOWN_ERROR';

    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
      errorCode = 'CLIENT_ERROR';
    } else {
      errorCode = `HTTP_${error.status}`;
      errorMessage =
        error.error?.message || error.message || `Server returned code ${error.status}`;

      switch (error.status) {
        case 404:
          errorCode = 'NOT_FOUND';
          errorMessage = 'Partner not found';
          break;
        case 400:
          errorCode = 'VALIDATION_ERROR';
          errorMessage = error.error?.message || 'Invalid request';
          break;
        case 409:
          errorCode = 'DUPLICATE';
          errorMessage = error.error?.message || 'Duplicate partner';
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
