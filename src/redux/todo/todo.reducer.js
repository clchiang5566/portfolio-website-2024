import { fromJS, List } from 'immutable';
import { createReducer } from '@reduxjs/toolkit';

import { ADD_TODO, TOGGLE_TODO, REMOVE_TODO, RESET_TODO } from './todo.action';

const initialState = fromJS({
    todo: [],
});

export const todo = createReducer(initialState, builder => {
    builder
        .addCase(ADD_TODO, (state, action) => {
            return state.withMutations(ctx => {
                ctx.set('todo', ctx.get('todo').push(action.payload));
            });
        })
        .addCase(TOGGLE_TODO, (state, action) => {
            return state.withMutations(ctx => {
                const todo = ctx.get('todo')[action.payload.index];
                todo.completed = !todo.completed;
            });
        })
        .addCase(REMOVE_TODO, (state, action) => {
            return state.withMutations(ctx => ctx.get('todo').filter((todo, i) => i !== action.payload.index));
        })
        .addCase(RESET_TODO, (state, action) => {
            return state.withMutations(ctx => {
                ctx.set('todo', new List());
            });
        });
});
