import { Component, OnInit, ChangeDetectionStrategy, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../../models/product.model';
import { selectProductById, selectProductsLoading } from '../../store/products.selectors';
import { deleteProducts, getProductById } from '../../store/products.actions';
import { StockLevel } from '../../../stock/models/stock-level.model';
import { Warehouse } from '../../../warehouses/models/warehouse.model';
import { selectStockByProduct } from '../../../stock/store/stock.selectors';
import { selectAllWarehouses } from '../../../warehouses/store/warehouses.selectors';
import { LucideAngularModule, ArrowLeft, Edit, Trash2, Package } from 'lucide-angular';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface StockLevelWithWarehouse extends StockLevel {
  warehouse?: Warehouse;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, ConfirmDialogComponent],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent implements OnInit {
  product$ = new Observable<Product | undefined>();
  loading$ = new Observable<boolean | undefined>();
  stockLevels$ = new Observable<StockLevelWithWarehouse[]>();
  totalStock$ = new Observable<number>();
  productId: string | null = null;
  showDeleteConfirm = false;
  productName: string = '';
  destroyRef = inject(DestroyRef);

  // Lucide icons
  readonly ArrowLeft = ArrowLeft;
  readonly Edit = Edit;
  readonly Trash2 = Trash2;
  readonly Package = Package;

  constructor(private store: Store, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');

    if (this.productId) {
      this.initializeProduct(this.productId);
    }
  }

  private initializeProduct(id: string) {
    this.store.dispatch(getProductById({ id }));
    this.loading$ = this.store.select(selectProductsLoading);
    this.product$ = this.store.select(selectProductById(id));

    // Store product name for dialog
    this.product$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((product) => {
      if (product) {
        this.productName = product.name;
      }
    });

    // Get stock levels for this product across all warehouses
    const stockLevels$ = this.store.select(selectStockByProduct(id));
    const warehouses$ = this.store.select(selectAllWarehouses);

    // Combine stock levels with warehouse information
    this.stockLevels$ = combineLatest([stockLevels$, warehouses$]).pipe(
      map(([stockLevels, warehouses]) => {
        return stockLevels.map((stock) => ({
          ...stock,
          warehouse: warehouses.find((w) => w.id === stock.warehouseId),
        }));
      }),
      takeUntilDestroyed(this.destroyRef)
    );

    // Calculate total stock across all warehouses
    this.totalStock$ = stockLevels$.pipe(
      map((stockLevels) => stockLevels.reduce((total, stock) => total + stock.quantity, 0)),
      takeUntilDestroyed(this.destroyRef)
    );
  }

  navigateToEdit(): void {
    if (this.productId) {
      this.router.navigate(['/products', this.productId, 'edit']);
    }
  }

  navigateToList(): void {
    this.router.navigate(['/products']);
  }

  confirmDelete(): void {
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
  }

  deleteProduct(): void {
    if (this.productId) {
      this.store.dispatch(deleteProducts({ ids: [this.productId] }));
      this.showDeleteConfirm = false;
      this.navigateToList();
    }
  }
}
