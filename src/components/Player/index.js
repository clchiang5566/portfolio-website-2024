import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { isMobile } from 'react-device-detect';
import videojs from 'video.js';
// import '@devmobiliza/videojs-vimeo/dist/videojs-vimeo.cjs';
import './videojs-vimeo.cjs';
import 'video.js/dist/video-js.min.css';
import 'videojs-youtube/dist/Youtube.min.js';
// import { getCookieConsentValue } from 'react-cookie-consent';

//* style
import style from './Player.module.scss';

const iOS = () => {
    return (
        ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(
            navigator.platform
        ) ||
        // iPad on iOS 13 detection
        (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
    );
};

const Player = ({ link, poster, isAutoPlay, onPlay }) => {
    const [playing, setPlaying] = useState(isAutoPlay);
    const videoEl = useRef(null);

    const videoPlay = link => {
        const vjsPlayer = videojs(videoEl.current, {
            sources: [
                {
                    src: link,
                    type:
                        link.indexOf('vimeo') > 0
                            ? 'video/vimeo'
                            : link.indexOf('youtube') > 0
                            ? 'video/youtube'
                            : 'video/mp4',
                },
            ],
            poster: poster,
            controlBar: {
                pictureInPictureToggle: true,
            },
            liveui: true,
            muted: isAutoPlay && iOS(),
            youtube: {
                // enablePrivacyEnhancedMode: getCookieConsentValue() === 'false' || getCookieConsentValue() === undefined,
                playsinline: false,
            },
            vimeo: {
                // dnt: getCookieConsentValue() === 'false' || getCookieConsentValue() === undefined,
                playsinline: false,
            },
            playsinline: false,
        });

        vjsPlayer.on('play', e => {
            if (onPlay) {
                onPlay();
            }
            if (link.indexOf('vimeo') < 0 && link.indexOf('youtube') < 0 && isMobile) {
                vjsPlayer.requestFullscreen();
            }
        });
    };

    useEffect(() => {
        if (link) videoPlay(link);
        document.querySelector('.vjs-big-play-button').addEventListener('click', () => {
            setPlaying(true);
        });
        document.querySelector('.vjs-poster').addEventListener('click', () => {
            setPlaying(true);
        });
    }, []);

    return (
        <div className={[style.el, playing ? style.hideButton : null].join(' ')}>
            <div className={style.container}>
                <div className={[style.videoFrame, link.indexOf('mp4') > 0 ? style.mp4 : null].join(' ')}>
                    <div data-vjs-player>
                        <video
                            ref={videoEl}
                            className={['video-js', style.video].join(' ')}
                            // playsInline
                            controls
                            autoPlay={isAutoPlay}
                            onContextMenu={e => {
                                e.preventDefault();
                                return false;
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

Player.propTypes = {
    link: PropTypes.string,
    poster: PropTypes.string,
    isAutoPlay: PropTypes.bool,
    onPlay: PropTypes.func,
};

export default Player;
