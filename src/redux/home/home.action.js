export const MUSIC_PLAY = 'MUSIC_PLAY';
export const MODEL_FLOATING = 'MODEL_FLOATING';
export const MODEL_ACTIVE = 'MODEL_ACTIVE';
export const TV_ACTIVE = 'TV_ACTIVE';

export const toggleMusicPlaying = isPlaying => {
    return {
        type: 'MUSIC_PLAY',
        payload: { isPlaying },
    };
};

export const toggleModelFloating = isFloating => {
    return {
        type: 'MODEL_FLOATING',
        payload: { isFloating },
    };
};

export const toggleModelActive = isActive => {
    return {
        type: 'MODEL_ACTIVE',
        payload: { isActive },
    };
};

export const toggleTelevision = isZoom => {
    return {
        type: 'TV_ACTIVE',
        payload: { isZoom },
    };
};
