import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { FashionDetailComponent } from './fashion-detail-component';
import { FashionAPIService } from '../services/fashion-apiservice';
import { Fashion } from '../classes/Fashion';

describe('FashionDetailComponent slug routing', () => {
  it('loads by IdF, handles route changes, invalid slugs and missing records', async () => {
    const params = new BehaviorSubject(convertToParamMap({ slug: 'same-name-p1' }));
    const requested: number[] = [];
    await TestBed.configureTestingModule({
      declarations: [FashionDetailComponent],
      imports: [CommonModule, RouterModule],
      providers: [provideRouter([]),
        { provide: ActivatedRoute, useValue: { paramMap: params } },
        { provide: FashionAPIService, useValue: { getFashionByIdF: (id: number) => {
          requested.push(id);
          return id === 99 ? throwError(() => new Error('Not found')) : of(new Fashion(String(id), 'Style', 'Same name', 'Detail ' + id, '', id));
        } } },
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(FashionDetailComponent);
    expect(fixture.componentInstance.fashion()?.IdF).toBe(1);
    params.next(convertToParamMap({ slug: 'same-name-p2' }));
    expect(fixture.componentInstance.fashion()?.fashion_detail).toBe('Detail 2');
    params.next(convertToParamMap({ slug: 'invalid' }));
    expect(fixture.componentInstance.fashion()).toBeNull();
    expect(fixture.componentInstance.error()).toContain('không hợp lệ');
    expect(requested).toEqual([1, 2]);
    params.next(convertToParamMap({ slug: 'missing-p99' }));
    expect(fixture.componentInstance.error()).toBe('Not found');
    params.next(convertToParamMap({ slug: 'same-name-p1' }));
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Detail 1');
    expect(fixture.componentInstance.error()).toBe('');
    fixture.destroy();
  });
});
