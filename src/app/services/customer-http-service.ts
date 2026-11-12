import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { ICustomerGroup } from '../classes/ICustomer';

@Injectable({ providedIn: 'root' })
export class CustomerHttpService {
  private readonly url = 'assets/data/customers.json';

  constructor(private http: HttpClient) {}

  getCustomers(): Observable<ICustomerGroup[]> {
    return this.http.get<ICustomerGroup[]>(this.url).pipe(
      retry(3),
      catchError(this.handleError),
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(() => new Error(`Không thể tải danh sách khách hàng. ${error.message}`));
  }
}
