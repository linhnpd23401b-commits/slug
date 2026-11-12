import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { FashionAPIService } from '../services/fashion-apiservice';
import { SearchFashion } from './search-fashion';

describe('SearchFashion', () => {
  let component: SearchFashion;
  let fixture: ComponentFixture<SearchFashion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchFashion],
      imports: [CommonModule, FormsModule],
      providers: [
        {
          provide: FashionAPIService,
          useValue: { getFashions: () => of([]) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchFashion);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should rank results by Jaccard similarity and apply the matching threshold class', () => {
    component.fashions = [
      {
        _id: 'low',
        IdF: 1,
        style: 'style',
        fashion_subject: 'red blue green yellow',
        fashion_detail: '',
        fashion_image: '',
      },
      {
        _id: 'high',
        IdF: 2,
        style: 'style',
        fashion_subject: 'red blue',
        fashion_detail: '',
        fashion_image: '',
      },
      {
        _id: 'middle',
        IdF: 3,
        style: 'style',
        fashion_subject: 'red blue green',
        fashion_detail: '',
        fashion_image: '',
      },
    ];
    component.keyword = 'red blue';

    component.onSearch();

    expect(component.filteredFashions.map((fashion) => fashion._id)).toEqual([
      'high',
      'middle',
      'low',
    ]);
    expect(component.filteredFashions.map((fashion) => fashion.jaccardScore)).toEqual([
      1,
      0.6667,
      0.5,
    ]);
    expect(component.getRowClass(0.75)).toBe('bg-pink');
    expect(component.getRowClass(0.5)).toBe('bg-yellow');
    expect(component.getRowClass(0.4999)).toBe('bg-gray');
  });

  it('should tokenize Vietnamese text without losing accented characters', () => {
    expect(component.calculateJaccard('áo dài', 'áo dài cưới')).toBeCloseTo(2 / 3);
  });
});
