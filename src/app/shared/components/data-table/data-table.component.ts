import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { LucideAngularModule, Eye, Edit, Trash2, MoreVertical } from 'lucide-angular';

export type ColumnType = 'text' | 'date' | 'datetime' | 'number' | 'currency' | 'boolean';

export interface TableColumn {
  field: string;
  header: string;
  sortable?: boolean;
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
  imports: [TableModule, LucideAngularModule, DatePipe],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
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
  
  @Output() rowSelect = new EventEmitter<any>();
  @Output() rowUnselect = new EventEmitter<any>();
  
  selectedRows: any[] = [];
  
  // Lucide icons
  readonly Eye = Eye;
  readonly Edit = Edit;
  readonly Trash2 = Trash2;
  readonly MoreVertical = MoreVertical;

  onRowSelect(event: any): void {
    this.rowSelect.emit(event.data);
  }

  onRowUnselect(event: any): void {
    this.rowUnselect.emit(event.data);
  }

  executeAction(action: TableAction, rowData: any): void {
    action.command(rowData);
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
        return typeof value === 'number' ? `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : value;
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
