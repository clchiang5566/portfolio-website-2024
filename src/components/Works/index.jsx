import { React, Suspense, useState, useEffect, useRef } from 'react';
import { GlobalCanvas, SmoothScrollbar } from '@14islands/r3f-scroll-rig';
import { Environment } from '@react-three/drei';
import { useSelector, useDispatch } from 'react-redux';
import { setIsActive, setIsLoading, setIsSuccess, setIsDetailPage, setPageContent } from '../../redux/works/works.action';
import { getCurrentColor, getDataUrl, getIsLoading, getIsSuccess, getIsCarousel, getPageContent } from '../../redux/works/works.selector';
import { WebGLBackground } from '../Common/WebGLBackground';
import { Lens } from '../Common/Lens';
import Head from 'next/head';
import style from '../WorksDetail/WorksDetail.module.scss';
import { useMediaQueryCheck } from '../../hooks/useMediaQueryCheck';
import { Header } from './Header';
import { Content } from '../WorksDetail/Content';

export function Works () {
    const eventSource = useRef();
    const dispatch = useDispatch();
    const currentColor = useSelector(getCurrentColor);
    const [ isDetailPage, setIsDetailPage ] = useState(false);
    const { isMobile } = useMediaQueryCheck(991);
    const isSuccess = useSelector(getIsSuccess);
    const isLoading = useSelector(getIsLoading);
    const isCarousel = useSelector(getIsCarousel);
    const dataUrl = useSelector(getDataUrl);
    const pageContent = useSelector(getPageContent);
    // const [contents, setContents] = useState(null);

    useEffect(() => {
        if (!isSuccess && isLoading && dataUrl) {
            const modules = {
                tata: () => import('../../pages/api/data/tata'),
                delonghi: () => import('../../pages/api/data/delonghi'),
                kitkat: () => import('../../pages/api/data/kitkat'),
                maxis: () => import('../../pages/api/data/maxis'),
                tomorrow: () => import('../../pages/api/data/tomorrow'),
                nio: () => import('../../pages/api/data/nio'),
                hbl: () => import('../../pages/api/data/hbl'),
                timberland: () => import('../../pages/api/data/timberland'),
            };
            const loadData = async () => {
                try {
                    console.log('isDetail')
                    const module = await modules[dataUrl]();
                    dispatch(setPageContent(module.default))
                    setIsDetailPage(true)
                    dispatch(setIsSuccess(false))
                    dispatch(setIsLoading(false))
                    dispatch(setIsActive(false))
                } catch (error) {
                    console.error('Failed to load module:', error);
                }
            }
            loadData()
        }
    }, [isLoading])

    useEffect(() => {
        if (isCarousel) {
            dispatch(setIsLoading(false))
            setIsDetailPage(false)
            window.history.pushState(null, '', '/works')
        }
    }, [isCarousel])

    return (
        <>
            <Head>
                <style>{`html { overflow: hidden; } canvas { border: ${
                    isMobile ? '15px' : '20px'
                } solid ${currentColor} }`}</style>
            </Head>
            <div 
                ref={eventSource}
                className={style.el}
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
                            <WebGLBackground color={currentColor} />
                            <Suspense>
                                <Environment files='../env/empty_warehouse_01_1k.hdr' />
                                {globalChildren}
                            </Suspense>
                        </Lens>
                    )}
                </GlobalCanvas>
                <SmoothScrollbar config={{ syncTouch: true }}>
                    {bind => (
                        <section {...bind}>
                            <Header isDetailPage={isDetailPage} />
                            {isDetailPage && <Content contents={pageContent} />}                 
                        </section>
                    )}
                </SmoothScrollbar>
            </div>
        </>
    );
}

Works.propTypes = {};
