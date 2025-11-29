import { Component, OnInit, ChangeDetectionStrategy, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Warehouse } from '../../models/warehouse.model';
import { selectWarehouseById, selectWarehousesLoading } from '../../store/warehouses.selectors';
import { deleteWarehouses, getWarehouseById } from '../../store/warehouses.actions';
import { LucideAngularModule, ArrowLeft, Edit, Trash2 } from 'lucide-angular';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DetailsPageHeaderComponent } from "../../../../shared/components/details-page-header/details-page-header.component";

@Component({
  selector: 'app-warehouse-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, ConfirmDialogComponent, DetailsPageHeaderComponent],
  templateUrl: './warehouse-detail.component.html',
  styleUrls: ['./warehouse-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WarehouseDetailComponent implements OnInit {
  warehouse$ = new Observable<Warehouse | undefined>();
  loading$ = new Observable<boolean | undefined>();
  warehouseId: string | null = null;
  showDeleteConfirm = false;
  warehouseTitle: string = '';
  destroyRef = inject(DestroyRef);

  readonly ArrowLeft = ArrowLeft;
  readonly Edit = Edit;
  readonly Trash2 = Trash2;

  constructor(private store: Store, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.warehouseId = this.route.snapshot.paramMap.get('id');

    if (this.warehouseId) {
      this.initializeWarehouse(this.warehouseId);
    }
  }

  private initializeWarehouse(id: string) {
    this.store.dispatch(getWarehouseById({ id }));
    this.loading$ = this.store.select(selectWarehousesLoading);
    this.warehouse$ = this.store.select(selectWarehouseById(id));

    this.warehouse$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((warehouse) => {
      if (warehouse) {
        this.warehouseTitle = warehouse.title;
      }
    });
  }

  navigateToEdit(): void {
    if (this.warehouseId) {
      this.router.navigate(['/warehouses', this.warehouseId, 'edit']);
    }
  }

  navigateToList(): void {
    this.router.navigate(['/warehouses']);
  }

  confirmDelete(): void {
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
  }

  deleteWarehouse(): void {
    if (this.warehouseId) {
      this.store.dispatch(deleteWarehouses({ ids: [this.warehouseId] }));
      this.showDeleteConfirm = false;
      this.navigateToList();
    }
  }
}
