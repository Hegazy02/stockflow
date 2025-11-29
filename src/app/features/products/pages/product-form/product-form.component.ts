import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, Observable, take } from 'rxjs';
import { Product, ProductFormBody } from '../../models/product.model';
import { selectProductById } from '../../store/products.selectors';
import { createProduct, getProductById, updateProduct } from '../../store/products.actions';
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
import { DetailsPageHeaderComponent } from "../../../../shared/components/details-page-header/details-page-header.component";

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule,
    FormInputComponent,
    DropdownComponent,
    DetailsPageHeaderComponent
],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  productId: string | null = null;

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
    private route: ActivatedRoute
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
      this.initializeEditMode(this.productId);
    }
  }
  private initializeEditMode(id: string): void {
    this.isEditMode = true;

    this.store.dispatch(getProductById({ id }));

    this.product$ = this.store.select(selectProductById(id));

    this.patchForm();
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

    const productPayload: ProductFormBody = {
      name: formValue.name,
      sku: formValue.sku,
      description: formValue.description,
      categoryId: formValue.categoryId,
    };

    if (this.isEditMode && this.productId) {
      this.store.dispatch(
        updateProduct({
          product: {
            _id: this.productId,
            ...productPayload,
          },
        })
      );
    } else {
      this.store.dispatch(createProduct({ product: productPayload }));
    }
  }

  onCancel(): void {
    this.navigateToList();
  }

  navigateToList(): void {
    this.router.navigate(['/products']);
  }
}
