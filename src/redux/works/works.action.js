export const ADD_WORKS = 'ADD_WORKS';
export const RESET_WORKS = 'RESET_WORKS';

export const addWorks = (currentIndex, color, isBack) => {
    return async dispatch => {
        dispatch({
            type: ADD_WORKS,
            payload: {
                currentIndex,
                color,
                isBack,
            },
        });
    };
};

export const resetWorks = () => {
    return async dispatch => {
        dispatch({
            type: RESET_WORKS,
        });
    };
};
