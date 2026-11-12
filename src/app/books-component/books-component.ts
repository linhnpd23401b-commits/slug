import { Component, signal } from '@angular/core';
import { IBook } from '../classes/Ibook';
import { BookAPIService } from '../services/book-apiservice';

@Component({
  selector: 'app-books-component',
  standalone: false,
  templateUrl: './books-component.html',
  styleUrl: './books-component.css',
})
export class BooksComponent {
  books = signal<IBook[]>([]);
  errMessage = signal('');
  serverImagesLink = "http://localhost:3000/image";

  constructor(private _service: BookAPIService) {
    this._service.getBooks().subscribe({
      next: (data) => this.books.set(data),
      error: (err) => this.errMessage.set(err.message),
    });
  }
}
