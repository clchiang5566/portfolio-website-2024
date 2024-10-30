import { React, Suspense, useState, useEffect } from 'react';
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

export function Works ({ setThemeColor }) {
    const state = useSelector(state => state);
    const works = getWorks(state)[0];
    const [bgColor, setBgColor] = useState(works?.color && works.isBack ? `${works.color}` : '#cce1f3');
    const [currentTexture, setCurrentTexture] = useState('/models/down/Material_body.png');
    const [posterActive, setPosterActive] = useState(false);
    const { isMobile } = useMediaQueryCheck(991);

    useEffect(() => {
        setThemeColor(bgColor);
    }, [works, bgColor]);

    return (
        <>
            <Head>
                <style>{`html { overflow: hidden; } canvas { border: ${
                    isMobile ? '15px' : '20px'
                } solid ${bgColor} }`}</style>
            </Head>
            <div className={style.el} style={{ background: `${bgColor}` }}>
                <Canvas scalemultiplier={0.01} eventPrefix='client' flat camera={{ fov: 14 }}>
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
    setThemeColor: PropTypes.func,
};
