import React, { Suspense, useRef } from 'react';
import { GlobalCanvas, SmoothScrollbar } from '@14islands/r3f-scroll-rig';
import { Environment } from '@react-three/drei';
import style from './About.module.scss';
import { Lens } from '../Common/Lens';
import { Subtitle } from '../Common/Text';
import PropTypes from 'prop-types';
import { Marquee } from './Marquee';
import { Header } from './Header';
import { Footer } from '../Footer';
import { Background } from './Background';

export default function About ({ headline, content, image, index, color }) {
    const eventSource = useRef();
    const marqueeEl = useRef();
    const headerEl = useRef();
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
                                            Hello, I&apos;m Lung, a meme lover, former Blockbuster clerk, and a weird
                                            engineer-animator hybrid.
                                        </p>
                                        <p>
                                            I&apos;m a digital fanatic and a dreamer who explores world heritage sites
                                            and cooking culture worldwide, with infinite curiosity about the unknown. As
                                            a web-based creative developer, I always try to strike a balance between
                                            technical practices and creative approaches, to enjoy working together with
                                            various talents in the creative industry.
                                        </p>
                                        <p>
                                            I have 10 years of working experience in digital products with the APAC area
                                            teams, and have served many local and international brands, hundreds of
                                            websites. I have some particular interests in CG programming (GLSL/HLSL
                                            shader), the aesthetics of mathematics and new type of interaction
                                            possibility. I&apos;m learning more tools to achieve better results
                                            currently.
                                        </p>
                                    </div>
                                </section>
                                <section className={style.text}>
                                    <h3>
                                        <Subtitle outlineWidth wobble>
                                            ABOUT THIS WEBSITE
                                        </Subtitle>
                                    </h3>
                                    <div className={style.frame}>
                                        <p>
                                            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                            Lorem Ipsum has been the industrys standard dummy text ever since the 1500s,
                                            when an unknown printer took a galley of type and scrambled it to make a
                                            type specimen book. It has survived not only five centuries, but also the
                                            leap into electronic typesetting, remaining essentially unchanged. It was
                                            popularised in the 1960s with the release of Letraset sheets containing
                                            Lorem Ipsum passages, and more recently with desktop publishing software
                                            like Aldus PageMaker including versions of Lorem Ipsum.
                                        </p>
                                        <p>
                                            This website is a commemorative edition of my work on the tenth year and a
                                            collection of works. It selects some pieces of different stages in the past
                                            six years, as well as other new personal works, the full personal content of
                                            which is expected to be produced by the end of April, and what I have at the
                                            moment is the concept and description.
                                        </p>
                                    </div>
                                </section>
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
