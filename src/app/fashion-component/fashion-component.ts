import { Component, signal } from '@angular/core';
import { FashionAPIService } from '../services/fashion-apiservice';
import { Fashion } from '../classes/Fashion';
import { createSlug } from '../classes/SlugHelper';

@Component({
  selector: 'app-fashion-component',
  standalone: false,
  templateUrl: './fashion-component.html',
  styleUrl: './fashion-component.css',
})
export class FashionComponent {
  generateSlug = createSlug;
  loading = signal(true);
  fashions=signal<Fashion[]>([]);
  errMessage=signal('')
  constructor(public _service: FashionAPIService){
    this._service.getFashions().subscribe({
      next: (data) => { this.fashions.set(data); this.loading.set(false); },
      error: (err: Error) => { this.errMessage.set(err.message); this.loading.set(false); },
    })
  }
}
