import { fromJS, List } from 'immutable';
import { createReducer } from '@reduxjs/toolkit';

import { SET_WHEEL_DATA, SET_POINTER_DATA, SET_IS_ACTIVE, SET_IS_LOADING, SET_IS_SUCCESS, SET_IS_CAROUSEL, SET_IS_DETAILPAGE, SET_DATA_URL, SET_CURRENT_COLOR, SET_CURRENT_INDEX } from './works.action';

const initialState = fromJS({
    wheelData: null,
    pointerData: null,
    currentColor: '#cce1f3',
    isActive: false,
    isLoading: false,
    isSuccess: false,
    isCarousel: false,
    isDetailPage: false,
    dataUrl: null,
});

export const works = createReducer(initialState, builder => {
    builder
        .addCase(SET_WHEEL_DATA, (state, action) => {
            return state.set('wheelData', fromJS(action.payload));
        })
        .addCase(SET_POINTER_DATA, (state, action) => {
            return state.set('pointerData', fromJS(action.payload));
        })
        .addCase(SET_CURRENT_COLOR, (state, action) => {
            return state.set('currentColor', action.payload);
        })
        .addCase(SET_CURRENT_INDEX, (state, action) => {
            return state.set('currentIndex', action.payload);
        })
        .addCase(SET_IS_ACTIVE, (state, action) => {
            return state.set('isActive', action.payload);
        })
        .addCase(SET_IS_LOADING, (state, action) => {
            return state.set('isLoading', action.payload);
        })
        .addCase(SET_IS_SUCCESS, (state, action) => {
            return state.set('isSuccess', action.payload);
        })
        .addCase(SET_IS_CAROUSEL, (state, action) => {
            return state.set('isCarousel', action.payload);
        })
        .addCase(SET_IS_DETAILPAGE, (state, action) => {
            return state.set('isDetailPage', action.payload);
        })
        .addCase(SET_DATA_URL, (state, action) => {
            return state.set('dataUrl', action.payload);
        })
});
