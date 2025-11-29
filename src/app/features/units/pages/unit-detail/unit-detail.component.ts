import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Unit } from '../../models/unit.model';
import { getUnitById, deleteUnits } from '../../store/units.actions';
import { selectUnitById, selectUnitsLoading } from '../../store/units.selectors';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { DetailsPageHeaderComponent } from "../../../../shared/components/details-page-header/details-page-header.component";

@Component({
  selector: 'app-unit-detail',
  standalone: true,
  imports: [CommonModule, ConfirmDialogComponent, DetailsPageHeaderComponent],
  templateUrl: './unit-detail.component.html',
  styleUrls: ['./unit-detail.component.scss'],
})
export class UnitDetailComponent implements OnInit {
  unit$: Observable<Unit | undefined>;
  loading$: Observable<boolean>;
  unitId: string | null = null;
  showDeleteDialog = false;

  constructor(private store: Store, private route: ActivatedRoute, private router: Router) {
    this.loading$ = this.store.select(selectUnitsLoading);
    this.unit$ = new Observable();
  }

  ngOnInit(): void {
    this.unitId = this.route.snapshot.paramMap.get('id');
    if (this.unitId) {
      this.store.dispatch(getUnitById({ id: this.unitId }));
      this.unit$ = this.store.select(selectUnitById(this.unitId));
    }
  }

  onEdit(): void {
    if (this.unitId) {
      this.router.navigate(['/units', this.unitId, 'edit']);
    }
  }

  confirmDelete(): void {
    this.showDeleteDialog = true;
  }

  onDelete(): void {
    if (this.unitId) {
      this.store.dispatch(deleteUnits({ ids: [this.unitId] }));
      this.showDeleteDialog = false;
      this.router.navigate(['/units']);
    }
  }

  cancelDelete(): void {
    this.showDeleteDialog = false;
  }

  onBack(): void {
    this.router.navigate(['/units']);
  }
}
