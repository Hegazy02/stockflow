import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Expense, ExpenseFormBody, ExpenseStats, ExpenseFilters } from '../models/expense.model';
import { ApiResponse } from '../../../core/models/api-response';
import { ApiEndpoints } from '../../../core/constants/api-endpoints';

@Injectable({
  providedIn: 'root',
})
export class ExpensesService {
  private readonly apiUrl = `${ApiEndpoints.baseUrl}/expenses`;

  constructor(private http: HttpClient) {}

  /**
   * Get all expenses with filtering and pagination
   * GET /api/expenses
   */
  getAll(filters: ExpenseFilters): Observable<ApiResponse<Expense>> {
    let params = new HttpParams()
      .set('page', filters.page?.toString() ?? '1')
      .set('limit', filters.limit?.toString() ?? '10');

    if (filters.search) {
      params = params.set('search', filters.search);
    }
    if (filters.category) {
      params = params.set('category', filters.category);
    }
    if (filters.startDate) {
      params = params.set('startDate', filters.startDate);
    }
    if (filters.endDate) {
      params = params.set('endDate', filters.endDate);
    }

    return this.http.get<ApiResponse<Expense>>(this.apiUrl, { params });
  }

  /**
   * Get a single expense record by its ID
   * GET /api/expenses/:id
   */
  getById(id: string): Observable<ApiResponse<Expense>> {
    return this.http.get<ApiResponse<Expense>>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new expense record
   * POST /api/expenses
   */
  create(expense: ExpenseFormBody): Observable<ApiResponse<Expense>> {
    return this.http.post<ApiResponse<Expense>>(this.apiUrl, expense);
  }

  /**
   * Update an existing expense record
   * PUT /api/expenses/:id
   */
  update(id: string, expense: Partial<ExpenseFormBody>): Observable<ApiResponse<Expense>> {
    return this.http.put<ApiResponse<Expense>>(`${this.apiUrl}/${id}`, expense);
  }

  /**
   * Delete a single expense record or multiple records
   * DELETE /api/expenses/:id
   * DELETE /api/expenses (bulk)
   */
  delete(ids: string[]): Observable<{ ids: string[] }> {
    if (ids.length === 0) {
      return throwError(() => new Error('No expense IDs provided for deletion'));
    }

    if (ids.length === 1) {
      return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${ids[0]}`).pipe(
        map(() => ({ ids })),
        catchError(this.handleError)
      );
    } else {
      // Bulk delete: DELETE /api/expenses with body
      return this.http.request<ApiResponse<any>>('DELETE', this.apiUrl, { body: { ids } }).pipe(
        map(() => ({ ids })),
        catchError(this.handleError)
      );
    }
  }

  /**
   * Get expense statistics by category and overall
   * GET /api/expenses/stats
   */
  getStats(startDate?: string, endDate?: string): Observable<ApiResponse<ExpenseStats>> {
    let params = new HttpParams();
    if (startDate) {
      params = params.set('startDate', startDate);
    }
    if (endDate) {
      params = params.set('endDate', endDate);
    }

    return this.http.get<ApiResponse<ExpenseStats>>(`${this.apiUrl}/stats`, { params });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    return throwError(() => new Error(errorMessage));
  }
}
