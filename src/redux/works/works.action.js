export const SET_WHEEL_DATA = 'SET_WHEEL_DATA';
export const SET_POINTER_DATA = 'SET_POINTER_DATA';
export const SET_IS_ACTIVE = 'SET_IS_ACTIVE';
export const SET_IS_LOADING = 'SET_IS_LOADING';
export const SET_IS_SUCCESS = 'SET_IS_SUCCESS';
export const SET_IS_CAROUSEL = 'SET_IS_CAROUSEL';
export const SET_IS_DETAILPAGE = 'SET_IS_DETAILPAGE';
export const SET_DATA_URL = 'SET_DATA_URL';
export const SET_CURRENT_COLOR = 'SET_CURRENT_COLOR';
export const SET_CURRENT_INDEX = 'SET_CURRENT_INDEX';

export const setWheelData = (wheelData) => {
    return async dispatch => {
        dispatch({
            type: SET_WHEEL_DATA,
            payload: wheelData,
        });
    };
};

export const setPointerData = (pointerData) => {
    return async dispatch => {
        dispatch({
            type: SET_POINTER_DATA,
            payload: pointerData,
        });
    };
};

export const setIsActive = (isActive) => {
    return async dispatch => {
        dispatch({
            type: SET_IS_ACTIVE,
            payload: isActive,
        });
    };
};

export const setIsLoading = (isLoading) => {
    return async dispatch => {
        dispatch({
            type: SET_IS_LOADING,
            payload: isLoading,
        });
    };
};

export const setIsSuccess = (isSuccess) => {
    return async dispatch => {
        dispatch({
            type: SET_IS_SUCCESS,
            payload: isSuccess,
        });
    };
};

export const setIsCarousel = (isCarousel) => {
    return async dispatch => {
        dispatch({
            type: SET_IS_CAROUSEL,
            payload: isCarousel,
        });
    };
};

export const setIsDetailPage = (isDetailPage) => {
    return async dispatch => {
        dispatch({
            type: SET_IS_CAROUSEL,
            payload: isDetailPage,
        });
    };
};

export const setCurrentColor = (currentColor) => {
    return async dispatch => {
        dispatch({
            type: SET_CURRENT_COLOR,
            payload: currentColor,
        });
    };
};

export const setDataUrl = (dataUrl) => {
    return async dispatch => {
        dispatch({
            type: SET_DATA_URL,
            payload: dataUrl,
        });
    };
};
