import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Partner } from '../models/partner.model';
import { Pagination } from '../../../core/models/api-response';
import * as PartnersActions from './partners.actions';

export interface PartnersState extends EntityState<Partner> {
  loading: boolean;
  error: any;
  pagination: Pagination;
}

export const partnersAdapter: EntityAdapter<Partner> = createEntityAdapter<Partner>({
  selectId: (partner: Partner) => partner._id,
  sortComparer: false,
});

export const initialState: PartnersState = partnersAdapter.getInitialState({
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  },
});

export const partnersReducer = createReducer(
  initialState,
  // Load Partners
  on(PartnersActions.loadPartners, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(PartnersActions.loadPartnersSuccess, (state, { partners, pagination }) =>
    partnersAdapter.setAll(partners, {
      ...state,
      loading: false,
      error: null,
      pagination,
    })
  ),
  on(PartnersActions.loadPartnersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Get Partner By ID
  on(PartnersActions.getPartnerById, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(PartnersActions.getPartnerByIdSuccess, (state, { partner }) =>
    partnersAdapter.upsertOne(partner, {
      ...state,
      loading: false,
      error: null,
    })
  ),
  on(PartnersActions.getPartnerByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create Partner
  on(PartnersActions.createPartner, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(PartnersActions.createPartnerSuccess, (state, { partner }) =>
    partnersAdapter.addOne(partner, { ...state, loading: false, error: null })
  ),
  on(PartnersActions.createPartnerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update Partner
  on(PartnersActions.updatePartner, (state) => ({ ...state, loading: true, error: null })),
  on(PartnersActions.updatePartnerSuccess, (state, { partner }) =>
    partnersAdapter.updateOne(
      {
        id: partner._id,
        changes: partner,
      },
      {
        ...state,
        loading: false,
        error: null,
      }
    )
  ),
  on(PartnersActions.updatePartnerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete Partners
  on(PartnersActions.deletePartners, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(PartnersActions.deletePartnersSuccess, (state, { ids }) =>
    partnersAdapter.removeMany(ids, {
      ...state,
      loading: false,
      error: null,
    })
  ),
  on(PartnersActions.deletePartnersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
