import { Component, EventEmitter, input, Output } from '@angular/core';

@Component({
  selector: 'app-form-actions',
  templateUrl: './form-actions.component.html',
  styleUrl: './form-actions.component.scss',
})
export class FormActionsComponent {
  disabled = input<boolean>();
  loading = input<boolean | null>();
  submitText = input<string>();

  @Output() cancel = new EventEmitter<void>();
}
