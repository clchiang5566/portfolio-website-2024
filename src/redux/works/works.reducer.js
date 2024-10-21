import { fromJS, List } from 'immutable';
import { createReducer } from '@reduxjs/toolkit';

import { ADD_WORKS, RESET_WORKS } from './works.action';

const initialState = fromJS({
    works: [],
});

export const works = createReducer(initialState, builder => {
    builder
        .addCase(ADD_WORKS, (state, action) => {
            return state.withMutations(ctx => {
                ctx.set('works', ctx.get('works').push(action.payload));
            });
        })
        .addCase(RESET_WORKS, (state, action) => {
            return state.withMutations(ctx => {
                ctx.set('works', new List());
            });
        });
});
