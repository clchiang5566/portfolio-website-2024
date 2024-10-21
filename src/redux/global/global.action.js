import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { internalInstance } from '../../utils/httpinstance';

export const GET_GLOBAL_START = createAction('GET_GLOBAL_START');
export const GET_GLOBAL_SUCCESS = createAction('GET_GLOBAL_SUCCESS');
export const GET_GLOBAL_ERROR = createAction('GET_GLOBAL_ERROR');
export const UPDATE_GLOBAL_DATA = createAction('UPDATE_GLOBAL_DATA');

export const getGlobal = createAsyncThunk('global/getGlobal', async (lang, { rejectWithValue, dispatch }) => {
    dispatch({ type: GET_GLOBAL_START });
    await internalInstance
        .get(`/api/global?language=${lang}`)
        .then(res => {
            dispatch({
                type: GET_GLOBAL_SUCCESS,
                payload: {
                    data: res.data,
                },
            });
        })
        .catch(() => {
            dispatch({ type: GET_GLOBAL_ERROR });
        });
});
