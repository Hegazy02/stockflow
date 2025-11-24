import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, takeUntil, filter } from 'rxjs';
import { Product } from '../../models/product.model';
import { selectProductById } from '../../store/products.selectors';
import { createProduct, updateProduct } from '../../store/products.actions';
import { LucideAngularModule, ArrowLeft, Save, X } from 'lucide-angular';
import { FormInputComponent } from '../../../../shared/components/form-input/form-input.component';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, FormInputComponent],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit, OnDestroy {
  productForm: FormGroup;
  isEditMode = false;
  productId: string | null = null;
  private destroy$ = new Subject<void>();

  // Lucide icons
  readonly ArrowLeft = ArrowLeft;
  readonly Save = Save;
  readonly X = X;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      sku: ['', [Validators.required, Validators.pattern(/^[A-Z0-9-]+$/)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');

    if (this.productId) {
      this.isEditMode = true;
      this.loadProduct(this.productId);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadProduct(id: string): void {
    this.store
      .select(selectProductById(id))
      .pipe(
        takeUntil(this.destroy$),
        filter((product): product is Product => product !== undefined)
      )
      .subscribe((product) => {
        this.productForm.patchValue({
          name: product.name,
          sku: product.sku,
          description: product.description,
          category: product.category,
        });
      });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const formValue = this.productForm.value;

    if (this.isEditMode && this.productId) {
      this.store
        .select(selectProductById(this.productId))
        .pipe(
          takeUntil(this.destroy$),
          filter((product): product is Product => product !== undefined)
        )
        .subscribe((product) => {
          const updatedProduct: Product = {
            ...product,
            ...formValue,
            updatedAt: new Date(),
          };
          this.store.dispatch(updateProduct({ product: updatedProduct }));
          this.navigateToList();
        });
    } else {
      this.store.dispatch(createProduct({ product: formValue }));
      this.navigateToList();
    }
  }

  onCancel(): void {
    this.navigateToList();
  }

  navigateToList(): void {
    this.router.navigate(['/products']);
  }

  getErrorMessage(fieldName: string): string {
    const control = this.productForm.get(fieldName);

    if (!control || !control.errors || !control.touched) {
      return '';
    }

    if (control.errors['required']) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }

    if (control.errors['minlength']) {
      const minLength = control.errors['minlength'].requiredLength;
      return `${this.getFieldLabel(fieldName)} must be at least ${minLength} characters`;
    }

    if (control.errors['pattern']) {
      return 'SKU must contain only uppercase letters, numbers, and hyphens';
    }

    return 'Invalid value';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Product name',
      sku: 'SKU',
      description: 'Description',
      category: 'Category',
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.productForm.get(fieldName);
    return !!(control && control.invalid && control.touched);
  }
}
