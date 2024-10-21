import React from 'react';
import ReactHowler from 'react-howler';
import { useSelector } from 'react-redux';
import { selectIsPlaying } from '../../redux/home/home.selector';

const BackgroundMusic = () => {
    const isPlaying = useSelector(selectIsPlaying);

    return (
        <div>
            <ReactHowler src='/audio/background.mp3' playing={isPlaying} volume={0.6} loop />
        </div>
    );
};

export default BackgroundMusic;
