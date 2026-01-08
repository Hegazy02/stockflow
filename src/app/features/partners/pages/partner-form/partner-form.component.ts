import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Partner } from '../../models/partner.model';
import { createPartner, updatePartner, getPartnerById } from '../../store/partners.actions';
import { selectPartnerById, selectPartnersLoading } from '../../store/partners.selectors';
import { FormInputComponent } from '../../../../shared/components/form-input/form-input.component';
import { DropdownComponent } from '../../../../shared/components/dropdown/dropdown.component';
import { DetailsPageHeaderComponent } from '../../../../shared/components/details-page-header/details-page-header.component';
import { FormActionsComponent } from '../../../../shared/components/form-actions/form-actions.component';

@Component({
  selector: 'app-partner-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormInputComponent,
    DropdownComponent,
    DetailsPageHeaderComponent,
    FormActionsComponent,
  ],
  templateUrl: './partner-form.component.html',
  styleUrls: ['./partner-form.component.scss'],
})
export class PartnerFormComponent implements OnInit {
  partnerForm: FormGroup;
  isEditMode = false;
  partnerId: string | null = null;
  loading$: Observable<boolean>;

  typeOptions = [
    { label: 'Supplier', value: 'Supplier' },
    { label: 'Customer', value: 'Customer' },
  ];

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.loading$ = this.store.select(selectPartnersLoading);

    this.partnerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-()]+$/)]],
      description: [''],
      type: ['Supplier', Validators.required],
    });
  }

  ngOnInit(): void {
    this.partnerId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.partnerId && this.partnerId !== 'new';

    if (this.isEditMode && this.partnerId) {
      this.store.dispatch(getPartnerById({ id: this.partnerId }));
      this.store.select(selectPartnerById(this.partnerId)).subscribe((partner) => {
        if (partner) {
          this.partnerForm.patchValue({
            name: partner.name,
            phoneNumber: partner.phoneNumber,
            description: partner.description || '',
            type: partner.type,
          });
        }
      });
    }
  }

  onSubmit(): void {
    if (this.partnerForm.valid) {
      const formValue = this.partnerForm.value;

      if (this.isEditMode && this.partnerId) {
        const updatedPartner: Partner = {
          _id: this.partnerId,
          ...formValue,
        };
        this.store.dispatch(updatePartner({ partner: updatedPartner }));
      } else {
        this.store.dispatch(createPartner({ partner: formValue }));
      }
    } else {
      this.partnerForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/partners']);
  }
}
