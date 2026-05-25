// core/services/product.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, shareReplay, retry } from 'rxjs/operators';
import { Product, ProductFilters } from '../models/product.model';

@Injectable({ providedIn: 'root' })
  export class ProductService {
  private http = inject(HttpClient);
  private baseUrl = '/api/products';

  private allProducts$ = this.http.get<Product[]>(this.baseUrl).
    pipe(retry(2),shareReplay(1),
    catchError(err => throwError(() => new Error(`Blad API: ${err.message}`)))
  );

  getAll(): Observable<Product[]> {
    return this.allProducts$;
  }

  getFiltered(filters: ProductFilters): Observable<Product[]> {
    let params = new HttpParams();
    if (filters.category) params = params.set('category', filters.category);
    if (filters.minPrice) params = params.set('price_gte', String(filters.minPrice));
    if (filters.maxPrice) params = params.set('price_lte', String(filters.maxPrice));

    return this.http.get<Product[]>(this.baseUrl, { params }).pipe(
      map(products => products.filter(p => p.active)),
      catchError(err => throwError(() => err))
    );
  }
  create(product: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, product);
  }
  update(id: number, changes: Partial<Product>): Observable<Product> 
  {
    return this.http.patch<Product>(`${this.baseUrl}/${id}`, changes);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}