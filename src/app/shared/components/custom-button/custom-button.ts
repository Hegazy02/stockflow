import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LucideAngularModule, LucideIconData } from 'lucide-angular';
import { Undo2 } from 'lucide-angular';

@Component({
  selector: 'app-custom-button',
  imports: [LucideAngularModule],
  templateUrl: './custom-button.html',
  styleUrl: './custom-button.scss',
})
export class CustomButtonComponent {
  @Input() btnClass:
    | 'btn-danger'
    | 'btn-primary'
    | 'btn-success'
    | 'btn-warning'
    | 'btn-info'
    | 'btn-light'
    | 'btn-dark'
    | 'btn-secondary' = 'btn-primary';
  @Input() icon: LucideIconData = Undo2;
  @Input() label: string = 'Return';
  @Input() disabled: boolean = false;

  @Output() onClick = new EventEmitter<void>();

  onClickButton() {
    this.onClick.emit();
  }
}
