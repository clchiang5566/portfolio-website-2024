import { React, Suspense, useState, useEffect, useRef } from 'react';
import { GlobalCanvas, SmoothScrollbar } from '@14islands/r3f-scroll-rig';
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
    const eventSource = useRef();
    const state = useSelector(state => state);
    const works = getWorks(state)[0];
    const [bgColor, setBgColor] = useState(works?.color && works.isBack ? `${works.color}` : '#cce1f3');
    const [currentTexture, setCurrentTexture] = useState('/models/down/Material_body.png');
    const [posterActive, setPosterActive] = useState(false);
    const [wheelData, setWheelData] = useState(null);
    const [pointerData, setPointerData] = useState(null);
    const [clickData, setClickData] = useState(false);
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
            <div 
                ref={eventSource}
                className={style.el}
                style={{ background: `${bgColor}` }}
                onWheel={(e) => setWheelData(e)}
                onPointerMove={(e) => setPointerData(e)}
                onPointerDown={(e) => setPointerData(e)}
                onPointerUp={(e) => setPointerData(e)}
                onPointerLeave={(e) => setPointerData(e)}
                onPointerCancel={(e) => setPointerData(e)}
                onClick={() => {
                    if (!clickData) setClickData(true)
                }}
            >
                <GlobalCanvas
                    debug={false}
                    scaleMultiplier={0.01}
                    eventPrefix='client'
                    flat
                    camera={{ fov: 14 }}
                >
                    {globalChildren => (
                        <Lens>
                            <WebGLBackground color={bgColor} />
                            <Suspense>
                                <Environment files='../env/empty_warehouse_01_1k.hdr' />
                                <Carousel
                                    setBgColor={setBgColor}
                                    setCurrentTexture={setCurrentTexture}
                                    setPosterActive={setPosterActive}
                                    wheelData={wheelData}
                                    pointerData={pointerData}
                                    clickData={clickData}
                                    setClickData={setClickData}
                                />
                                {!posterActive && <Model url='/models/down/scene.gltf' texturePath={currentTexture} />}
                            </Suspense>
                        </Lens>
                    )}
                </GlobalCanvas>
            </div>
        </>
    );
}

Works.propTypes = {
    setThemeColor: PropTypes.func,
};
