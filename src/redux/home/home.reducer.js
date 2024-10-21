const initialState = {
    isPlaying: false,
    isFloating: false,
    isActive: false,
};

export const homeReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'MUSIC_PLAY':
            return {
                ...state,
                isPlaying: action.payload.isPlaying,
            };
        case 'MODEL_FLOATING':
            return {
                ...state,
                isFloating: action.payload.isFloating,
            };
        case 'MODEL_ACTIVE':
            return {
                ...state,
                isActive: action.payload.isActive,
            };
        default:
            return state;
    }
};
