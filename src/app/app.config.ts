import {
  ApplicationConfig,
  isDevMode,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { productsReducer } from './features/products/store/products.reducer';
import { warehousesReducer } from './features/warehouses/store/warehouses.reducer';
import { stockReducer } from './features/stock/store/stock.reducer';
import { transfersReducer } from './features/transfers/store/transfers.reducer';
import { stockHistoryReducer } from './features/stock-history/store/stock-history.reducer';
import { categoriesReducer } from './features/categories/store/categories.reducer';
import { ProductsEffects } from './features/products/store/products.effects';
import { CategoriesEffects } from './features/categories/store/categories.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([errorInterceptor])),
    provideAnimationsAsync(),
    MessageService,
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: false,
        },
      },
    }),
    provideStore({
      products: productsReducer,
      warehouses: warehousesReducer,
      stock: stockReducer,
      transfers: transfersReducer,
      stockHistory: stockHistoryReducer,
      categories: categoriesReducer,
    }),
    provideEffects([ProductsEffects, CategoriesEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
    }),
  ],
};


