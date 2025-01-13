import React, { useRef, useEffect, useState } from 'react';
import { UseCanvas, useScrollRig, useScrollbar, useTracker, ScrollScene } from '@14islands/r3f-scroll-rig';
import PropTypes from 'prop-types';
import { Carousel } from './Carousel';
import { useSelector, useDispatch } from 'react-redux';
import { setWheelData, setPointerData, setIsActive, setIsLoading, setIsSuccess, setIsDetailPage } from '../../redux/works/works.action';
import { getCurrentColor, getDataUrl, getIsLoading, getIsSuccess, getIsCarousel, getIsActive, getIsPrevent } from '../../redux/works/works.selector';
import style from '../WorksDetail/WorksDetail.module.scss'

export function Header ({ pageIndex, isPage, isDetailPage, ...props }) {
    const el = useRef();
    const dispatch = useDispatch();
    const { hasSmoothScrollbar } = useScrollRig();
    const isPrevent = useSelector(getIsPrevent);

    return (
        <header 
            ref={el} 
            className={style.bg}
            {...props}
            onWheel={(e) => !isDetailPage ? dispatch(setWheelData(e)) : null}
            onPointerMove={(e) => !isDetailPage ? dispatch(setPointerData(e)) : null}
            onPointerDown={(e) => !isDetailPage ? dispatch(setPointerData(e)) : null}
            onPointerUp={(e) => !isDetailPage ? dispatch(setPointerData(e)) : null}
            onPointerLeave={(e) => !isDetailPage ? dispatch(setPointerData(e)) : null}
            onPointerCancel={(e) => !isDetailPage ? dispatch(setPointerData(e)) : null}
        >
            {hasSmoothScrollbar && (
                <UseCanvas debug={false}>
                    <ScrollScene track={el}>
                        {props => (
                            <Carousel 
                                pageIndex={pageIndex}
                                isPage={isPage}
                            />
                        )}
                    </ScrollScene>
                </UseCanvas>
            )}
            {!isPrevent && !isDetailPage && <div className={style.clickButton} onClick={() => { dispatch(setIsActive(true)) }} />}
        </header>
    );
}

Header.propTypes = {
    isPage: PropTypes.bool,
    isDetailPage: PropTypes.bool,
    pageIndex: PropTypes.number
};
