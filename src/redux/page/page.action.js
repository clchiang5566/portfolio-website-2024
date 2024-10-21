import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { internalInstance } from '../../utils/httpinstance';

export const GET_PAGE_START = createAction('GET_PAGE_START');
export const GET_PAGE_SUCCESS = createAction('GET_PAGE_SUCCESS');
export const GET_PAGE_ERROR = createAction('GET_PAGE_ERROR');
export const UPDATE_PAGE_DATA = createAction('UPDATE_PAGE_DATA');

export const getPage = createAsyncThunk(
    'page/getPage',
    async ({ path, lang, preview, pageId }, { rejectWithValue, dispatch }) => {
        dispatch({ type: GET_PAGE_START });
        await internalInstance
            .get(
                `/api/dummypage?path=${encodeURIComponent(
                    path
                )}&lang=${lang}&preview=${preview}&pageId=${encodeURIComponent(pageId)}`
            )
            .then(res => {
                dispatch({
                    type: GET_PAGE_SUCCESS,
                    payload: {
                        data: res.data,
                    },
                });
            })
            .catch(() => {
                dispatch({ type: GET_PAGE_ERROR });
            });
    }
);
