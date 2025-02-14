import React, { Suspense, useRef, useState, useEffect } from 'react';
import { GlobalCanvas, SmoothScrollbar } from '@14islands/r3f-scroll-rig';
import { Environment } from '@react-three/drei';
import style from './Home.module.scss';
import { Lens } from '../Common/Lens';
import PropTypes from 'prop-types';
import Face from './face';
import Shape from './shape';
import { WebGLBackground } from '../Common/WebGLBackground';
import Arrow from '../Common/Arrow';
import FontFaceObserver from 'fontfaceobserver';
import { toggleMusicPlaying, toggleModelFloating, toggleModelActive } from '../../redux/home/home.action';
import { selectIsFloating, selectIsActive } from '../../redux/home/home.selector';
import { useSelector, useDispatch } from 'react-redux';
import dynamic from 'next/dynamic';

const Header = dynamic(() => import('./Header').then(mod => mod.Header), { ssr: false });

export default function Home () {
    const dispatch = useDispatch();
    const eventSource = useRef();
    const headerEl = useRef();
    const enabled = true;
    const [mouseMove, handleMouseMove] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isScrollDown, setIsScrollDown] = useState(false);
    const isFloating = useSelector(selectIsFloating);
    const isActive = useSelector(selectIsActive);

    const handleClick = () => {
        if (!isActive) {
            dispatch(toggleModelFloating(!isFloating));
            dispatch(toggleModelActive(true));
            dispatch(toggleMusicPlaying(true));
        }
    };

    useEffect(() => {
        const rationle = new FontFaceObserver('Rationale');
        const lato = new FontFaceObserver('Lato');
        const montserrat = new FontFaceObserver('Montserrat');

        Promise.all([rationle.load(), lato.load(), montserrat.load()])
            .then(() => {
                setTimeout(() => {
                    setIsLoaded(true);
                }, 300);
            })
            .catch(() => {
                console.error('error');
            });
    }, []);

    return (
        <div
            className={style.el}
            ref={eventSource}
            onPointerMove={e => {
                handleMouseMove(e);
            }}
            style={{ background: '#57f6b4' }}
        >
            <GlobalCanvas
                debug={false}
                scaleMultiplier={0.01}
                eventSource={eventSource}
                eventPrefix='client'
                flat
                camera={{ fov: 14 }}
            >
                {globalChildren => (
                    <Lens>
                        <WebGLBackground isHome />
                        <Suspense fallback=''>
                            {isLoaded && <Environment files='/env/empty_warehouse_01_1k.hdr' />}
                            {globalChildren}
                        </Suspense>
                    </Lens>
                )}
            </GlobalCanvas>
            <SmoothScrollbar enabled={enabled} config={{ syncTouch: true }}>
                {bind => (
                    <section {...bind} ref={headerEl}>
                        <section {...bind} ref={headerEl}>
                            <div className={[style.container, 'container'].join(' ')}>
                                <Shape isLoaded={isLoaded} handleClick={handleClick} isScrollDown={isScrollDown} />
                                {isLoaded && <Face event={mouseMove} isLoaded={isLoaded} />}
                            </div>
                            <div className={style.headerContainer}>
                                <div className={style.item} />
                                <Header headerEl={headerEl} setIsScrollDown={setIsScrollDown} />
                            </div>
                        </section>
                        <Arrow />
                    </section>
                )}
            </SmoothScrollbar>
        </div>
    );
}

Home.propTypes = {
    headline: PropTypes.string,
    content: PropTypes.array,
    image: PropTypes.array,
    index: PropTypes.number,
    color: PropTypes.string,
};
