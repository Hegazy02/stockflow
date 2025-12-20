import {
  Component,
  OnInit,
  DestroyRef,
  inject,
  QueryList,
  ViewChildren,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, concatWith, defer, Observable, of } from 'rxjs';
import { TransactionFormData, TransactionType } from '../../models/transaction.model';
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
  @ViewChildren('costPriceInput') costPriceInputs!: QueryList<FormInputComponent>;
  @ViewChildren('quantityInput') quantityInputs!: QueryList<FormInputComponent>;
  @ViewChild('paidInput') paidInput!: FormInputComponent;
  @ViewChildren('productRow') productRows!: QueryList<ElementRef>;

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
  TransactionType = TransactionType;
  transactionType = TransactionType.SALES;
  readonly Plus = Plus;
  readonly Trash2 = Trash2;

  transactionTypeOptions = [
    { label: 'Sales', value: 'sales' },
    { label: 'Purchases', value: 'purchases' },
    { label: 'Deposit (Suppliers)', value: 'deposit_suppliers' },
    { label: 'Deposit (Customers)', value: 'deposit_customers' },
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
      partnerId: [
        {
          value: null,
        },
      ],
      products: this.fb.array([]),
      note: [''],
      balance: [0, [Validators.required, Validators.min(0)]],
      paid: [null, [Validators.required, Validators.min(0)]],
      left: [0],
    });
    // Listen to transaction type changes
    this.transactionForm.get('transactionType')?.valueChanges.subscribe((type) => {
      this.togglePartnerId(type);
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
            this.transactionForm.patchValue({ partnerId: null });
          }
          this.setTransactionTypeValidation(type);
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
            transaction.products?.forEach((product) => {
              const controls: { [key: string]: any } = {
                productId: [product.productId, Validators.required],
                quantity: [product.quantity, [Validators.required, Validators.min(1)]],
                totalProductPrice: [
                  product.sellingPrice || product.costPrice || 0,
                  [Validators.required, Validators.min(1)],
                ],
                sellingPrice: [
                  {
                    value: product.sellingPrice ?? 0,
                    disabled: transaction.transactionType !== TransactionType.SALES,
                  },
                  [Validators.min(0)],
                ],
                costPrice: [
                  {
                    value: product.costPrice ?? 0,
                    disabled: transaction.transactionType !== TransactionType.PURCHASES,
                  },
                  [Validators.min(0)],
                ],
              };

              this.productsArray.push(this.fb.group(controls));
            });

            this.transactionForm.patchValue({
              transactionType: transaction.transactionType,
              partnerId: transaction.partnerId,
              note: transaction.note || '',
              balance: transaction.balance,
              paid: transaction.paid,
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

  get partnersPlaceholder(): string {
    switch (this.transactionType) {
      case TransactionType.SALES:
      case TransactionType.DEPOSIT_CUSTOMERS:
        return 'Select customer';
      case TransactionType.PURCHASES:
      case TransactionType.DEPOSIT_SUPPLIERS:
        return 'Select supplier';
      default:
        break;
    }
    return 'Select Transaction Type';
  }
  get partnersHelpText(): string {
    switch (this.transactionType) {
      case TransactionType.SALES:
      case TransactionType.DEPOSIT_CUSTOMERS:
        return 'Customers will be shown. Scroll down to load more.';
      case TransactionType.PURCHASES:
      case TransactionType.DEPOSIT_SUPPLIERS:
        return 'Suppliers will be shown. Scroll down to load more.';
      default:
        break;
    }
    return 'Please select a transaction type first';
  }
  @HostListener('document:keydown', ['$event'])
  handlePlusKey(event: KeyboardEvent) {
    if (event.key === '+') {
      event.preventDefault(); // IMPORTANT: stops browser from clearing the input
      this.addProduct(true);
      // wait until view updates
      setTimeout(() => {
        this.scrollToCenter();
      });
    }
  }

  addProduct(autoOpen: boolean = false): void {
    const transactionType: TransactionType | undefined =
      this.transactionForm.get('transactionType')?.value;

    // Base controls always present
    const controls: { [key: string]: any } = {
      productId: this.fb.control('', Validators.required),
      currentQuantity: this.fb.control({ value: '', disabled: true }), // <-- add this
      quantity: this.fb.control(1, [Validators.required, Validators.min(1)]),
      totalProductPrice: this.fb.control(0, [Validators.required, Validators.min(0)]),
      sellingPrice: this.fb.control(
        { value: null, disabled: transactionType !== TransactionType.SALES },
        [Validators.min(0)]
      ),
      costPrice: this.fb.control(
        { value: null, disabled: transactionType !== TransactionType.PURCHASES },
        [Validators.min(0)]
      ),
    };

    const productGroup = this.fb.group(controls);

    // Watch for product selection / transactionType to update current quantity and prices

    combineLatest([
      this.controlValue$<string>(productGroup.get('productId')!),
      this.controlValue$<TransactionType>(this.transactionForm.get('transactionType')!),
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([productId, transactionType]) => {
        if (!productId) return;

        const product = this.products.find((p) => p._id === productId);
        if (!product) return;
        const patchData: any = { currentQuantity: product.quantity?.toString() || '0' };

        if (transactionType === TransactionType.SALES) {
          patchData.sellingPrice = product.sellingPrice ?? 0;
          patchData.totalProductPrice = product.sellingPrice ?? 0;
        } else if (transactionType === TransactionType.PURCHASES) {
          // For purchases, costPrice is entered manually, totalProductPrice can be set to 0 or based on costPrice
          patchData.totalProductPrice = 0;
        }
        productGroup.patchValue(patchData);
      });

    this.productsArray.push(productGroup);

    // Open dropdown if autoOpen is true
    if (autoOpen) {
      setTimeout(() => {
        const dropdowns = this.productDropdowns.toArray();
        const lastDropdown = dropdowns[dropdowns.length - 1];
        if (lastDropdown) lastDropdown.open();
      }, 0);
    }
  }

  removeProduct(index: number): void {
    if (this.productsArray.length > 1) {
      this.productsArray.removeAt(index);
      this.setTransactionBalance();
    }
  }

  onQuantityKeydown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.paidInput.focus();
      // // Check if this is the last product row
      // if (index === this.productsArray.length - 1) {
      //   this.addProduct(true); // Auto-open dropdown when adding via Enter key
      // }
    }
  }
  submitOnPressEnter(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      console.log('eve', event);
      this.onSubmit();
    }
  }

  loadProducts(search?: string): void {
    if (this.loadingProducts || !this.hasMoreProducts) {
      return;
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
          // this.loadingProducts = false;
        },
        error: () => {
          // this.loadingProducts = false;
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

  loadPartners(transactionType: TransactionType, search?: string): void {
    if (this.loadingPartners || !this.hasMorePartners) {
      return;
    }

    // if (this.partners.length < 1) {
    //   this.loadingPartners = true;
    // }
    let partnerType: 'Customer' | 'Supplier' | undefined;
    switch (transactionType) {
      case TransactionType.SALES:
      case TransactionType.DEPOSIT_CUSTOMERS:
        partnerType = 'Customer';
        break;
      case TransactionType.PURCHASES:
      case TransactionType.DEPOSIT_SUPPLIERS:
        partnerType = 'Supplier';
        break;

      default:
        break;
    }
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
          // this.loadingPartners = false;
        },
        error: () => {
          // this.loadingPartners = false;
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
  setTransactionTypeValidation(type: TransactionType) {
    this.productsArray.controls.forEach((control) => {
      const group = control as FormGroup;

      const costPrice = group.get('costPrice');
      const sellingPrice = group.get('sellingPrice');

      // 🔁 Reset first (VERY IMPORTANT)
      costPrice?.clearValidators();
      sellingPrice?.clearValidators();

      if (type === TransactionType.PURCHASES) {
        // ✅ costPrice REQUIRED
        costPrice?.setValidators([Validators.required, Validators.min(0)]);
        costPrice?.enable({ emitEvent: false });

        // ❌ sellingPrice disabled
        sellingPrice?.disable({ emitEvent: false });
      } else if (type === TransactionType.SALES) {
        // ❌ costPrice disabled
        costPrice?.disable({ emitEvent: false });

        // ✅ sellingPrice REQUIRED
        sellingPrice?.setValidators([Validators.required, Validators.min(0)]);
        sellingPrice?.enable({ emitEvent: false });
      } else {
        // 🟢 Deposit types → neither required
        costPrice?.disable({ emitEvent: false });
        sellingPrice?.disable({ emitEvent: false });
      }

      // 🔄 Apply validation changes
      costPrice?.updateValueAndValidity({ emitEvent: false });
      sellingPrice?.updateValueAndValidity({ emitEvent: false });
    });
  }

  getProducts(): [] {
    if (
      this.transactionType == TransactionType.PURCHASES ||
      this.transactionType == TransactionType.SALES
    ) {
      return this.productsArray.value.map((p: any) => ({
        productId: p.productId,
        quantity: p.quantity,
        costPrice: p.costPrice ?? 0,
        sellingPrice: p.sellingPrice,
      }));
    }
    return [];
  }

  onSubmit(): void {
    console.log('form', this.transactionForm.value);
    console.log('valid', this.transactionForm.valid);

    if (this.transactionForm.valid) {
      const formValue = this.transactionForm.getRawValue();

      // Remove currentQuantity from each product (it's just for display)
      const transactionData: TransactionFormData = {
        transactionType: formValue.transactionType,
        partnerId: formValue.partnerId,
        products: this.getProducts(),
        note: formValue.note,
        balance: formValue.balance,
        paid: formValue.paid,
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
  onChangeQuantity(value: string, index: number) {
    if (typeof value != 'string') {
      return;
    }

    const productGroup = this.productsArray.at(index) as FormGroup;
    const quantity = Number(value);

    this.setTotalProductPrice(productGroup, quantity);
    this.setTransactionBalance();
  }

  private setTotalProductPrice(productGroup: FormGroup<any>, quantity: number) {
    let price = 0;
    if (this.transactionType == TransactionType.SALES) {
      price = Number(productGroup.get('sellingPrice')?.value || 0);
    } else if (this.transactionType == TransactionType.PURCHASES) {
      price = Number(productGroup.get('costPrice')?.value || 0);
    }

    const totalProductPrice = price * quantity;

    // Update control
    productGroup.get('totalProductPrice')?.setValue(totalProductPrice);
  }
  setTransactionBalance() {
    let balance = 0;
    (this.productsArray.value as Array<any>).map((product) => {
      balance = balance + +product.totalProductPrice;
    });
    this.transactionForm.patchValue({ balance });

    const paid = this.transactionForm.get('paid')?.value;
    this.setLeftAmount(balance, paid);
  }

  onProductChange(product: Product, index: number) {
    this.setTransactionBalance();
    if (this.transactionType == TransactionType.SALES) {
      this.focusOnInput(this.quantityInputs, index);
    } else if (this.transactionType == TransactionType.PURCHASES) {
      this.focusOnInput(this.costPriceInputs, index);
    }
  }

  focusOnInput(list: QueryList<FormInputComponent>, index: number) {
    const input = list.toArray()[index];
    input?.focus();
  }
  onPaidChange(value: string) {
    if (typeof value != 'string') {
      return;
    }
    const balance = this.transactionForm.get('balance')?.value;
    this.setLeftAmount(balance, value);
  }

  private setLeftAmount(balance: any, paid: string) {
    const left = +balance - +paid;

    this.transactionForm.patchValue({
      left,
    });
  }
  scrollToCenter() {
    setTimeout(() => {
      const lastRow = this.productRows.last;
      lastRow.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    });
  }
  onChangeTransactionType(transactionOption: { label: string; value: string }) {
    this.setTransactionData(transactionOption);
    this.setBalance();
    this.updateAllTotalPrices();
    this.updateProductsValidations();
  }

  updateProductsValidations() {
    if (
      this.transactionType === TransactionType.SALES ||
      this.transactionType === TransactionType.PURCHASES
    ) {
      // Products ARE required
      this.productsArray.setValidators([Validators.required, Validators.minLength(1)]);
      this.setTransactionTypeValidation(this.transactionType);
    } else {
      // Products NOT required (deposit)
      this.productsArray.clearValidators();

      // 🔴 VERY IMPORTANT
      this.productsArray.controls.forEach((control) => {
        const group = control as FormGroup;

        Object.keys(group.controls).forEach((key) => {
          group.get(key)?.clearValidators();
          group.get(key)?.updateValueAndValidity({ emitEvent: false });
        });
      });
    }

    this.productsArray.updateValueAndValidity();
  }

  togglePartnerId(transactionType: TransactionType) {
    const partnerControl = this.transactionForm.get('partnerId');
    if (!partnerControl) return;

    if (transactionType === TransactionType.SALES) {
      partnerControl.clearValidators();
      partnerControl.setValue(null);
    } else {
      partnerControl.setValidators([Validators.required]);
      // ✅ force empty so required actually fails
      partnerControl.setValue(null);
    }
    partnerControl.updateValueAndValidity();
  }

  private updateAllTotalPrices() {
    (this.productsArray.controls as Array<FormGroup>).map((product) => {
      const quantity = +product.get('quantity')?.value;
      this.setTotalProductPrice(product, quantity);
    });
  }

  setBalance() {
    const balanceFormControl = this.transactionForm.get('balance')!;
    let balance: number | null = null;
    switch (this.transactionType) {
      case TransactionType.PURCHASES:
        balance = 0;
        (this.productsArray.value as Array<any>).map((product) => {
          balance = balance! + (product.costPrice ?? 0) * product.quantity;
        });
        break;
      case TransactionType.SALES:
        balance = 0;
        (this.productsArray.value as Array<any>).map((product) => {
          balance = balance! + (product.sellingPrice ?? 0) * product.quantity;
        });
        break;
    }

    balanceFormControl.patchValue(balance);
    const paid = this.transactionForm.get('paid')?.value;
    this.setLeftAmount(balance, paid);
  }
  setTransactionData(transactionOption: { label: string; value: string }) {
    this.transactionType = transactionOption.value as TransactionType;
  }
  onCancel(): void {
    this.router.navigate(['/transactions']);
  }
  controlValue$<T>(control: AbstractControl): Observable<T> {
    return defer(() => of(control.value).pipe(concatWith(control.valueChanges)));
  }
  onChangeBalance(balance: string) {
    if (typeof balance != 'string') {
      return;
    }
    const paid = this.transactionForm.get('paid')?.value;
    const left = +balance - +paid;
    this.transactionForm.get('left')?.patchValue(left);
  }
  onChangeCostPrice(value: string, index: number) {
    if (typeof value != 'string') {
      return;
    }
    const product = this.productsArray.at(index);
    const quantity = product.get('quantity')?.value;

    const totalProductPrice = +quantity * +value;
    product.get('totalProductPrice')?.patchValue(totalProductPrice);
    this.setBalance();
  }
  onCostPriceKeydown(event: KeyboardEvent, index: number) {
    if (event.key === 'Enter') {
      event.preventDefault();

      this.quantityInputs.get(index)?.focus();
    }
  }
}
