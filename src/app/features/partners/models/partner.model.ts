export interface Partner {
  _id: string;
  name: string;
  phoneNumber: string;
  description?: string;
  type: 'Supplier' | 'Customer';
  createdAt?: string;
  updatedAt?: string;
}
