import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { Subject, takeUntil, filter, Observable, take, map } from 'rxjs';
import { Product } from '../../models/product.model';
import { selectProductById } from '../../store/products.selectors';
import {
  createProduct,
  getProductById,
  updateProduct,
  updateProductSuccess,
  createProductSuccess,
} from '../../store/products.actions';
import { LucideAngularModule, ArrowLeft, Save, X } from 'lucide-angular';
import { FormInputComponent } from '../../../../shared/components/form-input/form-input.component';
import { DropdownComponent } from '../../../../shared/components/dropdown/dropdown.component';
import { Category } from '../../../categories/models/category.model';
import { loadCategories } from '../../../categories/store/categories.actions';
import {
  selectAllCategories,
  selectCategoriesLoading,
  selectCategoriesError,
} from '../../../categories/store/categories.selectors';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule,
    FormInputComponent,
    DropdownComponent,
  ],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit, OnDestroy {
  productForm: FormGroup;
  isEditMode = false;
  productId: string | null = null;
  private destroy$ = new Subject<void>();

  // Category observables
  categories$: Observable<Category[]>;
  categoriesLoading$: Observable<boolean>;
  categoriesError$: Observable<any>;
  product$ = new Observable<Product | undefined>();

  // Lucide icons
  readonly ArrowLeft = ArrowLeft;
  readonly Save = Save;
  readonly X = X;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private actions$: Actions
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      sku: ['', [Validators.required]],
      description: [null],
      categoryId: [null, [Validators.required]],
    });

    // Initialize category observables
    this.categories$ = this.store.select(selectAllCategories);
    this.categoriesLoading$ = this.store.select(selectCategoriesLoading);
    this.categoriesError$ = this.store.select(selectCategoriesError);
  }

  ngOnInit(): void {
    // Load categories
    this.store.dispatch(loadCategories());
    this.productId = this.route.snapshot.paramMap.get('id');

    if (this.productId) {
      this.isEditMode = true;
      this.store.dispatch(getProductById({ id: this.productId }));
      this.product$ = this.store.select(selectProductById(this.productId));

      this.patchForm();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private patchForm(): void {
    this.product$
      .pipe(
        filter((product): product is Product => product !== undefined),
        take(1)
      )
      .subscribe((product: Product) => {
        this.productForm.patchValue({
          name: product.name,
          sku: product.sku,
          description: product.description,
          categoryId: product.category._id,
        });
      });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const formValue = this.productForm.value;

    // Ensure category is sent as string ID (not object)
    const productPayload = {
      name: formValue.name,
      sku: formValue.sku,
      description: formValue.description,
      categoryId: formValue.categoryId, // This is already a string ID from the dropdown
    };

    if (this.isEditMode && this.productId) {
      this.store
        .select(selectProductById(this.productId))
        .pipe(
          filter((product): product is Product => product !== undefined),
          take(1) // Take only the first emission to avoid multiple dispatches
        )
        .subscribe({
          next: (product) => {
            const updatedProduct: Product = {
              ...product,
              ...productPayload,
              updatedAt: new Date().toISOString(),
            };
            this.store.dispatch(updateProduct({ product: updatedProduct }));

            // Wait for update success before navigating
            this.actions$.pipe(ofType(updateProductSuccess)).subscribe(() => {
              this.navigateToList();
            });
          },
          error: (err) => {
            console.error('Error loading product for update:', err);
          },
        });
    } else {
      this.store.dispatch(createProduct({ product: productPayload as any }));

      // Wait for create success before navigating
      this.actions$.pipe(ofType(createProductSuccess)).subscribe(() => {
        this.navigateToList();
      });
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
