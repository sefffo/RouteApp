
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  loading = true;
  error = '';
  searchTerm = '';
  sortOption = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.http.get<any[]>('https://fakestoreapi.com/products').subscribe({
      next: (data) => {
        this.products = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load products.';
        this.loading = false;
      }
    });
  }

  applyFilters() {
    let filtered = this.products;
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p => p.title.toLowerCase().includes(term));
    }
    if (this.sortOption === 'price-asc') {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (this.sortOption === 'price-desc') {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    } else if (this.sortOption === 'name-asc') {
      filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    }
    this.filteredProducts = filtered;
  }

  onSearchChange(value: string) {
    this.searchTerm = value;
    this.applyFilters();
  }

  onSortChange(value: string) {
    this.sortOption = value;
    this.applyFilters();
  }

  goToProduct(product: any) {
    this.router.navigate(['/product', product.id]);
  }
}
