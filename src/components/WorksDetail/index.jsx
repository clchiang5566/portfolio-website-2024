import React, { Suspense, useRef, useState, useEffect } from 'react';
import { GlobalCanvas, SmoothScrollbar, ScrollScene } from '@14islands/r3f-scroll-rig';
import { Environment } from '@react-three/drei';
import style from './WorksDetail.module.scss';
import { WebGLBackground } from '../Common/WebGLBackground';
import { Lens } from '../Common/Lens';
import { Headline, Subtitle } from '../Common/Text';
import { useSelector, useDispatch } from 'react-redux';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import { useMediaQueryCheck } from '../../hooks/useMediaQueryCheck';
import Head from 'next/head';
import { Header } from '../Works/Header';
import { Content } from './Content';

export default function WorksDetail ({ ...props }) {
    const { index, color } = props;
    const eventSource = useRef();
    const dispatch = useDispatch();
    const enabled = true;
    const { isMobile } = useMediaQueryCheck(991);

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
                <Header 
                    pageIndex={index}
                    isPage
                />
                <Content contents={props} isPage />
            </div>
        </>
    );
}

WorksDetail.propTypes = {
    index: PropTypes.number,
    color: PropTypes.string,
};
