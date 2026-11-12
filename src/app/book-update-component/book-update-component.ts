import { Component, signal } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Book, IBook } from '../classes/Ibook';
import { BookAPIService } from '../services/book-apiservice';

@Component({
  selector: 'app-book-update-component',
  standalone: false,
  templateUrl: './book-update-component.html',
  styleUrl: './book-update-component.css',
})
export class BookUpdateComponent {
  book = new Book();
  books = signal<IBook[]>([]);
  errMessage = signal('');
  isSubmitting = signal(false);
  readonly serverImagesLink = 'http://localhost:3000/image';
  private selectedImage: File | null = null;

  constructor(private _service: BookAPIService) {
    this.loadBooks();
  }

  selectBook(book: IBook) {
    this.book = { ...book, ImageBase64: '' };
    this.selectedImage = null;
    this.errMessage.set('');
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.selectedImage = null;
    this.errMessage.set('');

    if (!file) {
      return;
    }
    if (!file.type.startsWith('image/')) {
      input.value = '';
      this.errMessage.set('Vui lòng chọn tệp hình ảnh.');
      return;
    }

    this.selectedImage = file;
  }

  putBook(form: NgForm) {
    this.errMessage.set('');
    if (form.invalid) {
      this.errMessage.set('Vui lòng nhập tên sách và giá hợp lệ.');
      form.form.markAllAsTouched();
      return;
    }
    if (!this.book.BookId) {
      this.errMessage.set('Chọn một sách trong danh sách trước khi cập nhật.');
      return;
    }

    this.isSubmitting.set(true);
    const saveBook = (imageBase64?: string) => {
      const updatedBook = {
        ...this.book,
        ...(imageBase64 ? { ImageBase64: imageBase64 } : {}),
      };
      this._service.putBook(updatedBook).subscribe({
        next: (books) => {
          this.books.set(books);
          const savedBook = books.find((item) => item.BookId === updatedBook.BookId);
          if (savedBook) {
            this.book = { ...savedBook, ImageBase64: '' };
          }
          this.selectedImage = null;
          this.isSubmitting.set(false);
        },
        error: (error: Error) => {
          this.errMessage.set(error.message);
          this.isSubmitting.set(false);
        },
      });
    };

    if (!this.selectedImage) {
      saveBook();
      return;
    }

    this.readImage(this.selectedImage)
      .then(saveBook)
      .catch((error: Error) => {
        this.errMessage.set(error.message);
        this.isSubmitting.set(false);
      });
  }

  private loadBooks() {
    this._service.getBooks().subscribe({
      next: (books) => this.books.set(books),
      error: (error: Error) => this.errMessage.set(error.message),
    });
  }

  private readImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Không đọc được ảnh đã chọn.'));
        }
      };
      reader.onerror = () => reject(new Error('Không đọc được ảnh đã chọn.'));
      reader.readAsDataURL(file);
    });
  }
}
