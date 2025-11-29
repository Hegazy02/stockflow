import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Category } from '../../models/category.model';
import { getCategoryById, deleteCategories } from '../../store/categories.actions';
import { selectCategoryById, selectCategoriesLoading } from '../../store/categories.selectors';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { DetailsPageHeaderComponent } from "../../../../shared/components/details-page-header/details-page-header.component";

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [CommonModule, ConfirmDialogComponent, DetailsPageHeaderComponent],
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.scss'],
})
export class CategoryDetailComponent implements OnInit {
  category$: Observable<Category | undefined>;
  loading$: Observable<boolean>;
  categoryId: string | null = null;
  showDeleteDialog = false;

  constructor(private store: Store, private route: ActivatedRoute, private router: Router) {
    this.loading$ = this.store.select(selectCategoriesLoading);
    this.category$ = new Observable();
  }

  ngOnInit(): void {
    this.categoryId = this.route.snapshot.paramMap.get('id');
    if (this.categoryId) {
      this.store.dispatch(getCategoryById({ id: this.categoryId }));
      this.category$ = this.store.select(selectCategoryById(this.categoryId));
    }
  }

  onEdit(): void {
    if (this.categoryId) {
      this.router.navigate(['/categories', this.categoryId, 'edit']);
    }
  }

  confirmDelete(): void {
    this.showDeleteDialog = true;
  }

  onDelete(): void {
    if (this.categoryId) {
      this.store.dispatch(deleteCategories({ ids: [this.categoryId] }));
      this.showDeleteDialog = false;
      this.router.navigate(['/categories']);
    }
  }

  cancelDelete(): void {
    this.showDeleteDialog = false;
  }

  onBack(): void {
    this.router.navigate(['/categories']);
  }
}
