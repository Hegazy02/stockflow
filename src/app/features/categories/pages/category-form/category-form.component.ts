import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Category } from '../../models/category.model';
import {
  createCategory,
  updateCategory,
  getCategoryById,
} from '../../store/categories.actions';
import { selectCategoryById, selectCategoriesLoading } from '../../store/categories.selectors';
import { FormInputComponent } from '../../../../shared/components/form-input/form-input.component';
import { DropdownComponent } from '../../../../shared/components/dropdown/dropdown.component';
import { DetailsPageHeaderComponent } from "../../../../shared/components/details-page-header/details-page-header.component";

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormInputComponent, DropdownComponent, DetailsPageHeaderComponent],
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
})
export class CategoryFormComponent implements OnInit {
  categoryForm: FormGroup;
  isEditMode = false;
  categoryId: string | null = null;
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
    this.loading$ = this.store.select(selectCategoriesLoading);

    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      status: ['Active', Validators.required],
    });
  }

  ngOnInit(): void {
    this.categoryId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.categoryId && this.categoryId !== 'new';

    if (this.isEditMode && this.categoryId) {
      this.store.dispatch(getCategoryById({ id: this.categoryId }));
      this.store.select(selectCategoryById(this.categoryId)).subscribe((category) => {
        if (category) {
          this.categoryForm.patchValue({
            name: category.name,
            description: category.description || '',
            status: category.status || 'Active',
          });
        }
      });
    }
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      const formValue = this.categoryForm.value;

      if (this.isEditMode && this.categoryId) {
        const updatedCategory: Category = {
          _id: this.categoryId,
          ...formValue,
        };
        this.store.dispatch(updateCategory({ category: updatedCategory }));
      } else {
        this.store.dispatch(createCategory({ category: formValue }));
      }
    } else {
      this.categoryForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/categories']);
  }
}
