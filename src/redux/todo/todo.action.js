export const ADD_TODO = 'ADD_TODO';
export const TOGGLE_TODO = 'TOGGLE_TODO';
export const REMOVE_TODO = 'REMOVE_TODO';
export const RESET_TODO = 'RESET_TODO';

export const addTodo = (id, text) => {
    return async dispatch => {
        dispatch({
            type: ADD_TODO,
            payload: {
                id,
                text,
                completed: false,
            },
        });
    };
};

export const toggleTodo = id => {
    return async dispatch => {
        dispatch({
            type: TOGGLE_TODO,
            payload: {
                id,
            },
        });
    };
};

export const removeTodo = id => {
    return async dispatch => {
        dispatch({
            type: REMOVE_TODO,
            payload: {
                id,
            },
        });
    };
};

export const resetTodo = () => {
    return async dispatch => {
        dispatch({
            type: RESET_TODO,
        });
    };
};
