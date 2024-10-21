import React from 'react'; // { useState, useEffect }
import PropTypes from 'prop-types';
import { SmartLink } from '../SmartLink';
// import { useRouter } from 'next/router';
// import { useRouter } from 'next/router';
// import { useMediaQuery } from '@react-hook/media-query';
import { useSelector, useDispatch } from 'react-redux';
import { toggleMusicPlaying } from '../../redux/home/home.action';
import { selectIsPlaying } from '../../redux/home/home.selector';
import GlitchHoverText from '../Common/GlitchHoverText';

import style from './Header.module.scss';

const Header = props => {
    const { navigation } = props;
    const dispatch = useDispatch();
    // const [minimize, setMinimize] = useState(false);
    const isPlaying = useSelector(selectIsPlaying);
    // const router = useRouter();

    const handleMusicClick = () => {
        dispatch(toggleMusicPlaying(!isPlaying));
    };

    // useEffect(() => {
    //     let prevScrollpos = window.pageYOffset;

    //     const handleWindowScroll = () => {
    //         const currentScrollPos = window.pageYOffset;

    //         if (prevScrollpos > currentScrollPos) {
    //             setMinimize(false);
    //         } else {
    //             setMinimize(true);
    //         }

    //         if (currentScrollPos < 100) {
    //             setMinimize(false);
    //         }

    //         prevScrollpos = currentScrollPos;
    //     };

    //     window.addEventListener('scroll', () => handleWindowScroll());

    //     return () => {
    //         window.removeEventListener('scroll', () => handleWindowScroll());
    //     };
    // }, [router.asPath]);
    // minimize ? style.minimize : null

    return (
        <header className={style.el}>
            <div className={[style.container, 'container'].join(' ')}>
                <div className={style.logo}>
                    <div className={style.name}>
                        <SmartLink href='/' key='home'>
                            <div className={style['name-item']}>
                                <div className={style['name-hide']}>江</div>
                                <div className={style['name-hide']}>忠</div>
                                <div>龍</div>
                            </div>
                            <div className={style['name-item']}>
                                <div>C</div>
                                <div className={style['name-hide']}>
                                    <GlitchHoverText text='HUNG-' duration={300} />
                                </div>
                                <div> L </div>
                                <div className={style['name-hide']}>
                                    <GlitchHoverText text='UNG' duration={300} />
                                </div>
                                <div>,CHIANG</div>
                            </div>
                        </SmartLink>
                    </div>
                </div>
                <div className={style.navigation}>
                    <div
                        className={[style['navigation-item'], !isPlaying ? style['navigation-off'] : null].join(' ')}
                        onClick={handleMusicClick}
                    >
                        <img src='/images/music.svg' />
                    </div>
                    {navigation.map((item, i) => (
                        <div className={style['navigation-item']} key={i}>
                            <SmartLink href={item.link} key={i}>
                                <GlitchHoverText text={item.text} duration={300} />
                            </SmartLink>
                        </div>
                    ))}
                </div>
            </div>
        </header>
    );
};

Header.propTypes = {
    logo: PropTypes.object,
    navigation: PropTypes.array,
};

export default Header;
