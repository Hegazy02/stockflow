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

  //   {
  //     path: 'warehouses',
  //     canActivate: [authGuard],
  //     loadComponent: () => import('./features/warehouses/components/warehouse-list/warehouse-list.component')
  //       .then(m => m.WarehouseListComponent),
  //     children: [
  //       {
  //         path: 'new',
  //         loadComponent: () => import('./features/warehouses/components/warehouse-form/warehouse-form.component')
  //           .then(m => m.WarehouseFormComponent)
  //       },
  //       {
  //         path: ':id',
  //         loadComponent: () => import('./features/warehouses/components/warehouse-detail/warehouse-detail.component')
  //           .then(m => m.WarehouseDetailComponent)
  //       },
  //       {
  //         path: ':id/edit',
  //         loadComponent: () => import('./features/warehouses/components/warehouse-form/warehouse-form.component')
  //           .then(m => m.WarehouseFormComponent)
  //       }
  //     ]
  //   },
  //   {
  //     path: 'stock',
  //     canActivate: [authGuard],
  //     loadComponent: () => import('./features/stock/components/stock-list/stock-list.component')
  //       .then(m => m.StockListComponent),
  //     children: [
  //       {
  //         path: 'adjust',
  //         loadComponent: () => import('./features/stock/components/stock-adjustment/stock-adjustment.component')
  //           .then(m => m.StockAdjustmentComponent)
  //       }
  //     ]
  //   },
  //   {
  //     path: 'transfers',
  //     canActivate: [authGuard],
  //     loadComponent: () => import('./features/transfers/components/transfer-list/transfer-list.component')
  //       .then(m => m.TransferListComponent),
  //     children: [
  //       {
  //         path: 'new',
  //         loadComponent: () => import('./features/transfers/components/transfer-form/transfer-form.component')
  //           .then(m => m.TransferFormComponent)
  //       },
  //       {
  //         path: ':id',
  //         loadComponent: () => import('./features/transfers/components/transfer-detail/transfer-detail.component')
  //           .then(m => m.TransferDetailComponent)
  //       }
  //     ]
  //   },
  //   {
  //     path: 'history',
  //     canActivate: [authGuard],
  //     loadComponent: () => import('./features/stock-history/components/stock-history-list/stock-history-list.component')
  //       .then(m => m.StockHistoryListComponent),
  //     children: [
  //       {
  //         path: ':id',
  //         loadComponent: () => import('./features/stock-history/components/stock-history-detail/stock-history-detail.component')
  //           .then(m => m.StockHistoryDetailComponent)
  //       }
  //     ]
  //   },
  {
    path: '**',
    redirectTo: '/products',
  },
];
