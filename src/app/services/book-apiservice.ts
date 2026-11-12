import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { IBook } from '../classes/Ibook';

type BookRequest = IBook & { ImageBase64?: string };

@Injectable({
  providedIn: 'root',
})
export class BookAPIService {
  private readonly apiUrl = '/api/books';

  constructor(private _http: HttpClient) {}

  getBooks(): Observable<IBook[]> {
    return this._http.get<IBook[]>(this.apiUrl).pipe(retry(3), catchError(this.handleError));
  }

  getBook(bookId: string): Observable<IBook> {
    return this._http
      .get<IBook>(`${this.apiUrl}/${encodeURIComponent(bookId)}`)
      .pipe(retry(3), catchError(this.handleError));
  }

  getBooksByPriceRange(min: number, max: number): Observable<IBook[]> {
    const params = { min: String(min), max: String(max) };
    return this._http
      .get<IBook[]>(`${this.apiUrl}/filter/price`, { params })
      .pipe(retry(3), catchError(this.handleError));
  }

  postBook(book: BookRequest): Observable<IBook[]> {
    return this._http.post<IBook[]>(this.apiUrl, book).pipe(catchError(this.handleError));
  }

  putBook(book: BookRequest): Observable<IBook[]> {
    return this._http.put<IBook[]>(this.apiUrl, book).pipe(catchError(this.handleError));
  }

  deleteBook(bookId: string): Observable<IBook[]> {
    return this._http
      .delete<IBook[]>(`${this.apiUrl}/${encodeURIComponent(bookId)}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const message =
      typeof error.error === 'string' && error.error.trim() ? error.error : error.message;
    return throwError(() => new Error(message));
  }
}
