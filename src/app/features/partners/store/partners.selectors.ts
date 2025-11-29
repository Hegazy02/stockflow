import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PartnersState, partnersAdapter } from './partners.reducer';

export const selectPartnersState = createFeatureSelector<PartnersState>('partners');

const { selectAll, selectEntities } = partnersAdapter.getSelectors();

export const selectAllPartners = createSelector(selectPartnersState, selectAll);

export const selectPartnerEntities = createSelector(selectPartnersState, selectEntities);

export const selectPartnersLoading = createSelector(
  selectPartnersState,
  (state) => state.loading
);

export const selectPartnersError = createSelector(selectPartnersState, (state) => state.error);

export const selectPartnersPagination = createSelector(
  selectPartnersState,
  (state) => state.pagination
);

export const selectTotalRecords = createSelector(
  selectPartnersPagination,
  (pagination) => pagination.total
);

export const selectCurrentPage = createSelector(
  selectPartnersPagination,
  (pagination) => pagination.page
);

export const selectPageSize = createSelector(
  selectPartnersPagination,
  (pagination) => pagination.limit
);

export const selectPartnerById = (id: string) =>
  createSelector(selectPartnerEntities, (entities) => entities[id]);
