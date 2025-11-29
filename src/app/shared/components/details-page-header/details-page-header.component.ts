import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ArrowLeft, Edit, Trash2, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-details-page-header',
  imports: [LucideAngularModule],
  templateUrl: './details-page-header.component.html',
  styleUrl: './details-page-header.component.scss',
})
export class DetailsPageHeaderComponent {
  @Input() hasEdit = true;
  @Input() hasDelete = true;

  @Output() back = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  ArrowLeft = ArrowLeft;
  Edit = Edit;
  Trash2 = Trash2;
}
