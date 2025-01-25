export const SET_WHEEL_DATA = 'SET_WHEEL_DATA';
export const SET_POINTER_DATA = 'SET_POINTER_DATA';
export const SET_SCROLL_DATA = 'SET_SCROLL_DATA';
export const SET_PAGE_CONTENT = 'SET_PAGE_CONTENT';
export const SET_IS_ACTIVE = 'SET_IS_ACTIVE';
export const SET_IS_LOADING = 'SET_IS_LOADING';
export const SET_IS_SUCCESS = 'SET_IS_SUCCESS';
export const SET_IS_CAROUSEL = 'SET_IS_CAROUSEL';
export const SET_IS_DETAILPAGE = 'SET_IS_DETAILPAGE';
export const SET_IS_PREVENT = 'SET_IS_PREVENT';
export const SET_IS_POSTER = 'SET_IS_POSTER';
export const SET_IS_HOVER = 'SET_IS_HOVER';
export const SET_DATA_URL = 'SET_DATA_URL';
export const SET_CURRENT_COLOR = 'SET_CURRENT_COLOR';
export const SET_CURRENT_INDEX = 'SET_CURRENT_INDEX';
export const RESET_FIELDS = 'RESET_FIELDS';
export const UPDATE_INITIAL_FIELDS = 'UPDATE_INITIAL_FIELDS';
export const UPDATE_DETAIL = 'UPDATE_DETAIL';
export const UPDATE_CAROUSEL = 'UPDATE_CAROUSEL';

export const setWheelData = wheelData => {
    return async dispatch => {
        dispatch({
            type: SET_WHEEL_DATA,
            payload: wheelData,
        });
    };
};

export const setPointerData = pointerData => {
    return async dispatch => {
        dispatch({
            type: SET_POINTER_DATA,
            payload: pointerData,
        });
    };
};

export const setScrollData = scrollData => {
    return async dispatch => {
        dispatch({
            type: SET_SCROLL_DATA,
            payload: scrollData,
        });
    };
};

export const setPageContent = pageContent => {
    return async dispatch => {
        dispatch({
            type: SET_PAGE_CONTENT,
            payload: pageContent,
        });
    };
};

export const setIsActive = isActive => {
    return async dispatch => {
        dispatch({
            type: SET_IS_ACTIVE,
            payload: isActive,
        });
    };
};

export const setIsLoading = isLoading => {
    return async dispatch => {
        dispatch({
            type: SET_IS_LOADING,
            payload: isLoading,
        });
    };
};

export const setIsSuccess = isSuccess => {
    return async dispatch => {
        dispatch({
            type: SET_IS_SUCCESS,
            payload: isSuccess,
        });
    };
};

export const setIsCarousel = isCarousel => {
    return async dispatch => {
        dispatch({
            type: SET_IS_CAROUSEL,
            payload: isCarousel,
        });
    };
};

export const setIsPrevent = isPrevent => {
    return async dispatch => {
        dispatch({
            type: SET_IS_PREVENT,
            payload: isPrevent,
        });
    };
};

export const setIsPoster = isPoster => {
    return async dispatch => {
        dispatch({
            type: SET_IS_POSTER,
            payload: isPoster,
        });
    };
};

export const setIsDetailPage = isDetailPage => {
    return async dispatch => {
        dispatch({
            type: SET_IS_DETAILPAGE,
            payload: isDetailPage,
        });
    };
};

export const setIsHover = isHover => {
    return async dispatch => {
        dispatch({
            type: SET_IS_HOVER,
            payload: isHover,
        });
    };
};

export const setCurrentColor = currentColor => {
    return async dispatch => {
        dispatch({
            type: SET_CURRENT_COLOR,
            payload: currentColor,
        });
    };
};

export const setCurrentIndex = currentIndex => {
    return async dispatch => {
        dispatch({
            type: SET_CURRENT_INDEX,
            payload: currentIndex,
        });
    };
};

export const setDataUrl = dataUrl => {
    return async dispatch => {
        dispatch({
            type: SET_DATA_URL,
            payload: dataUrl,
        });
    };
};

export const updateInitialFields = payload => {
    return async dispatch => {
        dispatch({
            type: UPDATE_INITIAL_FIELDS,
            payload,
        });
    };
};

export const updateDetail = payload => {
    return async dispatch => {
        dispatch({
            type: UPDATE_DETAIL,
            payload,
        });
    };
};

export const updateCarousel = payload => {
    return async dispatch => {
        dispatch({
            type: UPDATE_CAROUSEL,
            payload,
        });
    };
};

export const resetFields = () => {
    return async dispatch => {
        dispatch({
            type: RESET_FIELDS,
        });
    };
};
