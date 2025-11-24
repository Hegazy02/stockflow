# API Integration Guide

## Overview

The application is now connected to the backend API at `http://localhost:3000/api`.

## API Endpoints

### Products API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get product by ID |
| POST | `/api/products` | Create a new product |
| PUT | `/api/products/:id` | Update an existing product |
| DELETE | `/api/products/:id` | Delete a single product |
| POST | `/api/products/bulk-delete` | Delete multiple products |

## Service Implementation

**File:** `src/app/features/products/services/product.service.ts`

The ProductService handles all HTTP requests to the backend API:

```typescript
// Get all products
getAll(): Observable<Product[]>

// Get product by ID
getById(id: string): Observable<Product>

// Create new product
create(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Observable<Product>

// Update product
update(product: Product): Observable<Product>

// Delete product(s)
delete(ids: string[]): Observable<{ ids: string[] }>
```

## Features

### Date Conversion
All date fields (`createdAt`, `updatedAt`) are automatically converted from ISO strings to JavaScript Date objects.

### Error Handling
The service includes comprehensive error handling:
- HTTP status code mapping
- Custom error codes (NOT_FOUND, VALIDATION_ERROR, DUPLICATE_SKU, etc.)
- User-friendly error messages

### Bulk Operations
- Single delete: Uses `DELETE /api/products/:id`
- Multiple delete: Uses `POST /api/products/bulk-delete` with request body `{ ids: [...] }`

#### Bulk Delete Request Example
```json
POST /api/products/bulk-delete
{
  "ids": ["507f1f77bcf86cd799439013", "507f1f77bcf86cd799439014"]
}
```

#### Bulk Delete Response Example
```json
{
  "success": true,
  "message": "2 product(s) deleted successfully",
  "data": {
    "deletedCount": 2,
    "requestedCount": 2
  }
}
```

## Configuration

### Environment Variables

**File:** `src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

### HTTP Client Setup

**File:** `src/app/app.config.ts`

HttpClient is provided globally with:
```typescript
provideHttpClient(withInterceptorsFromDi())
```

## NgRx Integration

The service is integrated with NgRx effects:

**File:** `src/app/features/products/store/products.effects.ts`

- `LoadProducts$` - Loads all products on app init
- `CreateProduct$` - Creates new product
- `UpdateProduct$` - Updates existing product
- `DeleteProducts$` - Deletes one or more products

## Usage Example

### In Components

```typescript
// The service is used through NgRx actions
this.store.dispatch(loadProducts());
this.store.dispatch(createProduct({ product }));
this.store.dispatch(updateProduct({ product }));
this.store.dispatch(deleteProducts({ ids: ['1', '2'] }));
```

### Direct Service Usage (if needed)

```typescript
constructor(private productService: ProductService) {}

// Get all products
this.productService.getAll().subscribe(
  products => console.log(products),
  error => console.error(error)
);
```

## Error Codes

| Code | Description |
|------|-------------|
| `NOT_FOUND` | Resource not found (404) |
| `VALIDATION_ERROR` | Invalid request data (400) |
| `DUPLICATE_SKU` | SKU already exists (409) |
| `SERVER_ERROR` | Internal server error (500) |
| `CLIENT_ERROR` | Client-side error |
| `HTTP_XXX` | Generic HTTP error with status code |

## Testing the Integration

1. **Start the backend server:**
   ```bash
   # Make sure your backend is running on http://localhost:3000
   ```

2. **Start the Angular app:**
   ```bash
   npm start
   ```

3. **Test the features:**
   - View products list
   - Create a new product
   - Edit an existing product
   - Delete a product
   - Bulk delete products

## Notes

- All API calls are asynchronous using RxJS Observables
- The service automatically handles date conversion
- Error handling is centralized in the service
- The app uses NgRx for state management, so all data flows through the store

## Future Enhancements

- Add request/response interceptors for authentication
- Implement retry logic for failed requests
- Add request caching
- Implement optimistic updates
- Add loading indicators
- Implement pagination for large datasets
