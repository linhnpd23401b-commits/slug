import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap, tap } from 'rxjs';
import { Fashion } from '../classes/Fashion';
import { extractIdFromSlug } from '../classes/SlugHelper';
import { FashionAPIService } from '../services/fashion-apiservice';

@Component({
  selector: 'app-fashion-detail-component',
  standalone: false,
  templateUrl: './fashion-detail-component.html',
  styleUrl: './fashion-detail-component.css',
})
export class FashionDetailComponent {
  fashion = signal<Fashion | null>(null);
  loading = signal(true);
  error = signal('');
  private destroyRef = inject(DestroyRef);

  constructor(route: ActivatedRoute, service: FashionAPIService) {
    route.paramMap.pipe(
      tap(() => { this.fashion.set(null); this.error.set(''); this.loading.set(true); }),
      switchMap(params => {
        const slug = params.get('slug') || '';
        const id = extractIdFromSlug(slug);
        if (id === null) {
          this.error.set('Đường dẫn Fashion không hợp lệ. Vui lòng chọn lại từ bộ sưu tập.');
          return of(null);
        }
        return service.getFashionByIdF(id).pipe(catchError((error: Error) => {
          this.error.set(error.message);
          return of(null);
        }));
      }),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(fashion => { this.fashion.set(fashion); this.loading.set(false); });
  }
}
