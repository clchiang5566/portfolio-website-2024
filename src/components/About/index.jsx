import React, { Suspense, useRef } from 'react';
import { GlobalCanvas, SmoothScrollbar } from '@14islands/r3f-scroll-rig';
import { Environment } from '@react-three/drei';
import style from './About.module.scss';
import { Lens } from '../Common/Lens';
import { Subtitle } from '../Common/Text';
import PropTypes from 'prop-types';
// import { Marquee } from './Marquee';
// import { Header } from './Header';
import { Background } from './Background';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const Header = dynamic(() => import('./Header').then(mod => mod.Header), { ssr: false });
const Marquee = dynamic(() => import('./Marquee').then(mod => mod.Marquee), { ssr: false });
const Television = dynamic(() => import('./Television').then(mod => mod.Television), { ssr: false });
const Footer = dynamic(() => import('../Footer').then(mod => mod.Footer), { ssr: false });

export default function About ({ headline, content, image, index, color }) {
    const eventSource = useRef();
    const marqueeEl = useRef();
    const headerEl = useRef();
    const tvEl = useRef();
    const enabled = true;

    return (
        <div className={style.el} ref={eventSource} style={{ background: '#ffff4f' }}>
            <GlobalCanvas
                debug={false}
                scaleMultiplier={0.01}
                eventSource={eventSource}
                eventPrefix='client'
                flat
                camera={{ fov: 14 }}
                style={{ pointerEvents: 'none' }}
            >
                {globalChildren => (
                    <Lens>
                        <Background />
                        <Suspense>
                            <Environment files='/env/empty_warehouse_01_1k.hdr' />
                            {globalChildren}
                        </Suspense>
                    </Lens>
                )}
            </GlobalCanvas>
            <SmoothScrollbar enabled={enabled} config={{ syncTouch: true }}>
                {bind => (
                    <section {...bind} ref={headerEl}>
                        <div className={style.headerContainer}>
                            <Header marqueeEl={marqueeEl} headerEl={headerEl} />
                            <div className={style.arrow}>
                                <div className={style.triangle} />
                                <div className={style.triangle} />
                                <div className={style.triangle} />
                            </div>
                        </div>
                        <div className={style.marqueeContainer} ref={marqueeEl}>
                            <Marquee />
                        </div>
                        <div className={[style.container, 'container'].join(' ')}>
                            <div className={style.content}>
                                <section className={style.text}>
                                    <h3>
                                        <Subtitle outlineWidth wobble>
                                            ABOUT ME
                                        </Subtitle>
                                    </h3>
                                    <div className={style.frame}>
                                        <p>
                                            Hi, please call me Lung, a meme lover, former Blockbuster clerk, a digital
                                            fanatic and a dreamer who explores world heritage sites and cooking culture
                                            worldwide, with infinite curiosity about the unknown. As a web-based
                                            creative developer, I always try to strike a balance between technical
                                            practices and creative approaches, to enjoy working together with various
                                            talents in the creative industry.
                                        </p>
                                        <p>
                                            I have 10 years of working experience in digital products with the APAC area
                                            teams, and have served many local and international brands, hundreds of
                                            websites. I have some particular interests in graphics programming (GLSL
                                            shader, AR/VR/MR, game development, etc.), the aesthetics of mathematics and new type
                                            of interaction.
                                        </p>
                                        <p>I am currently learning more tools to realize the ideas in my mind.</p>
                                    </div>
                                </section>
                                <section className={style.text}>
                                    <h3>
                                        <Subtitle outlineWidth wobble>
                                            ABOUT THIS WEBSITE
                                        </Subtitle>
                                    </h3>
                                    <div className={style.frame}>
                                        <div className={style.images}>
                                            <Image
                                                alt='Mountains'
                                                src='/images/about/drawing.jpg'
                                                width='500'
                                                height='500'
                                            />
                                            <Image
                                                alt='Mountains'
                                                src='/images/about/dragon.jpg'
                                                width='500'
                                                height='500'
                                            />
                                        </div>
                                        <p>
                                            A poem that I've recently come to love emphasizes the importance of inner
                                            self-worth rather than conforming to external standards. It conveys a spirit
                                            of staying true to oneself and pursuing authenticity. So I also incorporated
                                            these characteristics into the visual design and effects. This reflects the
                                            inner world I want to express.
                                        </p>
                                        <p>
                                            This website is a commemorative edition of my work on the tenth year (2013 -
                                            2023) and a collection of works. It selects some pieces of different stages
                                            in the past six years. These works represent the results of my different
                                            types of work experience and global cross-border teamwork.
                                        </p>
                                        <p>You also can see some of the other works through the TV below.</p>
                                    </div>
                                </section>
                                <div className={style.televisionContainer} ref={tvEl}>
                                    <div className={style.deco}>
                                        <svg
                                            fill='none'
                                            xmlns='http://www.w3.org/2000/svg'
                                            viewBox='0 0 482 41'
                                            role='presentation'
                                        >
                                            <path
                                                vectorEffect='non-scaling-stroke'
                                                d='M478.755 2.994a7.234 7.234 0 0 0-10.222.255l-18.041 18.975-18.041-18.975A7.234 7.234 0 0 0 427.213 1a7.214 7.214 0 0 0-5.238 2.25l-18.041 18.974-18.041-18.975A7.243 7.243 0 0 0 380.655 1a7.217 7.217 0 0 0-5.239 2.25l-18.041 18.974-18.041-18.975A7.241 7.241 0 0 0 334.096 1a7.214 7.214 0 0 0-5.238 2.25l-18.041 18.974-18.041-18.975A7.243 7.243 0 0 0 287.538 1a7.217 7.217 0 0 0-5.239 2.25l-18.04 18.974-18.031-18.97a7.243 7.243 0 0 0-5.238-2.249c-1.98 0-3.877.811-5.239 2.25l-18.036 18.974-18.04-18.975a7.237 7.237 0 0 0-5.239-2.249 7.214 7.214 0 0 0-5.238 2.25l-18.036 18.974-18.041-18.975a7.234 7.234 0 0 0-5.238-2.249 7.213 7.213 0 0 0-5.238 2.25l-18.036 18.974-18.041-18.975a7.243 7.243 0 0 0-5.238-2.249c-1.98 0-3.877.811-5.239 2.25L78.055 22.223 60.02 3.254a7.243 7.243 0 0 0-5.239-2.249 7.215 7.215 0 0 0-5.238 2.25L31.507 22.223l-18.04-18.97a7.223 7.223 0 0 0-10.217-.26c-2.897 2.75-3.01 7.33-.26 10.222l23.279 24.483a7.243 7.243 0 0 0 5.238 2.25 7.215 7.215 0 0 0 5.238-2.25l18.036-18.97L72.817 37.7a7.243 7.243 0 0 0 5.238 2.25c1.98 0 3.877-.812 5.239-2.25l18.036-18.974 18.04 18.974a7.245 7.245 0 0 0 5.239 2.25 7.214 7.214 0 0 0 5.238-2.25l18.036-18.974 18.036 18.974a7.243 7.243 0 0 0 5.238 2.25 7.214 7.214 0 0 0 5.238-2.25l18.036-18.974 18.036 18.974a7.234 7.234 0 0 0 5.238 2.25 7.217 7.217 0 0 0 5.239-2.25l18.035-18.974 18.041 18.974a7.243 7.243 0 0 0 5.239 2.25 7.214 7.214 0 0 0 5.238-2.25l18.041-18.974 18.041 18.974a7.243 7.243 0 0 0 5.238 2.25 7.214 7.214 0 0 0 5.238-2.25l18.041-18.974 18.041 18.974a7.243 7.243 0 0 0 5.238 2.25 7.217 7.217 0 0 0 5.239-2.25l18.041-18.974 18.04 18.974a7.245 7.245 0 0 0 5.239 2.25 7.214 7.214 0 0 0 5.238-2.25l18.041-18.974 18.041 18.974a7.234 7.234 0 0 0 5.238 2.25 7.217 7.217 0 0 0 5.239-2.25l23.279-24.483a7.234 7.234 0 0 0-.255-10.222Z'
                                                fill='hsl(60, 100%, 97%)'
                                                stroke='#313131'
                                                strokeMiterlimit='10'
                                            />
                                        </svg>
                                    </div>
                                    <Television />
                                    <div className={style.deco}>
                                        <svg
                                            fill='none'
                                            xmlns='http://www.w3.org/2000/svg'
                                            viewBox='0 0 482 41'
                                            role='presentation'
                                        >
                                            <path
                                                vectorEffect='non-scaling-stroke'
                                                d='M478.755 2.994a7.234 7.234 0 0 0-10.222.255l-18.041 18.975-18.041-18.975A7.234 7.234 0 0 0 427.213 1a7.214 7.214 0 0 0-5.238 2.25l-18.041 18.974-18.041-18.975A7.243 7.243 0 0 0 380.655 1a7.217 7.217 0 0 0-5.239 2.25l-18.041 18.974-18.041-18.975A7.241 7.241 0 0 0 334.096 1a7.214 7.214 0 0 0-5.238 2.25l-18.041 18.974-18.041-18.975A7.243 7.243 0 0 0 287.538 1a7.217 7.217 0 0 0-5.239 2.25l-18.04 18.974-18.031-18.97a7.243 7.243 0 0 0-5.238-2.249c-1.98 0-3.877.811-5.239 2.25l-18.036 18.974-18.04-18.975a7.237 7.237 0 0 0-5.239-2.249 7.214 7.214 0 0 0-5.238 2.25l-18.036 18.974-18.041-18.975a7.234 7.234 0 0 0-5.238-2.249 7.213 7.213 0 0 0-5.238 2.25l-18.036 18.974-18.041-18.975a7.243 7.243 0 0 0-5.238-2.249c-1.98 0-3.877.811-5.239 2.25L78.055 22.223 60.02 3.254a7.243 7.243 0 0 0-5.239-2.249 7.215 7.215 0 0 0-5.238 2.25L31.507 22.223l-18.04-18.97a7.223 7.223 0 0 0-10.217-.26c-2.897 2.75-3.01 7.33-.26 10.222l23.279 24.483a7.243 7.243 0 0 0 5.238 2.25 7.215 7.215 0 0 0 5.238-2.25l18.036-18.97L72.817 37.7a7.243 7.243 0 0 0 5.238 2.25c1.98 0 3.877-.812 5.239-2.25l18.036-18.974 18.04 18.974a7.245 7.245 0 0 0 5.239 2.25 7.214 7.214 0 0 0 5.238-2.25l18.036-18.974 18.036 18.974a7.243 7.243 0 0 0 5.238 2.25 7.214 7.214 0 0 0 5.238-2.25l18.036-18.974 18.036 18.974a7.234 7.234 0 0 0 5.238 2.25 7.217 7.217 0 0 0 5.239-2.25l18.035-18.974 18.041 18.974a7.243 7.243 0 0 0 5.239 2.25 7.214 7.214 0 0 0 5.238-2.25l18.041-18.974 18.041 18.974a7.243 7.243 0 0 0 5.238 2.25 7.214 7.214 0 0 0 5.238-2.25l18.041-18.974 18.041 18.974a7.243 7.243 0 0 0 5.238 2.25 7.217 7.217 0 0 0 5.239-2.25l18.041-18.974 18.04 18.974a7.245 7.245 0 0 0 5.239 2.25 7.214 7.214 0 0 0 5.238-2.25l18.041-18.974 18.041 18.974a7.234 7.234 0 0 0 5.238 2.25 7.217 7.217 0 0 0 5.239-2.25l23.279-24.483a7.234 7.234 0 0 0-.255-10.222Z'
                                                fill='hsl(60, 100%, 97%)'
                                                stroke='#313131'
                                                strokeMiterlimit='10'
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Footer texturePath='/texture/nomarl/Material_body.png'>Let&apos;s Create Together !</Footer>
                    </section>
                )}
            </SmoothScrollbar>
        </div>
    );
}

About.propTypes = {
    headline: PropTypes.string,
    content: PropTypes.array,
    image: PropTypes.array,
    index: PropTypes.number,
    color: PropTypes.string,
};
