import React, { Suspense, useRef, useState, useEffect } from 'react';
import { GlobalCanvas, SmoothScrollbar } from '@14islands/r3f-scroll-rig';
import { Environment } from '@react-three/drei';
import style from './WorksDetail.module.scss';
import { WebGLBackground } from '../Common/WebGLBackground';
import { Lens } from '../Common/Lens';
import { Poster } from './Poster';
import { Headline, Subtitle } from '../Common/Text';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { getWorks } from '../../redux/works/works.selector';
import { addWorks, resetWorks } from '../../redux/works/works.action';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import gsap from 'gsap';
import { useMediaQueryCheck } from '../../hooks/useMediaQueryCheck';
import Head from 'next/head';

const Footer = dynamic(() => import('../Footer').then(mod => mod.Footer), { ssr: false });
const Block = dynamic(() => import('./Block').then(mod => mod.Block), { ssr: false });

export default function WorksDetail ({ title, subtitle, content, image, index, color, footerTexture }) {
    const eventSource = useRef();
    const backRef = useRef();
    const [clicked, setClicked] = useState(false);
    const [showed, setShowed] = useState(false);
    const router = useRouter();
    const state = useSelector(state => state);
    const dispatch = useDispatch();
    const works = getWorks(state)[0];
    const enabled = true;
    const { isMobile } = useMediaQueryCheck(991);

    useEffect(() => {
        const handleRouteChange = url => {
            if (!url.includes('/works')) {
                dispatch(resetWorks());
            }
        };

        const handleBack = () => {
            dispatch(resetWorks());
            dispatch(addWorks(index, color, true));
        };

        window.addEventListener('popstate', handleBack);
        router.events.on('routeChangeStart', handleRouteChange);
        return () => {
            window.removeEventListener('popstate', handleBack);
            router.events.off('routeChangeStart', handleRouteChange);
        };
    }, [router]);

    useEffect(() => {
        if (clicked) {
            dispatch(resetWorks());
            dispatch(addWorks(index, color, true));
            if (!showed) setShowed(true);
            gsap.to(backRef.current, {
                opacity: 0,
                duration: 0.4,
                ease: 'power2.inOut',
            });
        }
    }, []);

    useEffect(() => {
        if (clicked) {
            dispatch(resetWorks());
            dispatch(addWorks(index, color, true));
            if (!showed) setShowed(true);
            gsap.to(backRef.current, {
                opacity: 0,
                duration: 0.4,
                ease: 'power2.inOut',
            });
        }
    }, [clicked]);

    useEffect(() => {
        if (!showed) setShowed(true);
        if (works?.isBack === true && index === works?.currentIndex) {
            setShowed(false);
            setTimeout(() => {
                router.push('/works');
            }, 1000);
        }
    }, [works]);

    return (
        <>
            <Head>
                <style>{`canvas { border: ${isMobile ? '15px' : '20px'} solid ${color} }`}</style>
            </Head>
            <div className={style.el} ref={eventSource}>
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
                            <WebGLBackground color={color} />
                            <Suspense fallback=''>
                                <Environment files='../env/empty_warehouse_01_1k.hdr' />
                                {globalChildren}
                            </Suspense>
                        </Lens>
                    )}
                </GlobalCanvas>
                <SmoothScrollbar enabled={enabled} config={{ syncTouch: true }} />
                <div className={[style.container, 'container'].join(' ')}>
                    <header className={style.header}>
                        <div className={style.arrow}>
                            <div className={style.triangle} />
                            <div className={style.triangle} />
                            <div className={style.triangle} />
                        </div>
                        <div className={style.bg}>
                            <Poster src={image.href} parallaxSpeed={1.1} isPoster />
                        </div>
                        <div className={style.back} ref={backRef} onClick={() => setClicked(true)}>
                            <div>
                                <svg xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' viewBox='0 0 288 288'>
                                    <path id='wavepath' fillOpacity='0%'>
                                        <animate
                                            repeatCount='indefinite'
                                            attributeName='d'
                                            dur='6s'
                                            values='M37.5,186c-12.1-10.5-11.8-32.3-7.2-46.7c4.8-15,13.1-17.8,30.1-36.7C91,68.8,83.5,56.7,103.4,45 c22.2-13.1,51.1-9.5,69.6-1.6c18.1,7.8,15.7,15.3,43.3,33.2c28.8,18.8,37.2,14.3,46.7,27.9c15.6,22.3,6.4,53.3,4.4,60.2 c-3.3,11.2-7.1,23.9-18.5,32c-16.3,11.5-29.5,0.7-48.6,11c-16.2,8.7-12.6,19.7-28.2,33.2c-22.7,19.7-63.8,25.7-79.9,9.7 c-15.2-15.1,0.3-41.7-16.6-54.9C63,186,49.7,196.7,37.5,186z; M51,171.3c-6.1-17.7-15.3-17.2-20.7-32c-8-21.9,0.7-54.6,20.7-67.1c19.5-12.3,32.8,5.5,67.7-3.4C145.2,62,145,49.9,173,43.4 c12-2.8,41.4-9.6,60.2,6.6c19,16.4,16.7,47.5,16,57.7c-1.7,22.8-10.3,25.5-9.4,46.4c1,22.5,11.2,25.8,9.1,42.6 c-2.2,17.6-16.3,37.5-33.5,40.8c-22,4.1-29.4-22.4-54.9-22.6c-31-0.2-40.8,39-68.3,35.7c-17.3-2-32.2-19.8-37.3-34.8 C48.9,198.6,57.8,191,51,171.3z; M37.5,186c-12.1-10.5-11.8-32.3-7.2-46.7c4.8-15,13.1-17.8,30.1-36.7C91,68.8,83.5,56.7,103.4,45 c22.2-13.1,51.1-9.5,69.6-1.6c18.1,7.8,15.7,15.3,43.3,33.2c28.8,18.8,37.2,14.3,46.7,27.9c15.6,22.3,6.4,53.3,4.4,60.2 c-3.3,11.2-7.1,23.9-18.5,32c-16.3,11.5-29.5,0.7-48.6,11c-16.2,8.7-12.6,19.7-28.2,33.2c-22.7,19.7-63.8,25.7-79.9,9.7 c-15.2-15.1,0.3-41.7-16.6-54.9C63,186,49.7,196.7,37.5,186z '
                                        />
                                    </path>

                                    <text textAnchor='middle'>
                                        <textPath href='#wavepath' startOffset='0%'>
                                            <animate
                                                attributeName='startOffset'
                                                from='0%'
                                                to='200%'
                                                begin='0s'
                                                dur='12s'
                                                repeatCount='indefinite'
                                            />
                                            Prev - Prev - Prev - Prev - Prev - Prev - Prev - Prev - Prev - Prev - Prev -
                                            Prev - Prev - Prev - Prev - Prev - Prev - Prev - Prev - Prev - Prev - Prev -
                                            Prev - Prev - Prev - Prev - Prev - Prev - Prev - Prev - Prev - Prev - Prev -
                                            Prev
                                        </textPath>
                                    </text>
                                </svg>
                                <svg
                                    className={style.icon}
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='31'
                                    height='17'
                                    viewBox='0 0 31 17'
                                >
                                    <g
                                        fill='none'
                                        fillRule='evenodd'
                                        stroke='#313131'
                                        transform='matrix(-1 0 0 1 31 0)'
                                    >
                                        <path d='M30,8.07692308 L0,8.07692308' />
                                        <polyline points='21.923 0 30 8.077 21.923 16.154' />
                                    </g>
                                </svg>
                            </div>
                        </div>
                        <div className={style.head}>
                            <h1>
                                <Headline outlineWidth={0.01} wobble>
                                    {title}
                                </Headline>
                            </h1>
                        </div>
                    </header>
                    <div className={style.subtitle}>
                        <h3>
                            <Subtitle color={color} outlineWidth={0.01} wobble>
                                {subtitle}
                            </Subtitle>
                        </h3>
                    </div>
                    <div className={style.content}>
                        {content.map((item, i) => (
                            <Block {...item} color={color} key={i} />
                        ))}
                    </div>
                    <Footer color={color} texturePath={footerTexture}>
                        Let&apos;s Create Together !
                    </Footer>
                </div>
            </div>
        </>
    );
}

WorksDetail.propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
    content: PropTypes.array,
    image: PropTypes.any,
    index: PropTypes.number,
    color: PropTypes.string,
    footerTexture: PropTypes.string,
};
