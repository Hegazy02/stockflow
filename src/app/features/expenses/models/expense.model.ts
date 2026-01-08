export interface Expense {
  _id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExpenseFormBody {
  title: string;
  amount: number;
  category?: string;
  date?: string;
  note?: string;
}

export interface ExpenseStats {
  byCategory: {
    _id: string;
    totalAmount: number;
    count: number;
  }[];
  overall: {
    totalAmount: number;
    count: number;
  };
}

export interface ExpenseFilters {
  search?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
