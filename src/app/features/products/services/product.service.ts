import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private products: Product[] = [];
  private nextId = 1;

  constructor() {
    // Initialize with some mock data for development
    this.products = [
      {
        id: '1',
        name: 'Laptop',
        sku: 'LAP-001',
        description: 'High-performance laptop',
        category: 'Electronics',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: '2',
        name: 'Office Chair',
        sku: 'CHR-001',
        description: 'Ergonomic office chair',
        category: 'Furniture',
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
      },
    ];
    this.nextId = 3;
  }

  getAll(): Observable<Product[]> {
    try {
      return of([...this.products]).pipe(delay(100));
    } catch (error) {
      return throwError(() => ({
        code: 'FETCH_ERROR',
        message: 'Failed to retrieve products',
        originalError: error,
      }));
    }
  }

  getById(id: string): Observable<Product> {
    try {
      const product = this.products.find((p) => p.id === id);

      if (!product) {
        return throwError(() => ({
          code: 'NOT_FOUND',
          message: `Product with id ${id} not found`,
        }));
      }

      return of({ ...product }).pipe(delay(100));
    } catch (error) {
      return throwError(() => ({
        code: 'FETCH_ERROR',
        message: 'Failed to retrieve product',
        originalError: error,
      }));
    }
  }

  create(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Observable<Product> {
    try {
      // Validate required fields
      if (!product.name || !product.sku) {
        return throwError(() => ({
          code: 'VALIDATION_ERROR',
          message: 'Product name and SKU are required',
        }));
      }

      // Check for duplicate SKU
      const existingSku = this.products.find((p) => p.sku === product.sku);
      if (existingSku) {
        return throwError(() => ({
          code: 'DUPLICATE_SKU',
          message: `Product with SKU ${product.sku} already exists`,
        }));
      }

      const now = new Date();
      const newProduct: Product = {
        ...product,
        id: String(this.nextId++),
        createdAt: now,
        updatedAt: now,
      };

      this.products.push(newProduct);
      return of({ ...newProduct }).pipe(delay(100));
    } catch (error) {
      return throwError(() => ({
        code: 'CREATE_ERROR',
        message: 'Failed to create product',
        originalError: error,
      }));
    }
  }

  update(product: Product): Observable<Product> {
    try {
      const index = this.products.findIndex((p) => p.id === product.id);

      if (index === -1) {
        return throwError(() => ({
          code: 'NOT_FOUND',
          message: `Product with id ${product.id} not found`,
        }));
      }

      // Validate required fields
      if (!product.name || !product.sku) {
        return throwError(() => ({
          code: 'VALIDATION_ERROR',
          message: 'Product name and SKU are required',
        }));
      }

      // Check for duplicate SKU (excluding current product)
      const existingSku = this.products.find((p) => p.sku === product.sku && p.id !== product.id);
      if (existingSku) {
        return throwError(() => ({
          code: 'DUPLICATE_SKU',
          message: `Product with SKU ${product.sku} already exists`,
        }));
      }

      const updatedProduct: Product = {
        ...product,
        updatedAt: new Date(),
      };

      this.products[index] = updatedProduct;
      return of({ ...updatedProduct }).pipe(delay(100));
    } catch (error) {
      return throwError(() => ({
        code: 'UPDATE_ERROR',
        message: 'Failed to update product',
        originalError: error,
      }));
    }
  }

  delete(ids: string[]): Observable<{ ids: string[] }> {
    try {
      // Simulate delay for async behavior
      return of(ids).pipe(
        delay(100),
        map((deletedIds) => ({ ids: deletedIds }))
      );
    } catch (error) {
      return throwError(() => ({
        code: 'DELETE_ERROR',
        message: 'Failed to delete product',
        originalError: error,
      }));
    }
  }
}
