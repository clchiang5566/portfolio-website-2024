import { fromJS, Map } from 'immutable';
import { createReducer } from '@reduxjs/toolkit';

import { GET_PAGE_START, GET_PAGE_SUCCESS, GET_PAGE_ERROR } from './page.action';

const initialState = fromJS({
    pageData: {},
    pageInit: false,
    pageLoading: false,
});

export const page = createReducer(initialState, builder => {
    builder
        .addCase(GET_PAGE_START, (state, action) => {
            return state.withMutations(ctx => {
                ctx.set('pageInit', true);
                ctx.set('pageLoading', true);
                ctx.set('pageData', new Map({}));
            });
        })
        .addCase(GET_PAGE_SUCCESS, (state, action) => {
            return state.withMutations(ctx => {
                ctx.set('pageLoading', false);
                ctx.set('pageData', new Map(action.payload.data));
            });
        })
        .addCase(GET_PAGE_ERROR, (state, action) => {
            return state.withMutations(ctx => {
                ctx.set('pageLoading', true);
                ctx.set('pageData', new Map({}));
            });
        });
});
