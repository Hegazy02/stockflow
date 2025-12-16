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

export enum TransactionType {
  SALES = 'sales',
  PURCHASES = 'purchases',
  DEPOSIT_SUPPLIERS = 'deposit_suppliers',
  DEPOSIT_CUSTOMERS = 'deposit_customers',
}
export interface Transaction {
  _id: string;
  products: TransactionProduct[];
  partnerId: string;
  transactionType: TransactionType;
  note?: string;
  balance: number;
  paid: number;
  left: number;
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
  transactionType: TransactionType;
  note?: string;
  balance: number;
  paid: number;
}
