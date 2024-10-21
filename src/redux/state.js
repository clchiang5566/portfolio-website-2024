import { global } from './global/global.reducer';
import { page } from './page/page.reducer';
import { todo } from './todo/todo.reducer';
import { works } from './works/works.reducer';
import { homeReducer } from './home/home.reducer';

import { combineReducers } from '@reduxjs/toolkit';

export const rootReducer = combineReducers({
    global,
    page,
    todo,
    works,
    home: homeReducer,
});
