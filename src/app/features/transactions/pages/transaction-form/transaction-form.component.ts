import { Component, OnInit, DestroyRef, inject, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TransactionFormData, TransactionProduct } from '../../models/transaction.model';
import {
  createTransaction,
  updateTransaction,
  getTransactionById,
} from '../../store/transactions.actions';
import {
  selectTransactionById,
  selectTransactionsLoading,
} from '../../store/transactions.selectors';
import { FormInputComponent } from '../../../../shared/components/form-input/form-input.component';
import { DropdownComponent } from '../../../../shared/components/dropdown/dropdown.component';
import { Product } from '../../../products/models/product.model';
import { Partner } from '../../../partners/models/partner.model';
import { PartnerService } from '../../../partners/services/partner.service';
import { ProductService } from '../../../products/services/product.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DetailsPageHeaderComponent } from '../../../../shared/components/details-page-header/details-page-header.component';
import { LucideAngularModule, Plus, Trash2 } from 'lucide-angular';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormInputComponent,
    DropdownComponent,
    DetailsPageHeaderComponent,
    LucideAngularModule,
  ],
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.scss'],
})
export class TransactionFormComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  @ViewChildren('productDropdown') productDropdowns!: QueryList<DropdownComponent>;

  transactionForm: FormGroup;
  isEditMode = false;
  transactionId: string | null = null;
  loading$: Observable<boolean>;

  products: Product[] = [];
  loadingProducts = false;
  productSearchTerm = '';
  productPage = 1;
  productLimit = 20;
  hasMoreProducts = true;

  partners: Partner[] = [];
  loadingPartners = false;
  partnerSearchTerm = '';
  partnerPage = 1;
  partnerLimit = 20;
  hasMorePartners = true;

  readonly Plus = Plus;
  readonly Trash2 = Trash2;

  transactionTypeOptions = [
    { label: 'Addition (Stock In)', value: 'addition' },
    { label: 'Subtraction (Stock Out)', value: 'subtraction' },
  ];

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private partnerService: PartnerService,
    private productService: ProductService
  ) {
    this.loading$ = this.store.select(selectTransactionsLoading);

    this.transactionForm = this.fb.group({
      transactionType: ['', Validators.required],
      partnerId: ['', Validators.required],
      products: this.fb.array([]),
      note: [''],
    });
  }

  ngOnInit(): void {
    this.loadProducts();

    this.transactionId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.transactionId && this.transactionId !== 'new';

    // Add initial product row
    if (!this.isEditMode) {
      this.addProduct();
    }

    // Watch for transaction type changes
    this.transactionForm
      .get('transactionType')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((type) => {
        if (type) {
          this.partners = [];
          this.partnerPage = 1;
          this.hasMorePartners = true;
          this.loadPartners(type);

          if (!this.isEditMode) {
            this.transactionForm.patchValue({ partnerId: '' });
          }
        }
      });

    if (this.isEditMode && this.transactionId) {
      this.store.dispatch(getTransactionById({ id: this.transactionId }));
      this.store
        .select(selectTransactionById(this.transactionId))
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((transaction) => {
          if (transaction) {
            // Clear existing products
            this.productsArray.clear();

            // Add products from transaction
            transaction.products.forEach((product) => {
              this.productsArray.push(
                this.fb.group({
                  productId: [product.productId, Validators.required],
                  quantity: [product.quantity, [Validators.required, Validators.min(1)]],
                })
              );
            });

            this.transactionForm.patchValue({
              transactionType: transaction.transactionType,
              partnerId: transaction.partnerId,
              note: transaction.note || '',
            });

            if (transaction.transactionType) {
              this.loadPartners(transaction.transactionType);
            }
          }
        });
    }
  }

  get productsArray(): FormArray {
    return this.transactionForm.get('products') as FormArray;
  }

  addProduct(autoOpen: boolean = false): void {
    const productGroup = this.fb.group({
      productId: ['', Validators.required],
      currentQuantity: [{ value: '', disabled: true }],
      quantity: [1, [Validators.required, Validators.min(1)]],
    });

    // Watch for product selection to update current quantity
    productGroup
      .get('productId')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((productId) => {
        if (productId) {
          const selectedProduct = this.products.find((p) => p._id === productId);
          if (selectedProduct) {
            productGroup.patchValue({
              currentQuantity: selectedProduct.quantity?.toString() || '0',
            });
          }
        } else {
          productGroup.patchValue({ currentQuantity: '' });
        }
      });

    this.productsArray.push(productGroup);

    // Open the dropdown for the newly added product row only if autoOpen is true
    if (autoOpen) {
      setTimeout(() => {
        const dropdowns = this.productDropdowns.toArray();
        const lastDropdown = dropdowns[dropdowns.length - 1];
        if (lastDropdown) {
          lastDropdown.open();
        }
      }, 0);
    }
  }

  removeProduct(index: number): void {
    if (this.productsArray.length > 1) {
      this.productsArray.removeAt(index);
    }
  }

  onQuantityKeydown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      // Check if this is the last product row
      if (index === this.productsArray.length - 1) {
        this.addProduct(true); // Auto-open dropdown when adding via Enter key
      }
    }
  }

  loadProducts(search?: string): void {
    if (this.loadingProducts || !this.hasMoreProducts) {
      return;
    }
    if (this.products.length < 1) {
      this.loadingProducts = true;
    }
    const params = {
      page: this.productPage,
      limit: this.productLimit,
      name: search || this.productSearchTerm,
      categoryId: undefined,
    };

    this.productService
      .getAll(params)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          const newProducts = Array.isArray(response.data) ? response.data : [response.data];

          if (this.productPage === 1) {
            this.products = newProducts;
          } else {
            this.products = [...this.products, ...newProducts];
          }

          this.hasMoreProducts = this.products.length < response.pagination.total;
          this.loadingProducts = false;
        },
        error: () => {
          this.loadingProducts = false;
        },
      });
  }

  onProductSearch(searchTerm: string): void {
    this.productSearchTerm = searchTerm;
    this.productPage = 1;
    this.products = [];
    this.hasMoreProducts = true;
    this.loadProducts(searchTerm);
  }

  onProductScrollEnd(): void {
    if (this.hasMoreProducts && !this.loadingProducts) {
      this.productPage++;
      this.loadProducts();
    }
  }

  loadPartners(transactionType: string, search?: string): void {
    if (this.loadingPartners || !this.hasMorePartners) {
      return;
    }

    if (this.partners.length < 1) {
      this.loadingPartners = true;
    }
    const partnerType = transactionType === 'addition' ? 'Supplier' : 'Customer';
    const data = {
      page: this.partnerPage,
      limit: this.partnerLimit,
      type: partnerType,
      name: search || this.partnerSearchTerm,
    };

    this.partnerService
      .getAll(data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          const newPartners = Array.isArray(response.data) ? response.data : [response.data];

          if (this.partnerPage === 1) {
            this.partners = newPartners;
          } else {
            this.partners = [...this.partners, ...newPartners];
          }

          this.hasMorePartners = this.partners.length < response.pagination.total;
          this.loadingPartners = false;
        },
        error: () => {
          this.loadingPartners = false;
        },
      });
  }

  onPartnerSearch(searchTerm: string): void {
    this.partnerSearchTerm = searchTerm;
    this.partnerPage = 1;
    this.partners = [];
    this.hasMorePartners = true;

    const transactionType = this.transactionForm.get('transactionType')?.value;
    if (transactionType) {
      this.loadPartners(transactionType, searchTerm);
    }
  }

  onPartnerScrollEnd(): void {
    if (this.hasMorePartners && !this.loadingPartners) {
      this.partnerPage++;
      const transactionType = this.transactionForm.get('transactionType')?.value;
      if (transactionType) {
        this.loadPartners(transactionType);
      }
    }
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      const formValue = this.transactionForm.getRawValue();

      // Remove currentQuantity from each product (it's just for display)
      const transactionData: TransactionFormData = {
        transactionType: formValue.transactionType,
        partnerId: formValue.partnerId,
        products: formValue.products.map((p: any) => ({
          productId: p.productId,
          quantity: p.quantity,
        })),
        note: formValue.note,
      };

      if (this.isEditMode && this.transactionId) {
        this.store.dispatch(
          updateTransaction({
            id: this.transactionId,
            transaction: transactionData,
          })
        );
      } else {
        this.store.dispatch(createTransaction({ transaction: transactionData }));
      }
    } else {
      this.transactionForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/transactions']);
  }
}
