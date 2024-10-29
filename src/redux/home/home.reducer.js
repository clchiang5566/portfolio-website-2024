const initialState = {
    isPlaying: false,
    isFloating: false,
    isZoom: false,
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
        case 'TV_ACTIVE':
            return {
                ...state,
                isZoom: action.payload.isZoom,
            };
        default:
            return state;
    }
};
