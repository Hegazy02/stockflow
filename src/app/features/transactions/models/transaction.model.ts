export interface TransactionProduct {
  productId: string;
  _id: string;
  name: string;
  sku: string;
  quantity: number;
  costPrice?: number;
  sellingPrice?: number;
  price?: number;
  total?: number;
}

export enum TransactionType {
  SALES = 'sales',
  PURCHASES = 'purchases',
  RETURNS = 'returns',
  DEPOSIT_SUPPLIERS = 'deposit_suppliers',
  DEPOSIT_CUSTOMERS = 'deposit_customers',
  RETURN_PURCHASES = 'return_purchases',
  RETURN_SALES = 'return_sales',
}
export interface Transaction {
  _id: string;
  products?: TransactionProduct[];
  partnerId: string;
  transactionType: TransactionType;
  note?: string;
  balance: number;
  paid: number;
  left: number;
  productDisplay?: string;
  serialNumber?: string | null;
  totalQuantity?: number;
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
