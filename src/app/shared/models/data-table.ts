export interface FilterChange {
  field: string;
  value: string;
  filters: {
    [key: string]: string;
  };
}

export interface PageChangeEvent {
  page: number;
  pageSize: number;
  first: number;
}

export type ColumnType = 'text' | 'date' | 'datetime' | 'number' | 'currency' | 'boolean';
export type FilterType = 'text' | 'dropdown';
export interface TableColumn {
  field: string;
  header: string;
  filterable?: boolean;
  width?: string;
  type?: ColumnType;
  dateFormat?: string; // e.g., 'short', 'medium', 'long', 'full', or custom format like 'dd/MM/yyyy'
  filterTypes?: FilterType[];
  // Add filterType property
  dropdownConfig?: DropDownConfig;
}

export interface TableAction {
  icon: any;
  label: string;
  command: (rowData: any) => void;
  styleClass?: string;
}
export interface DropDownConfig {
  options: any[];
  optionLabel: string;
  optionValue: string;
  selectedValue: null | string;
}
