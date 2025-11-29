import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-list-page-header',
  templateUrl: './list-page-header.component.html',
  styleUrl: './list-page-header.component.scss',
})
export class ListPageHeaderComponent {
  @Input() title: string = '';
  @Input() addContent: string = '';
  @Input() selectedCount: number = 0;

  @Output() bulkDelete = new EventEmitter<void>();
  @Output() add = new EventEmitter<void>();

  onBulkDelete() {
    this.bulkDelete.emit();
  }

  onAdd() {
    this.add.emit();
  }
}
