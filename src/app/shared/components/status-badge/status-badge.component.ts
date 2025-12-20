import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TransactionType } from '../../../features/transactions/models/transaction.model';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.component.html',
  styleUrls: ['./status-badge.component.scss'],
  imports: [TagModule],
})
export class StatusBadgeComponent implements OnChanges {
  @Input() value: any;

  // final label and color
  label: string = '';
  severity: 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' = 'info';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value']) {
      this.updateBadge();
    }
  }

  private updateBadge() {
    this.label = this.value;

    switch (this.value) {
      case TransactionType.SALES:
      case "Customer":
        this.severity = 'success';
        break;
      case TransactionType.PURCHASES:
      case "Supplier":
        this.severity = 'danger';
        break;
      case TransactionType.DEPOSIT_CUSTOMERS:
        this.severity = 'warn';
        this.label = 'Deposit (Customer)';
        break;
      case TransactionType.DEPOSIT_SUPPLIERS:
        this.severity = 'warn';
        this.label = 'Deposit (Supplier)';
        break;
      default:
        this.severity = 'info';
    }
  }
}
