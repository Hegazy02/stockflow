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
    loadComponent: () =>
      import('./features/products/pages/product-list/product-list.component').then(
        (m) => m.ProductListComponent
      ),
  },
  {
    path: 'products/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/products/pages/product-form/product-form.component').then(
        (m) => m.ProductFormComponent
      ),
  },
  {
    path: 'products/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/products/pages/product-detail/product-detail.component').then(
        (m) => m.ProductDetailComponent
      ),
  },
  {
    path: 'products/:id/edit',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/products/pages/product-form/product-form.component').then(
        (m) => m.ProductFormComponent
      ),
  },

  {
    path: 'warehouses',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/warehouses/pages/warehouse-list/warehouse-list.component').then(
        (m) => m.WarehouseListComponent
      ),
  },
  {
    path: 'warehouses/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/warehouses/pages/warehouse-form/warehouse-form.component').then(
        (m) => m.WarehouseFormComponent
      ),
  },
  {
    path: 'warehouses/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/warehouses/pages/warehouse-detail/warehouse-detail.component').then(
        (m) => m.WarehouseDetailComponent
      ),
  },
  {
    path: 'warehouses/:id/edit',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/warehouses/pages/warehouse-form/warehouse-form.component').then(
        (m) => m.WarehouseFormComponent
      ),
  },

  {
    path: 'categories',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/categories/pages/category-list/category-list.component').then(
        (m) => m.CategoryListComponent
      ),
  },
  {
    path: 'categories/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/categories/pages/category-form/category-form.component').then(
        (m) => m.CategoryFormComponent
      ),
  },
  {
    path: 'categories/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/categories/pages/category-detail/category-detail.component').then(
        (m) => m.CategoryDetailComponent
      ),
  },
  {
    path: 'categories/:id/edit',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/categories/pages/category-form/category-form.component').then(
        (m) => m.CategoryFormComponent
      ),
  },

  {
    path: 'units',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/units/pages/unit-list/unit-list.component').then(
        (m) => m.UnitListComponent
      ),
  },
  {
    path: 'units/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/units/pages/unit-form/unit-form.component').then(
        (m) => m.UnitFormComponent
      ),
  },
  {
    path: 'units/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/units/pages/unit-detail/unit-detail.component').then(
        (m) => m.UnitDetailComponent
      ),
  },
  {
    path: 'units/:id/edit',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/units/pages/unit-form/unit-form.component').then(
        (m) => m.UnitFormComponent
      ),
  },

  {
    path: 'transactions',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/transactions/pages/transaction-list/transaction-list.component').then(
        (m) => m.TransactionListComponent
      ),
  },
  {
    path: 'transactions/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/transactions/pages/transaction-form/transaction-form.component').then(
        (m) => m.TransactionFormComponent
      ),
  },
  {
    path: 'transactions/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/transactions/pages/transaction-detail/transaction-detail.component').then(
        (m) => m.TransactionDetailComponent
      ),
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
    loadComponent: () =>
      import('./features/partners/pages/partner-list/partner-list.component').then(
        (m) => m.PartnerListComponent
      ),
  },
  {
    path: 'partners/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/partners/pages/partner-form/partner-form.component').then(
        (m) => m.PartnerFormComponent
      ),
  },
  {
    path: 'partners/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/partners/pages/partner-detail/partner-detail.component').then(
        (m) => m.PartnerDetailComponent
      ),
  },
  {
    path: 'partners/:id/edit',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/partners/pages/partner-form/partner-form.component').then(
        (m) => m.PartnerFormComponent
      ),
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
