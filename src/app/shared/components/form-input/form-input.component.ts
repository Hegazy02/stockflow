import { Component, Input, forwardRef, Injector, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  NgControl,
  ValidationErrors,
} from '@angular/forms';
import { LucideAngularModule, AlertCircle } from 'lucide-angular';
import { ErrorMessageComponent } from '../error-message/error-message.component';

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, ErrorMessageComponent],
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputComponent),
      multi: true,
    },
  ],
})
export class FormInputComponent implements ControlValueAccessor, OnInit {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() type: 'text' | 'email' | 'password' | 'number' | 'textarea' = 'text';
  @Input() helpText: string = '';
  @Input() required: boolean = false;
  @Input() rows: number = 4;
  @Input() minLength?: number;
  @Input() maxLength?: number;
  @Input() pattern?: string;

  readonly AlertCircle = AlertCircle;

  value: string = '';
  disabled: boolean = false;
  ngControl?: NgControl;

  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  constructor(private injector: Injector) {}

  ngOnInit(): void {
    // Get NgControl after initialization to avoid circular dependency
    this.ngControl = this.injector.get(NgControl, null) || undefined;
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  onBlur(): void {
    this.onTouched();
  }

  get showError(): boolean {
    return !!(
      this.ngControl &&
      this.ngControl.invalid &&
      (this.ngControl.touched || this.ngControl.dirty)
    );
  }

  get errorMessage(): string {
    if (!this.ngControl || !this.ngControl.errors) {
      return '';
    }

    const errors: ValidationErrors = this.ngControl.errors;
    const fieldLabel = this.label || 'This field';

    if (errors['required']) {
      return `${fieldLabel} is required`;
    }

    if (errors['minlength']) {
      const minLength = errors['minlength'].requiredLength;
      return `${fieldLabel} must be at least ${minLength} characters`;
    }

    if (errors['maxlength']) {
      const maxLength = errors['maxlength'].requiredLength;
      return `${fieldLabel} must not exceed ${maxLength} characters`;
    }

    if (errors['email']) {
      return 'Please enter a valid email address';
    }

    if (errors['pattern']) {
      if (this.type === 'email') {
        return 'Please enter a valid email address';
      }
      return `${fieldLabel} format is invalid`;
    }

    if (errors['min']) {
      return `${fieldLabel} must be at least ${errors['min'].min}`;
    }

    if (errors['max']) {
      return `${fieldLabel} must not exceed ${errors['max'].max}`;
    }

    // Return first error key if no specific message
    return `${fieldLabel} is invalid`;
  }
}
