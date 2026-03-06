import { Routes } from '@angular/router';
import { authGuard } from './core/guards';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/products',
    pathMatch: 'full',
  },
  {
    path: 'products',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        data: { breadcrumb: 'Products' },
        loadComponent: () =>
          import('./features/products/pages/product-list/product-list.component').then(
            (m) => m.ProductListComponent
          ),
      },
      {
        path: 'new',
        data: { breadcrumb: 'Products', breadcrumbUrl: '/products' },
        children: [
          {
            path: '',
            data: { breadcrumb: 'New Product' },
            loadComponent: () =>
              import('./features/products/pages/product-form/product-form.component').then(
                (m) => m.ProductFormComponent
              ),
          },
        ],
      },
      {
        path: ':id',
        data: { breadcrumb: 'Products', breadcrumbUrl: '/products' },
        children: [
          {
            path: '',
            data: { breadcrumb: 'Details' },
            loadComponent: () =>
              import('./features/products/pages/product-detail/product-detail.component').then(
                (m) => m.ProductDetailComponent
              ),
          },
          {
            path: 'edit',
            data: { breadcrumb: 'Details', breadcrumbUrl: '../' },
            children: [
              {
                path: '',
                data: { breadcrumb: 'Edit' },
                loadComponent: () =>
                  import('./features/products/pages/product-form/product-form.component').then(
                    (m) => m.ProductFormComponent
                  ),
              },
            ],
          },
        ],
      },
    ],
  },

  {
    path: 'warehouses',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        data: { breadcrumb: 'Warehouses' },
        loadComponent: () =>
          import('./features/warehouses/pages/warehouse-list/warehouse-list.component').then(
            (m) => m.WarehouseListComponent
          ),
      },
      {
        path: 'new',
        data: { breadcrumb: 'Warehouses', breadcrumbUrl: '/warehouses' },
        children: [
          {
            path: '',
            data: { breadcrumb: 'New Warehouse' },
            loadComponent: () =>
              import('./features/warehouses/pages/warehouse-form/warehouse-form.component').then(
                (m) => m.WarehouseFormComponent
              ),
          },
        ],
      },
      {
        path: ':id',
        data: { breadcrumb: 'Warehouses', breadcrumbUrl: '/warehouses' },
        children: [
          {
            path: '',
            data: { breadcrumb: 'Details' },
            loadComponent: () =>
              import('./features/warehouses/pages/warehouse-detail/warehouse-detail.component').then(
                (m) => m.WarehouseDetailComponent
              ),
          },
          {
            path: 'edit',
            data: { breadcrumb: 'Details', breadcrumbUrl: '../' },
            children: [
              {
                path: '',
                data: { breadcrumb: 'Edit' },
                loadComponent: () =>
                  import('./features/warehouses/pages/warehouse-form/warehouse-form.component').then(
                    (m) => m.WarehouseFormComponent
                  ),
              },
            ],
          },
        ],
      },
    ],
  },

  {
    path: 'categories',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        data: { breadcrumb: 'Categories' },
        loadComponent: () =>
          import('./features/categories/pages/category-list/category-list.component').then(
            (m) => m.CategoryListComponent
          ),
      },
      {
        path: 'new',
        data: { breadcrumb: 'Categories', breadcrumbUrl: '/categories' },
        children: [
          {
            path: '',
            data: { breadcrumb: 'New Category' },
            loadComponent: () =>
              import('./features/categories/pages/category-form/category-form.component').then(
                (m) => m.CategoryFormComponent
              ),
          },
        ],
      },
      {
        path: ':id',
        data: { breadcrumb: 'Categories', breadcrumbUrl: '/categories' },
        children: [
          {
            path: '',
            data: { breadcrumb: 'Details' },
            loadComponent: () =>
              import('./features/categories/pages/category-detail/category-detail.component').then(
                (m) => m.CategoryDetailComponent
              ),
          },
          {
            path: 'edit',
            data: { breadcrumb: 'Details', breadcrumbUrl: '../' },
            children: [
              {
                path: '',
                data: { breadcrumb: 'Edit' },
                loadComponent: () =>
                  import('./features/categories/pages/category-form/category-form.component').then(
                    (m) => m.CategoryFormComponent
                  ),
              },
            ],
          },
        ],
      },
    ],
  },

  {
    path: 'units',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        data: { breadcrumb: 'Units' },
        loadComponent: () =>
          import('./features/units/pages/unit-list/unit-list.component').then(
            (m) => m.UnitListComponent
          ),
      },
      {
        path: 'new',
        data: { breadcrumb: 'Units', breadcrumbUrl: '/units' },
        children: [
          {
            path: '',
            data: { breadcrumb: 'New Unit' },
            loadComponent: () =>
              import('./features/units/pages/unit-form/unit-form.component').then(
                (m) => m.UnitFormComponent
              ),
          },
        ],
      },
      {
        path: ':id',
        data: { breadcrumb: 'Units', breadcrumbUrl: '/units' },
        children: [
          {
            path: '',
            data: { breadcrumb: 'Details' },
            loadComponent: () =>
              import('./features/units/pages/unit-detail/unit-detail.component').then(
                (m) => m.UnitDetailComponent
              ),
          },
          {
            path: 'edit',
            data: { breadcrumb: 'Details', breadcrumbUrl: '../' },
            children: [
              {
                path: '',
                data: { breadcrumb: 'Edit' },
                loadComponent: () =>
                  import('./features/units/pages/unit-form/unit-form.component').then(
                    (m) => m.UnitFormComponent
                  ),
              },
            ],
          },
        ],
      },
    ],
  },

  {
    path: 'transactions',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        data: { breadcrumb: 'Transactions' },
        loadComponent: () =>
          import('./features/transactions/pages/transaction-list/transaction-list.component').then(
            (m) => m.TransactionListComponent
          ),
      },
      {
        path: 'new',
        data: { breadcrumb: 'Transactions', breadcrumbUrl: '/transactions' },
        children: [
          {
            path: '',
            data: { breadcrumb: 'New Transaction' },
            loadComponent: () =>
              import('./features/transactions/pages/transaction-form/transaction-form.component').then(
                (m) => m.TransactionFormComponent
              ),
          },
        ],
      },
      {
        path: ':id',
        data: { breadcrumb: 'Transactions', breadcrumbUrl: '/transactions' },
        children: [
          {
            path: '',
            data: { breadcrumb: 'Details' },
            loadComponent: () =>
              import('./features/transactions/pages/transaction-detail/transaction-detail.component').then(
                (m) => m.TransactionDetailComponent
              ),
          },
          {
            path: 'returns',
            data: { breadcrumb: 'Details', breadcrumbUrl: '../' },
            children: [
              {
                path: '',
                data: { breadcrumb: 'Returns' },
                loadComponent: () =>
                  import('./features/transactions/pages/transaction-returns/transaction-returns').then(
                    (m) => m.TransactionReturnsComponent
                  ),
              },
            ],
          },
        ],
      },
    ],
  },
  // {
  //   path: 'transactions/:id/edit',
  //   canActivate: [authGuard],
  //   loadComponent: () =>
  //     import('./features/transactions/pages/transaction-form/transaction-form.component').then(
  //       (m) => m.TransactionFormComponent
  //     ),
  // },

  {
    path: 'partners',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        data: { breadcrumb: 'Partners' },
        loadComponent: () =>
          import('./features/partners/pages/partner-list/partner-list.component').then(
            (m) => m.PartnerListComponent
          ),
      },
      {
        path: 'new',
        data: { breadcrumb: 'Partners', breadcrumbUrl: '/partners' },
        children: [
          {
            path: '',
            data: { breadcrumb: 'New Partner' },
            loadComponent: () =>
              import('./features/partners/pages/partner-form/partner-form.component').then(
                (m) => m.PartnerFormComponent
              ),
          },
        ],
      },
      {
        path: ':id',
        data: { breadcrumb: 'Partners', breadcrumbUrl: '/partners' },
        children: [
          {
            path: '',
            data: { breadcrumb: 'Details' },
            loadComponent: () =>
              import('./features/partners/pages/partner-detail/partner-detail.component').then(
                (m) => m.PartnerDetailComponent
              ),
          },
          {
            path: 'edit',
            data: { breadcrumb: 'Details', breadcrumbUrl: '../' },
            children: [
              {
                path: '',
                data: { breadcrumb: 'Edit' },
                loadComponent: () =>
                  import('./features/partners/pages/partner-form/partner-form.component').then(
                    (m) => m.PartnerFormComponent
                  ),
              },
            ],
          },
        ],
      },
    ],
  },

  {
    path: 'expenses',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        data: { breadcrumb: 'Expenses' },
        loadComponent: () =>
          import('./features/expenses/pages/expense-list/expense-list.component').then(
            (m) => m.ExpenseListComponent
          ),
      },
      {
        path: 'new',
        data: { breadcrumb: 'Expenses', breadcrumbUrl: '/expenses' },
        children: [
          {
            path: '',
            data: { breadcrumb: 'New Expense' },
            loadComponent: () =>
              import('./features/expenses/pages/expense-form/expense-form.component').then(
                (m) => m.ExpenseFormComponent
              ),
          },
        ],
      },
      {
        path: 'stats',
        data: { breadcrumb: 'Expenses', breadcrumbUrl: '/expenses' },
        children: [
          {
            path: '',
            data: { breadcrumb: 'Statistics' },
            loadComponent: () =>
              import('./features/expenses/pages/expense-stats/expense-stats.component').then(
                (m) => m.ExpenseStatsComponent
              ),
          },
        ],
      },
      {
        path: ':id',
        data: { breadcrumb: 'Expenses', breadcrumbUrl: '/expenses' },
        children: [
          {
            path: '',
            data: { breadcrumb: 'Details' },
            loadComponent: () =>
              import('./features/expenses/pages/expense-detail/expense-detail.component').then(
                (m) => m.ExpenseDetailComponent
              ),
          },
          {
            path: 'edit',
            data: { breadcrumb: 'Details', breadcrumbUrl: '../' },
            children: [
              {
                path: '',
                data: { breadcrumb: 'Edit' },
                loadComponent: () =>
                  import('./features/expenses/pages/expense-form/expense-form.component').then(
                    (m) => m.ExpenseFormComponent
                  ),
              },
            ],
          },
        ],
      },
    ],
  },
  //   {
  //     path: 'stock',
  //     canActivate: [authGuard],
  //     loadComponent: () => import('./features/stock/pages/stock-list/stock-list.component')
  //       .then(m => m.StockListComponent),
  //     children: [
  //       {
  //         path: 'adjust',
  //         loadComponent: () => import('./features/stock/pages/stock-adjustment/stock-adjustment.component')
  //           .then(m => m.StockAdjustmentComponent)
  //       }
  //     ]
  //   },
  //   {
  //     path: 'transfers',
  //     canActivate: [authGuard],
  //     loadComponent: () => import('./features/transfers/pages/transfer-list/transfer-list.component')
  //       .then(m => m.TransferListComponent),
  //     children: [
  //       {
  //         path: 'new',
  //         loadComponent: () => import('./features/transfers/pages/transfer-form/transfer-form.component')
  //           .then(m => m.TransferFormComponent)
  //       },
  //       {
  //         path: ':id',
  //         loadComponent: () => import('./features/transfers/pages/transfer-detail/transfer-detail.component')
  //           .then(m => m.TransferDetailComponent)
  //       }
  //     ]
  //   },
  //   {
  //     path: 'history',
  //     canActivate: [authGuard],
  //     loadComponent: () => import('./features/stock-history/pages/stock-history-list/stock-history-list.component')
  //       .then(m => m.StockHistoryListComponent),
  //     children: [
  //       {
  //         path: ':id',
  //         loadComponent: () => import('./features/stock-history/pages/stock-history-detail/stock-history-detail.component')
  //           .then(m => m.StockHistoryDetailComponent)
  //       }
  //     ]
  //   },
  {
    path: '**',
    redirectTo: '/products',
  },
];
