import { Component, Input, Output, EventEmitter, forwardRef, HostListener, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LucideAngularModule, ChevronDown, Loader2 } from 'lucide-angular';

export interface DropdownOption {
  [key: string]: any;
}

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true,
    },
  ],
})
export class DropdownComponent implements ControlValueAccessor, AfterViewChecked {
  @Input() options: DropdownOption[] = [];
  @Input() optionLabel: string = 'label';
  @Input() optionValue: string = 'value';
  @Input() placeholder: string = 'Select an option';
  @Input() filter: boolean = true;
  @Input() loading: boolean = false;
  @Input() disabled: boolean = false;
  @Input() emptyMessage: string = 'No options available';
  @Input() noResultsMessage: string = 'No results found';

  @Output() onChange = new EventEmitter<any>();

  @ViewChild('filterInput') filterInput?: ElementRef<HTMLInputElement>;

  isOpen: boolean = false;
  filterText: string = '';
  selectedValue: any = null;
  highlightedIndex: number = -1;

  readonly ChevronDown = ChevronDown;
  readonly Loader2 = Loader2;

  private onChangeFn: (value: any) => void = () => {};
  private onTouchedFn: () => void = () => {};
  private shouldFocusFilter: boolean = false;

  constructor(private elementRef: ElementRef) {}

  ngAfterViewChecked(): void {
    // Auto-focus filter input when dropdown opens
    if (this.shouldFocusFilter && this.filterInput) {
      setTimeout(() => {
        this.filterInput?.nativeElement.focus();
        this.shouldFocusFilter = false;
      }, 0);
    }
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    this.selectedValue = value;
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  toggleDropdown(): void {
    if (this.disabled) return;
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.filterText = '';
      this.highlightedIndex = -1;
      this.shouldFocusFilter = true;
    }
  }

  onFilterChange(value: string): void {
    this.filterText = value;
    this.highlightedIndex = -1;
  }

  getDisplayLabel(): string {
    if (this.selectedValue === null || this.selectedValue === undefined) {
      return this.placeholder;
    }
    const selectedOption = this.options.find(opt => opt[this.optionValue] === this.selectedValue);
    return selectedOption ? selectedOption[this.optionLabel] : this.placeholder;
  }

  getFilteredOptions(): DropdownOption[] {
    if (!this.filterText) {
      return this.options;
    }
    const filterLower = this.filterText.toLowerCase();
    return this.options.filter(option => 
      option[this.optionLabel]?.toString().toLowerCase().includes(filterLower)
    );
  }

  selectOption(option: DropdownOption): void {
    const value = option[this.optionValue];
    this.selectedValue = value;
    this.onChangeFn(value);
    this.onTouchedFn();
    this.onChange.emit(value);
    this.isOpen = false;
  }

  onKeyDown(event: KeyboardEvent): void {
    const filteredOptions = this.getFilteredOptions();

    switch (event.key) {
      case 'Enter':
      case ' ':
        if (!this.isOpen) {
          event.preventDefault();
          this.toggleDropdown();
        } else if (this.highlightedIndex >= 0 && this.highlightedIndex < filteredOptions.length) {
          event.preventDefault();
          this.selectOption(filteredOptions[this.highlightedIndex]);
        }
        break;
      case 'Escape':
        event.preventDefault();
        this.isOpen = false;
        this.filterText = '';
        this.highlightedIndex = -1;
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen) {
          this.toggleDropdown();
        } else {
          this.highlightedIndex = Math.min(this.highlightedIndex + 1, filteredOptions.length - 1);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (this.isOpen) {
          this.highlightedIndex = Math.max(this.highlightedIndex - 1, 0);
        }
        break;
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
      this.filterText = '';
      this.highlightedIndex = -1;
    }
  }
}
