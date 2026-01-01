import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Transaction, TransactionFormData } from '../models/transaction.model';
import { ApiResponse } from '../../../core/models/api-response';
import { ApiEndpoints } from '../../../core/constants/api-endpoints';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private readonly apiUrl = `${ApiEndpoints.baseUrl}/transactions`;

  constructor(private http: HttpClient) {}

  getAll(requestParams: {
    page: number | undefined;
    limit: number | undefined;
    partner?: string | undefined;
    transactionType?: string | undefined;
    serialNumber?: string | undefined;
  }): Observable<ApiResponse<Transaction>> {
    let params = new HttpParams()
      .set('page', requestParams.page?.toString() ?? '1')
      .set('limit', requestParams.limit?.toString() ?? '10');

    if (requestParams.partner) {
      params = params.set('partner', requestParams.partner);
    }
    if (requestParams.transactionType) {
      params = params.set('transactionType', requestParams.transactionType);
    }
    if (requestParams.serialNumber) {
      params = params.set('serialNumber', requestParams.serialNumber);
    }

    return this.http.get<ApiResponse<Transaction>>(this.apiUrl, { params });
  }

  getById(id: string): Observable<ApiResponse<Transaction>> {
    return this.http.get<ApiResponse<Transaction>>(`${this.apiUrl}/${id}`);
  }

  getPartnerTransactions(
    partnerId: string,
    page: number = 1,
    limit: number = 10
  ): Observable<{
    success: boolean;
    data: {
      transactions: Transaction[];
      totals: {
        balance: number;
        paid: number;
        left: number;
      };
      pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
      };
    };
  }> {
    const params = new HttpParams()
      .set('partnerId', partnerId)
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http
      .get<{
        success: boolean;
        data: {
          transactions: Transaction[];
          totals: {
            balance: number;
            paid: number;
            left: number;
          };
          pagination: {
            total: number;
            page: number;
            limit: number;
            pages: number;
          };
        };
      }>(`${this.apiUrl}/partner`, { params })
      .pipe(catchError(this.handleError));
  }

  create(transaction: TransactionFormData): Observable<Transaction> {
    return this.http.post<Transaction>(this.apiUrl, transaction);
  }

  update(id: string, transaction: TransactionFormData): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.apiUrl}/${id}`, transaction);
  }

  delete(ids: string[]): Observable<{ ids: string[] }> {
    if (ids.length === 0) {
      return throwError(() => ({
        code: 'VALIDATION_ERROR',
        message: 'No transaction IDs provided for deletion',
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
          errorMessage = 'Transaction not found';
          break;
        case 400:
          errorCode = 'VALIDATION_ERROR';
          errorMessage = error.error?.message || 'Invalid request';
          break;
        case 409:
          errorCode = 'DUPLICATE';
          errorMessage = error.error?.message || 'Duplicate transaction';
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
