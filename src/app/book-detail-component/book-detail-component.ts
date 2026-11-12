import { Component, signal } from '@angular/core';
import { BookAPIService } from '../services/book-apiservice';
import { IBook } from '../classes/Ibook';

@Component({
  selector: 'app-book-detail-component',
  standalone: false,
  templateUrl: './book-detail-component.html',
  styleUrl: './book-detail-component.css',
})
export class BookDetailComponent {
  book = signal<IBook | null>(null);
  errMessage = signal('');
  readonly serverImagesLink = 'http://localhost:3000/image';

  constructor(private _service: BookAPIService) {
  }

  searchBook(bookId: string) {
    this.book.set(null);
    this.errMessage.set("");
    this._service.getBook(bookId).subscribe({
      next: (data) => { this.book.set(data) },
      error: (err: Error) => { this.errMessage.set(err.message) }
    });
  }
}
