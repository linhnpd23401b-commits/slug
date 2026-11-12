import { Component, signal } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Book, IBook } from '../classes/Ibook';
import { BookAPIService } from '../services/book-apiservice';

@Component({
  selector: 'app-book-new-component',
  standalone: false,
  templateUrl: './book-new-component.html',
  styleUrl: './book-new-component.css',
})
export class BookNewComponent {
  book = new Book();
  books = signal<IBook[]>([]);
  errMessage = signal('');
  isSubmitting = signal(false);
  readonly serverImagesLink = 'http://localhost:3000/image';
  private selectedImage: File | null = null;

  constructor(private _service: BookAPIService) {
    this.loadBooks();
  }

  postBook(form: NgForm) {
    this.errMessage.set('');
    if (form.invalid) {
      this.errMessage.set('Vui lòng nhập mã sách, tên sách và giá hợp lệ.');
      form.form.markAllAsTouched();
      return;
    }
    if (!this.selectedImage) {
      this.errMessage.set('Vui lòng chọn ảnh sách.');
      return;
    }

    this.isSubmitting.set(true);
    this.readImage(this.selectedImage)
      .then((imageBase64) => {
        const newBook = { ...this.book, ImageBase64: imageBase64 };
        this._service.postBook(newBook).subscribe({
          next: (books) => {
            this.books.set(books);
            this.book = new Book();
            this.selectedImage = null;
            form.resetForm(this.book);
            this.isSubmitting.set(false);
          },
          error: (error: Error) => {
            this.errMessage.set(error.message);
            this.isSubmitting.set(false);
          },
        });
      })
      .catch((error: Error) => {
        this.errMessage.set(error.message);
        this.isSubmitting.set(false);
      });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.errMessage.set('');
    this.selectedImage = null;
    this.book.Image = '';
    this.book.ImageBase64 = '';

    if (!file) {
      return;
    }
    if (!file.type.startsWith('image/')) {
      input.value = '';
      this.errMessage.set('Vui lòng chọn tệp hình ảnh.');
      return;
    }

    this.selectedImage = file;
    this.book.Image = file.name;
  }

  private loadBooks() {
    this._service.getBooks().subscribe({
      next: (data) => this.books.set(data),
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
