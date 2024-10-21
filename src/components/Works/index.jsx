import { React, Suspense, useState } from 'react';
import { Environment } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Carousel } from './Carousel';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getWorks } from '../../redux/works/works.selector';
import { WebGLBackground } from '../Common/WebGLBackground';
import { Lens } from '../Common/Lens';
import Head from 'next/head';
import style from './Works.module.scss';
import { Model } from './Model';
import { useMediaQueryCheck } from '../../hooks/useMediaQueryCheck';

export function Works () {
    const state = useSelector(state => state);
    const works = getWorks(state)[0];
    const [bgColor, setBgColor] = useState(works?.color && works.isBack ? `${works.color}` : '#aaf683');
    const [currentTexture, setCurrentTexture] = useState('/models/down/Material_body.png');
    const [posterActive, setPosterActive] = useState(false);
    const { isMobile } = useMediaQueryCheck(991);

    return (
        <>
            <Head>
                <style>{'html { overflow: hidden; }'}</style>
            </Head>
            <div className={style.el} style={{ background: `${bgColor}` }}>
                <Canvas
                    scalemultiplier={0.01}
                    eventPrefix='client'
                    flat
                    camera={{ fov: 14 }}
                    style={{ border: `${isMobile ? '15px' : '20px'} solid ${bgColor}` }}
                >
                    <Lens scale='0.16'>
                        <WebGLBackground color={bgColor} />
                        <Suspense>
                            <Environment files='../env/empty_warehouse_01_1k.hdr' />
                            <Carousel
                                setBgColor={setBgColor}
                                setCurrentTexture={setCurrentTexture}
                                setPosterActive={setPosterActive}
                            />
                            {!posterActive && <Model url='/models/down/scene.gltf' texturePath={currentTexture} />}
                        </Suspense>
                    </Lens>
                </Canvas>
            </div>
        </>
    );
}

Works.propTypes = {
    type: PropTypes.string,
    items: PropTypes.array,
    m: PropTypes.string,
    urls: PropTypes.array,
    color: PropTypes.string,
    headline: PropTypes.string,
};
