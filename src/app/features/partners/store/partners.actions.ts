import { createAction, props } from '@ngrx/store';
import { Partner } from '../models/partner.model';
import { Pagination } from '../../../core/models/api-response';

// Load Partners
export const loadPartners = createAction(
  '[Partners] Load Partners',
  props<{ page?: number; limit?: number }>()
);
export const loadPartnersSuccess = createAction(
  '[Partners] Load Partners Success',
  props<{ partners: Partner[]; pagination: Pagination }>()
);
export const loadPartnersFailure = createAction(
  '[Partners] Load Partners Failure',
  props<{ error: any }>()
);

// Change Page
export const changePage = createAction(
  '[Partners] Change Page',
  props<{ page: number; limit: number }>()
);

// Get Partner By ID
export const getPartnerById = createAction(
  '[Partners] Get Partner By ID',
  props<{ id: string }>()
);
export const getPartnerByIdSuccess = createAction(
  '[Partners] Get Partner By ID Success',
  props<{ partner: Partner }>()
);
export const getPartnerByIdFailure = createAction(
  '[Partners] Get Partner By ID Failure',
  props<{ error: any }>()
);

// Create Partner
export const createPartner = createAction(
  '[Partners] Create Partner',
  props<{ partner: Omit<Partner, '_id' | 'createdAt' | 'updatedAt'> }>()
);
export const createPartnerSuccess = createAction(
  '[Partners] Create Partner Success',
  props<{ partner: Partner }>()
);
export const createPartnerFailure = createAction(
  '[Partners] Create Partner Failure',
  props<{ error: any }>()
);

// Update Partner
export const updatePartner = createAction(
  '[Partners] Update Partner',
  props<{ partner: Partner }>()
);
export const updatePartnerSuccess = createAction(
  '[Partners] Update Partner Success',
  props<{ partner: Partner }>()
);
export const updatePartnerFailure = createAction(
  '[Partners] Update Partner Failure',
  props<{ error: any }>()
);

// Delete Partners
export const deletePartners = createAction(
  '[Partners] Delete Partners',
  props<{ ids: string[] }>()
);
export const deletePartnersSuccess = createAction(
  '[Partners] Delete Partners Success',
  props<{ ids: string[] }>()
);
export const deletePartnersFailure = createAction(
  '[Partners] Delete Partners Failure',
  props<{ error: any }>()
);
