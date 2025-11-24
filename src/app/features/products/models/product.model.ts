export interface Product {
  _id: string;
  name: string;
  sku: string;
  category: ProductCategory;
  description: string;
  createdAt: string;
  updatedAt: string;
}
export interface ProductCategory {
  _id: string;
  name: string;
}
