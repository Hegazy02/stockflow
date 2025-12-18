import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Unit } from '../models/unit.model';
import { ApiResponse } from '../../../core/models/api-response';
import { ApiEndpoints } from '../../../core/constants/api-endpoints';

@Injectable({
  providedIn: 'root',
})
export class UnitService {
    private readonly apiUrl = `${ApiEndpoints.baseUrl}/units`;

  constructor(private http: HttpClient) {}

  getAll(requestParams: {
    page: number | undefined;
    limit: number | undefined;
    name?: string | undefined;
  }): Observable<ApiResponse<Unit>> {
    let params = new HttpParams()
      .set('page', requestParams.page?.toString() ?? '1')
      .set('limit', requestParams.limit?.toString() ?? '10');

    if (requestParams.name) {
      params = params.set('name', requestParams.name);
    }

    return this.http.get<ApiResponse<Unit>>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Unit> {
    return this.http.get<Unit>(`${this.apiUrl}/${id}`);
  }

  create(unit: Omit<Unit, '_id' | 'createdAt' | 'updatedAt'>): Observable<Unit> {
    return this.http.post<Unit>(this.apiUrl, unit);
  }

  update(unit: Unit): Observable<Unit> {
    return this.http.put<Unit>(`${this.apiUrl}/${unit._id}`, unit);
  }

  delete(ids: string[]): Observable<{ ids: string[] }> {
    if (ids.length === 0) {
      return throwError(() => ({
        code: 'VALIDATION_ERROR',
        message: 'No unit IDs provided for deletion',
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
          errorMessage = 'Unit not found';
          break;
        case 400:
          errorCode = 'VALIDATION_ERROR';
          errorMessage = error.error?.message || 'Invalid request';
          break;
        case 409:
          errorCode = 'DUPLICATE';
          errorMessage = error.error?.message || 'Duplicate unit';
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
