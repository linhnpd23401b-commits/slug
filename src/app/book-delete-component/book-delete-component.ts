import { Component, signal } from '@angular/core';
import { IBook } from '../classes/Ibook';
import { BookAPIService } from '../services/book-apiservice';

@Component({
  selector: 'app-book-delete-component',
  standalone: false,
  templateUrl: './book-delete-component.html',
  styleUrl: './book-delete-component.css',
})
export class BookDeleteComponent {
  books = signal<IBook[]>([]);
  errMessage = signal('');
  readonly serverImagesLink = 'http://localhost:3000/image';

  constructor(private _service: BookAPIService) {
    this.loadBooks();
  }

  deleteBook(bookId: string) {
    if (!window.confirm(`Bạn có chắc muốn xóa sách ${bookId}?`)) {
      return;
    }

    this.errMessage.set('');
    this._service.deleteBook(bookId).subscribe({
      next: (books) => this.books.set(books),
      error: (error: Error) => this.errMessage.set(error.message),
    });
  }

  private loadBooks() {
    this._service.getBooks().subscribe({
      next: (books) => this.books.set(books),
      error: (error: Error) => this.errMessage.set(error.message),
    });
  }
}
