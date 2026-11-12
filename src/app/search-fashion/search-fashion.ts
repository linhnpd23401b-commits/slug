import { Component, OnInit } from '@angular/core';
import { FashionAPIService } from '../services/fashion-apiservice';
import { Fashion } from '../classes/Fashion';

type FashionSearchResult = Fashion & { jaccardScore: number };

@Component({
  selector: 'app-search-fashion',
  standalone: false,
  templateUrl: './search-fashion.html',
  styleUrl: './search-fashion.css',
})
export class SearchFashion implements OnInit {
  fashions: Fashion[] = [];
  filteredFashions: FashionSearchResult[] = [];

  keyword = '';
  searchField: 'fashion_subject' | 'fashion_detail' = 'fashion_subject';
  limit = 10;
  loading = false;
  errorMessage = '';

  constructor(private fashionService: FashionAPIService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.errorMessage = '';
    this.fashionService.getFashions().subscribe({
      next: (data) => {
        this.fashions = data;
        this.onSearch();
        this.loading = false;
      },
      error: (error: Error) => {
        this.errorMessage = `Không thể tải dữ liệu Fashion: ${error.message}`;
        this.loading = false;
      },
    });
  }

  calculateJaccard(query: string, text: string): number {
    const tokenize = (value: string): Set<string> =>
      new Set(value.toLocaleLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []);

    const queryTokens = tokenize(query);
    const textTokens = tokenize(text);
    const union = new Set([...queryTokens, ...textTokens]).size;

    if (union === 0) {
      return 0;
    }

    let intersection = 0;
    queryTokens.forEach((token) => {
      if (textTokens.has(token)) {
        intersection++;
      }
    });

    return intersection / union;
  }

  onSearch(): void {
    const query = this.keyword.trim();
    const results = this.fashions.map((fashion) => {
      const text =
        this.searchField === 'fashion_subject'
          ? fashion.fashion_subject
          : fashion.fashion_detail;
      const score = query ? this.calculateJaccard(query, text) : 0;

      return {
        ...fashion,
        jaccardScore: Number(score.toFixed(4)),
      };
    });

    results.sort((left, right) => right.jaccardScore - left.jaccardScore);
    this.filteredFashions = results.slice(0, this.limit);
  }

  getRowClass(score: number): string {
    if (score >= 0.75) {
      return 'bg-pink';
    }

    return score >= 0.5 ? 'bg-yellow' : 'bg-gray';
  }
}