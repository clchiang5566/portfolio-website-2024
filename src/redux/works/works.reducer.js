import { fromJS } from 'immutable';
import { createReducer } from '@reduxjs/toolkit';

import {
    SET_WHEEL_DATA,
    SET_POINTER_DATA,
    SET_SCROLL_DATA,
    SET_PAGE_CONTENT,
    SET_IS_ACTIVE,
    SET_IS_LOADING,
    SET_IS_SUCCESS,
    SET_IS_CAROUSEL,
    SET_IS_DETAILPAGE,
    SET_IS_PREVENT,
    SET_IS_POSTER,
    SET_IS_HOVER,
    SET_IS_VERTICAL,
    SET_IS_TEXTREADY,
    SET_DATA_URL,
    SET_CURRENT_COLOR,
    SET_CURRENT_INDEX,
    RESET_FIELDS,
    UPDATE_INITIAL_FIELDS,
    UPDATE_CAROUSEL,
    UPDATE_DETAIL,
} from './works.action';

const initialState = fromJS({
    wheelData: null,
    pointerData: null,
    scrolldata: null,
    pageContent: null,
    currentColor: '#cce1f3',
    currentIndex: 0,
    isActive: false,
    isLoading: false,
    isSuccess: false,
    isCarousel: false,
    isPrevent: true,
    isDetailPage: false,
    isPoster: false,
    isHover: false,
    isVertical: true,
    isTextReady: false,
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
        .addCase(SET_SCROLL_DATA, (state, action) => {
            return state.set('scrollData', fromJS(action.payload));
        })
        .addCase(SET_PAGE_CONTENT, (state, action) => {
            return state.set('pageContent', action.payload);
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
        .addCase(SET_IS_PREVENT, (state, action) => {
            return state.set('isPrevent', action.payload);
        })
        .addCase(SET_IS_DETAILPAGE, (state, action) => {
            return state.set('isDetailPage', action.payload);
        })
        .addCase(SET_IS_POSTER, (state, action) => {
            return state.set('isPoster', action.payload);
        })
        .addCase(SET_IS_HOVER, (state, action) => {
            return state.set('isHover', action.payload);
        })
        .addCase(SET_IS_VERTICAL, (state, action) => {
            return state.set('isVertical', action.payload);
        })
        .addCase(SET_IS_TEXTREADY, (state, action) => {
            return state.set('isTextReady', action.payload);
        })
        .addCase(SET_DATA_URL, (state, action) => {
            return state.set('dataUrl', action.payload);
        })
        .addCase(RESET_FIELDS, state => {
            return state
                .set('currentColor', initialState.get('currentColor'))
                .set('currentIndex', initialState.get('currentIndex'))
                .set('isDetailPage', initialState.get('isDetailPage'))
                .set('isPoster', initialState.get('isPoster'))
                .set('pageContent', initialState.get('pageContent'));
        })
        .addCase(UPDATE_INITIAL_FIELDS, (state, action) => {
            const { currentColor, currentIndex, isDetailPage, isPoster, pageContent } = action.payload;
            return state
                .set('currentColor', currentColor)
                .set('currentIndex', currentIndex)
                .set('isDetailPage', isDetailPage)
                .set('isPoster', isPoster)
                .set('pageContent', pageContent);
        })
        .addCase(UPDATE_CAROUSEL, (state, action) => {
            const { isPoster, isCarousel, isLoading, isDetailPage } = action.payload;
            return state
                .set('isPoster', isPoster)
                .set('isCarousel', isCarousel)
                .set('isLoading', isLoading)
                .set('isDetailPage', isDetailPage);
        })
        .addCase(UPDATE_DETAIL, (state, action) => {
            const { isPoster, isActive, isSuccess, isLoading, isDetailPage, pageContent } = action.payload;
            return state
                .set('isPoster', isPoster)
                .set('isActive', isActive)
                .set('isSuccess', isSuccess)
                .set('isLoading', isLoading)
                .set('isDetailPage', isDetailPage)
                .set('pageContent', pageContent);
        });
});
