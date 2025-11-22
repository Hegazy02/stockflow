import { createFeatureSelector, createSelector } from '@ngrx/store';
import { StockState } from './stock.reducer';
import { StockLevel } from '../models/stock-level.model';

export const selectStockState = createFeatureSelector<StockState>('stock');

// Selector to get stock levels by product ID
export const selectStockByProduct = (productId: string) =>
  createSelector(selectStockState, (state: any): StockLevel[] => {
    // This will be implemented when stock reducer is complete
    // For now, return empty array
    return [];
  });

// Selector to get stock by product and warehouse
export const selectStockByProductAndWarehouse = (productId: string, warehouseId: string) =>
  createSelector(selectStockState, (state: any): StockLevel | undefined => {
    // This will be implemented when stock reducer is complete
    return undefined;
  });
