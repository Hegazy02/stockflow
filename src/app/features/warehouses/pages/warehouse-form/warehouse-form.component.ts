import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, takeUntil, filter, take, Observable } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { Warehouse, WarehouseManager } from '../../models/warehouse.model';
import { selectWarehouseById, selectWarehouseManagers } from '../../store/warehouses.selectors';
import {
  createWarehouse,
  updateWarehouse,
  updateWarehouseSuccess,
  createWarehouseSuccess,
  getWarehouseById,
  loadWarehouseManagers,
} from '../../store/warehouses.actions';
import { LucideAngularModule, ArrowLeft, Save, X } from 'lucide-angular';
import { FormInputComponent } from '../../../../shared/components/form-input/form-input.component';
import { DropdownComponent } from '../../../../shared/components/dropdown/dropdown.component';
import { DetailsPageHeaderComponent } from "../../../../shared/components/details-page-header/details-page-header.component";

@Component({
  selector: 'app-warehouse-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule,
    FormInputComponent,
    DropdownComponent,
    DetailsPageHeaderComponent
],
  templateUrl: './warehouse-form.component.html',
  styleUrls: ['./warehouse-form.component.scss'],
})
export class WarehouseFormComponent implements OnInit, OnDestroy {
  warehouseForm: FormGroup;
  isEditMode = false;
  warehouseId: string | null = null;
  private destroy$ = new Subject<void>();
  // Category observables
  // managers$: Observable<WarehouseManager[]>;

  statusOptions = [
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' },
  ];

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
    this.warehouseForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      location: ['', [Validators.required]],
      // managerId: ['', [Validators.required]],
      manager: [null],
      status: ['Active', [Validators.required]],
    });
    // Initialize managers observables
    // this.managers$ = this.store.select(selectWarehouseManagers);
  }

  ngOnInit(): void {
    // Load warehouse managers
    // this.store.dispatch(loadWarehouseManagers());

    this.warehouseId = this.route.snapshot.paramMap.get('id');

    if (this.warehouseId && this.warehouseId !== 'new') {
      this.isEditMode = true;
      this.loadWarehouse(this.warehouseId);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadWarehouse(id: string): void {
    this.store.dispatch(getWarehouseById({ id }));

    this.store
      .select(selectWarehouseById(id))
      .pipe(
        takeUntil(this.destroy$),
        filter((warehouse): warehouse is Warehouse => warehouse !== undefined)
      )
      .subscribe((warehouse) => {
        this.warehouseForm.patchValue({
          title: warehouse.title,
          location: warehouse.location,
          // managerId: warehouse.manager._id,
          manager: warehouse.manager,
          status: warehouse.status,
        });
      });
  }

  onSubmit(): void {
    if (this.warehouseForm.invalid) {
      this.warehouseForm.markAllAsTouched();
      return;
    }

    const formValue = this.warehouseForm.value;
    const manager = formValue.manager;

    if (this.isEditMode && this.warehouseId) {
      this.store
        .select(selectWarehouseById(this.warehouseId))
        .pipe(
          filter((warehouse): warehouse is Warehouse => warehouse !== undefined),
          take(1)
        )
        .subscribe({
          next: (warehouse) => {
            const updatedWarehouse: Warehouse = {
              ...warehouse,
              title: formValue.title,
              location: formValue.location,
              status: formValue.status,
              // manager: { _id: managerId, name: warehouse.manager },
              manager: manager,
              updatedAt: new Date().toISOString(),
            };
            this.store.dispatch(updateWarehouse({ warehouse: updatedWarehouse }));

            this.actions$.pipe(ofType(updateWarehouseSuccess), take(1)).subscribe(() => {
              this.navigateToList();
            });
          },
          error: (err) => {
            console.error('Error loading warehouse for update:', err);
          },
        });
    } else {
      // For create, we need to find the manager name
      // this.managers$.pipe(take(1)).subscribe((managers) => {
      //   const selectedManager = managers.find((m) => m._id === managerId);
      //   const warehouseData = {
      //     title: formValue.title,
      //     location: formValue.location,
      //     status: formValue.status,
      //     manager: selectedManager || { _id: managerId, name: '' },
      //   };
      //   this.store.dispatch(createWarehouse({ warehouse: warehouseData }));

      // });
      const warehouseData = {
        title: formValue.title,
        location: formValue.location,
        status: formValue.status,
        manager: formValue.manager,
      };
      this.store.dispatch(createWarehouse({ warehouse: warehouseData }));
    }
  }

  onCancel(): void {
    this.navigateToList();
  }

  navigateToList(): void {
    this.router.navigate(['/warehouses']);
  }
}
