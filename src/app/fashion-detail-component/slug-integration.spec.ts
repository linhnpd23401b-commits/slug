import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AppModule } from '../app-module';
import { App } from '../app';

describe('Existing product slug exercise with Fashion', () => {
  it('renders Fashion inside /products and opens its slug detail', async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule],
      providers: [provideHttpClientTesting()],
    }).compileComponents();
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    const http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    await router.navigateByUrl('/products');
    fixture.detectChanges();
    http.expectOne('datasets/products.json').flush([{ id: 1, name: 'Phone', price: 10 }]);
    fixture.detectChanges();
    http.expectOne('/fashions').flush([{ _id: 'abc', IdF: 12, style: 'Summer', fashion_subject: 'Đầm đẹp', fashion_detail: 'Exact fashion detail', fashion_image: '' }]);
    fixture.detectChanges();
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('a.slug');
    expect(link.getAttribute('href')).toBe('/fashion-detail/dam-dep-p12');
    expect(fixture.nativeElement.textContent).toContain('Phone');
    expect(fixture.nativeElement.textContent).toContain('#12');
    await router.navigateByUrl(link.getAttribute('href')!);
    http.expectOne('/fashions/by-idf/12').flush({ _id: 'abc', IdF: 12, style: 'Summer', fashion_subject: 'Đầm đẹp', fashion_detail: 'Exact fashion detail', fashion_image: '' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Exact fashion detail');
    http.verify();
    fixture.destroy();
  });
});
