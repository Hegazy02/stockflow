import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Unit } from '../../models/unit.model';
import { createUnit, updateUnit, getUnitById } from '../../store/units.actions';
import { selectUnitById, selectUnitsLoading } from '../../store/units.selectors';
import { FormInputComponent } from '../../../../shared/components/form-input/form-input.component';
import { DropdownComponent } from '../../../../shared/components/dropdown/dropdown.component';
import { DetailsPageHeaderComponent } from '../../../../shared/components/details-page-header/details-page-header.component';

@Component({
  selector: 'app-unit-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormInputComponent,
    DropdownComponent,
    DetailsPageHeaderComponent,
  ],
  templateUrl: './unit-form.component.html',
  styleUrls: ['./unit-form.component.scss'],
})
export class UnitFormComponent implements OnInit {
  unitForm: FormGroup;
  isEditMode = false;
  unitId: string | null = null;
  loading$: Observable<boolean>;

  statusOptions = [
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' },
  ];

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.loading$ = this.store.select(selectUnitsLoading);

    this.unitForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      abbreviation: ['', [Validators.required, Validators.maxLength(10)]],
      description: [''],
      status: ['Active', Validators.required],
    });
  }

  ngOnInit(): void {
    this.unitId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.unitId && this.unitId !== 'new';

    if (this.isEditMode && this.unitId) {
      this.store.dispatch(getUnitById({ id: this.unitId }));
      this.store.select(selectUnitById(this.unitId)).subscribe((unit) => {
        if (unit) {
          this.unitForm.patchValue({
            name: unit.name,
            abbreviation: unit.abbreviation,
          });
        }
      });
    }
  }

  onSubmit(): void {
    if (this.unitForm.valid) {
      const formValue = this.unitForm.value;

      if (this.isEditMode && this.unitId) {
        const updatedUnit: Unit = {
          _id: this.unitId,
          ...formValue,
        };
        this.store.dispatch(updateUnit({ unit: updatedUnit }));
      } else {
        this.store.dispatch(createUnit({ unit: formValue }));
      }
    } else {
      this.unitForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/units']);
  }
}
