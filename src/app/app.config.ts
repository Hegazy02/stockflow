import {
  ApplicationConfig,
  isDevMode,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { productsReducer } from './features/products/store/products.reducer';
import { warehousesReducer } from './features/warehouses/store/warehouses.reducer';
import { stockReducer } from './features/stock/store/stock.reducer';
import { transfersReducer } from './features/transfers/store/transfers.reducer';
import { stockHistoryReducer } from './features/stock-history/store/stock-history.reducer';
import { ProductsEffects } from './features/products/store/products.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore({
      products: productsReducer,
      warehouses: warehousesReducer,
      stock: stockReducer,
      transfers: transfersReducer,
      stockHistory: stockHistoryReducer,
    }),
    provideEffects([ProductsEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
    }),
  ],
};
