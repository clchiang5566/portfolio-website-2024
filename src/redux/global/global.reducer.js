import { fromJS, Map } from 'immutable';
import { createReducer } from '@reduxjs/toolkit';

import { GET_GLOBAL_START, GET_GLOBAL_SUCCESS, GET_GLOBAL_ERROR } from './global.action';

const initialState = fromJS({
    globalData: {},
    globalInit: false,
    globalLoading: false,
    globalLang: '',
});

export const global = createReducer(initialState, builder => {
    builder
        .addCase(GET_GLOBAL_START, (state, action) => {
            return state.withMutations(ctx => {
                ctx.set('globalInit', true);
                ctx.set('globalLoading', true);
                ctx.set('globalData', new Map({}));
                ctx.set('globalLang', new Map(action.payload));
            });
        })
        .addCase(GET_GLOBAL_SUCCESS, (state, action) => {
            return state.withMutations(ctx => {
                ctx.set('globalLoading', false);
                ctx.set('globalData', new Map(action.payload.data));
            });
        })
        .addCase(GET_GLOBAL_ERROR, (state, action) => {
            return state.withMutations(ctx => {
                ctx.set('globalLoading', true);
                ctx.set('globalData', new Map({}));
            });
        });
});
