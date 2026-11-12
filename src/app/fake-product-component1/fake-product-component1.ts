import { Component, OnInit, signal } from '@angular/core';
import { IFakeProduct } from '../classes/IFakeProduct';
import { FakeProductService } from '../services/fake-product-service';

@Component({
  selector: 'app-fake-product-component1',
  standalone: false,
  styleUrl: './fake-product-component1.css',
  templateUrl: './fake-product-component1.html',
})
export class FakeProductComponent1 implements OnInit {
  products = signal<IFakeProduct[]>([]);
  errMessage = signal('');

  constructor(private readonly productService: FakeProductService) {}

  ngOnInit(): void {
    this.productService.getFakeProductData().subscribe({
      next: (products) => this.products.set(products),
      error: (error: Error) => this.errMessage.set(error.message),
    });
  }
}
