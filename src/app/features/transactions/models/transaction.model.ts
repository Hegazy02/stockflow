export interface TransactionProduct {
  productId: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  // Backend can return product details in two ways:
  // 1. Nested under 'product' (populated)
  product?: {
    _id: string;
    name: string;
    sku: string;
  };
  // 2. Directly on the object (flattened)
  name?: string;
  sku?: string;
}

export interface Transaction {
  _id: string;
  products: TransactionProduct[];
  partnerId: string;
  transactionType: 'addition' | 'subtraction';
  note?: string;
  balance: number;
  paid: number;
  partner?: {
    _id: string;
    name: string;
    type: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TransactionFormData {
  products: TransactionProduct[];
  partnerId: string;
  transactionType: 'addition' | 'subtraction';
  note?: string;
  balance: number;
  paid: number;
}
