import { Component, Input, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { Popover } from 'primeng/popover';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { LucideAngularModule, Eye, Edit, Trash2, MoreVertical, Filter, X } from 'lucide-angular';
import { DropdownComponent } from '../dropdown/dropdown.component';
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

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    FormsModule,
    TableModule,
    InputTextModule,
    Popover,
    ButtonModule,
    PaginatorModule,
    LucideAngularModule,
    DropdownComponent,
  ],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() actions: TableAction[] = [];
  @Input() loading: boolean = false;
  @Input() paginator: boolean = true;
  @Input() rows: number = 10;
  @Input() rowsPerPageOptions: number[] = [5, 10, 20, 50];
  @Input() globalFilterFields: string[] = [];
  @Input() showActions: boolean = true;
  @Input() selectionMode: 'single' | 'multiple' | null = null;
  @Input() dataKey: string = 'id';
  @Input() showFilters: boolean = false;
  @Input() totalRecords: number = 0;
  @Input() currentPage: number = 1;
  @Input() pageSize: number = 10;
  @Input() scrollable: boolean = true; // Enable fixed height with scrolling
  @Input() height: string = 'calc(100vh - 100px)'; // Default scroll height

  @Output() rowSelect = new EventEmitter<any>();
  @Output() filterChange = new EventEmitter<FilterChange>();
  @Output() pageChange = new EventEmitter<PageChangeEvent>();

  selectedRows: any[] = [];
  filterValues: { [key: string]: string } = {};

  @ViewChildren(Popover) popovers!: QueryList<Popover>;

  // Lucide icons
  readonly Eye = Eye;
  readonly Edit = Edit;
  readonly Trash2 = Trash2;
  readonly MoreVertical = MoreVertical;
  readonly Filter = Filter;
  readonly X = X;

  get first(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  get last(): number {
    return Math.min(this.first + this.pageSize, this.totalRecords);
  }

  onPageChange(event: any): void {
    const page = Math.floor(event.first / event.rows) + 1;
    this.pageChange.emit({
      page,
      pageSize: event.rows,
      first: event.first,
    });
  }

  onRowSelect(event: any): void {
    this.rowSelect.emit(this.selectedRows);
  }

  onRowUnselect(event: any): void {
    this.rowSelect.emit(this.selectedRows);
  }
  onHeaderCheckboxToggle(event: any): void {
    if (event.checked) {
      this.selectedRows = [...this.data];
    } else {
      this.selectedRows = [];
    }
    this.rowSelect.emit(this.selectedRows);
  }
  executeAction(action: TableAction, rowData: any): void {
    action.command(rowData);
  }

  toggleFilterPopover(event: Event, field: string): void {
    const popover = this.getPopoverByField(field);
    if (popover) {
      popover.toggle(event);
    }
  }

  hideFilterPopover(field: string): void {
    const popover = this.getPopoverByField(field);
    if (popover) {
      popover.hide();
    }
  }

  private getPopoverByField(field: string): Popover | undefined {
    if (!this.popovers) return undefined;

    return this.popovers.find((popover: any) => {
      const element = popover.el?.nativeElement;
      return element?.getAttribute('data-field') === field;
    });
  }

  applyFilter(table: any, field: string, value: string): void {
    this.filterValues[field] = value;
    
    // Update dropdown config selectedValue if this is a dropdown filter
    const column = this.columns.find(col => col.field === field);
    if (column?.dropdownConfig) {
      column.dropdownConfig.selectedValue = value;
    }
    
    // Don't call table.filter() - we're doing server-side filtering
    // The parent component will handle the filtering via the filterChange event

    // Emit filter change event
    this.filterChange.emit({
      field,
      value,
      filters: { ...this.filterValues },
    });
  }

  clearFilter(table: any, field: string): void {
    this.filterValues[field] = '';
    
    // Clear dropdown config selectedValue if this is a dropdown filter
    const column = this.columns.find(col => col.field === field);
    if (column?.dropdownConfig) {
      column.dropdownConfig.selectedValue = null;
    }
    
    // Don't call table.filter() - we're doing server-side filtering
    this.hideFilterPopover(field);

    // Emit filter change event
    this.filterChange.emit({
      field,
      value: '',
      filters: { ...this.filterValues },
    });
  }

  hasActiveFilter(field: string): boolean {
    return !!this.filterValues[field];
  }

  /**
   * Format cell value based on column type
   */
  formatCellValue(rowData: any, column: TableColumn): any {
    const value = this.getNestedValue(rowData, column.field);

    if (value === null || value === undefined) {
      return '-';
    }

    switch (column.type) {
      case 'date':
      case 'datetime':
        return this.formatDate(value, column.dateFormat || 'short');
      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : value;
      case 'currency':
        return typeof value === 'number'
          ? `$${value.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`
          : value;
      case 'boolean':
        return value ? '✓' : '✗';
      default:
        return value;
    }
  }
  /**
   * Get nested property value using dot notation
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, prop) => current?.[prop], obj);
  }

  /**
   * Format date value
   */
  private formatDate(value: any, format: string): string {
    try {
      const date = value instanceof Date ? value : new Date(value);
      if (isNaN(date.getTime())) {
        return value;
      }

      const datePipe = new DatePipe('en-US');
      return datePipe.transform(date, format) || value;
    } catch {
      return value;
    }
  }
}
