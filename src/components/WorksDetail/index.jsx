import React, { Suspense, useRef, useState, useEffect } from 'react';
import { GlobalCanvas, SmoothScrollbar } from '@14islands/r3f-scroll-rig';
import { Environment } from '@react-three/drei';
import style from './WorksDetail.module.scss';
import { WebGLBackground } from '../Common/WebGLBackground';
import { Lens } from '../Common/Lens';
import { useSelector } from 'react-redux';
import { getCurrentColor, getPageContent, getIsDetailPage } from '../../redux/works/works.selector';
import { useMediaQueryCheck } from '../../hooks/useMediaQueryCheck';
import Head from 'next/head';
import { Header } from '../Works/Header';
import { Content } from './Content';

export default function WorksDetail () {
    const eventSource = useRef();
    const currentColor = useSelector(getCurrentColor);
    const isDetailPage = useSelector(getIsDetailPage);
    const pageContent = useSelector(getPageContent);
    const { isMobile } = useMediaQueryCheck(991);
    const [key, setKey] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            setKey(prevKey => prevKey + 1);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            <Head>
                <style>{`canvas { border: ${isMobile ? '15px' : '20px'} solid ${currentColor} }`}</style>
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
                            <WebGLBackground color={currentColor} />
                            <Suspense fallback=''>
                                <Environment files='../env/empty_warehouse_01_1k.hdr' />
                                {globalChildren}
                            </Suspense>
                        </Lens>
                    )}
                </GlobalCanvas>
                <SmoothScrollbar config={{ syncTouch: true }}>
                    {bind => (
                        <section {...bind}>
                            <Header key={key} />
                            {isDetailPage && pageContent && <Content contents={pageContent} />}
                        </section>
                    )}
                </SmoothScrollbar>
            </div>
        </>
    );
}

WorksDetail.propTypes = {};
