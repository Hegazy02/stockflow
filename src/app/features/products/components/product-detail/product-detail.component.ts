import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, combineLatest } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Product } from '../../models/product.model';
import { selectProductById } from '../../store/products.selectors';
import { deleteProducts } from '../../store/products.actions';
import { StockLevel } from '../../../stock/models/stock-level.model';
import { Warehouse } from '../../../warehouses/models/warehouse.model';
import { selectStockByProduct } from '../../../stock/store/stock.selectors';
import { selectAllWarehouses } from '../../../warehouses/store/warehouses.selectors';
import { LucideAngularModule, ArrowLeft, Edit, Trash2, Package } from 'lucide-angular';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

export interface StockLevelWithWarehouse extends StockLevel {
  warehouse?: Warehouse;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, ConfirmDialogComponent],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product$: Observable<Product | undefined>;
  stockLevels$: Observable<StockLevelWithWarehouse[]>;
  totalStock$: Observable<number>;
  productId: string | null = null;
  showDeleteConfirm = false;
  productName: string = '';
  private destroy$ = new Subject<void>();

  // Lucide icons
  readonly ArrowLeft = ArrowLeft;
  readonly Edit = Edit;
  readonly Trash2 = Trash2;
  readonly Package = Package;

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.product$ = new Observable<Product | undefined>();
    this.stockLevels$ = new Observable<StockLevelWithWarehouse[]>();
    this.totalStock$ = new Observable<number>();
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    
    if (this.productId) {
      this.product$ = this.store.select(selectProductById(this.productId));
      
      // Store product name for dialog
      this.product$.pipe(takeUntil(this.destroy$)).subscribe(product => {
        if (product) {
          this.productName = product.name;
        }
      });
      
      // Get stock levels for this product across all warehouses
      const stockLevels$ = this.store.select(selectStockByProduct(this.productId));
      const warehouses$ = this.store.select(selectAllWarehouses);
      
      // Combine stock levels with warehouse information
      this.stockLevels$ = combineLatest([stockLevels$, warehouses$]).pipe(
        map(([stockLevels, warehouses]) => {
          return stockLevels.map(stock => ({
            ...stock,
            warehouse: warehouses.find(w => w.id === stock.warehouseId)
          }));
        }),
        takeUntil(this.destroy$)
      );
      
      // Calculate total stock across all warehouses
      this.totalStock$ = stockLevels$.pipe(
        map(stockLevels => 
          stockLevels.reduce((total, stock) => total + stock.quantity, 0)
        ),
        takeUntil(this.destroy$)
      );
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
      this.store.dispatch(deleteProducts({ ids: [this.productId ]}));
      this.showDeleteConfirm = false;
      this.navigateToList();
    }
  }
}
