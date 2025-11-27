export interface Warehouse {
  _id: string;
  title: string;
  location: string;
  // manager: WarehouseManager;
  manager: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}
export interface WarehouseManager {
  _id: string;
  name: string;
}
