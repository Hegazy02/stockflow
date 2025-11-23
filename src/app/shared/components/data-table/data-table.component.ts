import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChildren,
  QueryList,
  AfterViewInit,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { Popover } from 'primeng/popover';
import { ButtonModule } from 'primeng/button';
import { LucideAngularModule, Eye, Edit, Trash2, MoreVertical, Filter, X } from 'lucide-angular';
export interface FilterChange {
  field: string;
  value: string;
  filters: {
    [key: string]: string;
  };
}
export type ColumnType = 'text' | 'date' | 'datetime' | 'number' | 'currency' | 'boolean';

export interface TableColumn {
  field: string;
  header: string;
  filterable?: boolean;
  width?: string;
  type?: ColumnType;
  dateFormat?: string; // e.g., 'short', 'medium', 'long', 'full', or custom format like 'dd/MM/yyyy'
}

export interface TableAction {
  icon: any;
  label: string;
  command: (rowData: any) => void;
  styleClass?: string;
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
    LucideAngularModule,
    DatePipe,
  ],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent implements AfterViewInit {
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
  @Input() minHeight: string = 'auto';
  @Input() height: string = 'auto';
  @Input() showFilters: boolean = false;

  @Output() rowSelect = new EventEmitter<any>();
  @Output() filterChange = new EventEmitter<FilterChange>();

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

  ngAfterViewInit(): void {
    console.log('Popovers loaded:', this.popovers?.length);
  }

  onRowSelect(event: any): void {
    this.rowSelect.emit(this.selectedRows);
  }

  onRowUnselect(event: any): void {
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

    // Emit filter change event
    this.filterChange.emit({
      field,
      value,
      filters: { ...this.filterValues },
    });
  }

  clearFilter(table: any, field: string): void {
    this.filterValues[field] = '';
    table.filter('', field, 'contains');
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
  formatCellValue(value: any, column: TableColumn): any {
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
