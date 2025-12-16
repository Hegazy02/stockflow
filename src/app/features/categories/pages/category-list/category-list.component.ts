import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Category } from '../../models/category.model';
import {
  selectAllCategories,
  selectCategoriesLoading,
  selectCategoriesError,
} from '../../store/categories.selectors';
import { loadCategories, deleteCategories } from '../../store/categories.actions';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import { Eye, Edit, Trash2 } from 'lucide-angular';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ListPageHeaderComponent } from '../../../../shared/components/list-page-header/list-page-header.component';
import { TableColumn, TableAction } from '../../../../shared/models/data-table';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DataTableComponent,
    ConfirmDialogComponent,
    ListPageHeaderComponent,
  ],
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
})
export class CategoryListComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  categories$: Observable<Category[]>;
  loading$: Observable<boolean>;
  error$: Observable<any>;
  categories: Category[] = [];
  selectedCategories: Category[] = [];

  showDeleteDialog = false;
  showBulkDeleteDialog = false;
  categoryToDelete: Category | null = null;

  columns: TableColumn[] = [
    { field: 'name', header: 'Category Name', width: '30%', filterable: true },
    { field: 'description', header: 'Description', width: '40%' },
    { field: 'status', header: 'Status', width: '15%' },
    {
      field: 'createdAt',
      header: 'Created',
      width: '15%',
      type: 'date',
      dateFormat: 'short',
    },
  ];

  actions: TableAction[] = [
    {
      icon: Eye,
      label: 'View',
      styleClass: 'btn-view',
      command: (rowData: Category) => this.navigateToDetail(rowData._id),
    },
    {
      icon: Edit,
      label: 'Edit',
      styleClass: 'btn-edit',
      command: (rowData: Category) => this.navigateToEdit(rowData._id),
    },
    {
      icon: Trash2,
      label: 'Delete',
      styleClass: 'btn-delete',
      command: (rowData: Category) => this.confirmDeleteCategory(rowData._id),
    },
  ];

  constructor(private store: Store, private router: Router) {
    this.categories$ = this.store.select(selectAllCategories);
    this.loading$ = this.store.select(selectCategoriesLoading);
    this.error$ = this.store.select(selectCategoriesError);
  }

  ngOnInit(): void {
    this.store.dispatch(loadCategories());

    this.categories$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((categories) => {
      this.categories = categories;
    });
  }

  onRowSelect(rows: any) {
    this.selectedCategories = rows;
  }

  confirmBulkDelete(): void {
    if (this.selectedCategories.length === 0) {
      return;
    }
    this.showBulkDeleteDialog = true;
  }

  bulkDeleteCategories(): void {
    const ids = this.selectedCategories.map((c) => c._id);
    this.store.dispatch(deleteCategories({ ids }));
    this.selectedCategories = [];
    this.showBulkDeleteDialog = false;
  }

  cancelBulkDelete(): void {
    this.showBulkDeleteDialog = false;
  }

  navigateToDetail(categoryId: string): void {
    this.router.navigate(['/categories', categoryId]);
  }

  navigateToEdit(categoryId: string): void {
    this.router.navigate(['/categories', categoryId, 'edit']);
  }

  navigateToCreate(): void {
    this.router.navigate(['/categories', 'new']);
  }

  confirmDeleteCategory(categoryId: string): void {
    const category = this.categories.find((c) => c._id === categoryId);
    if (category) {
      this.categoryToDelete = category;
      this.showDeleteDialog = true;
    }
  }

  deleteCategory(): void {
    if (this.categoryToDelete) {
      this.store.dispatch(deleteCategories({ ids: [this.categoryToDelete._id] }));
      this.categoryToDelete = null;
      this.showDeleteDialog = false;
    }
  }

  cancelDelete(): void {
    this.categoryToDelete = null;
    this.showDeleteDialog = false;
  }

  retryLoadCategories(): void {
    this.store.dispatch(loadCategories());
  }
}
