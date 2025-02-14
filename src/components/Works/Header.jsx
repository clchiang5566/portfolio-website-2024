import React, { useRef } from 'react';
import { UseCanvas, useScrollRig, ScrollScene } from '@14islands/r3f-scroll-rig';
import { Carousel } from './Carousel';
import { useSelector, useDispatch } from 'react-redux';
import { setWheelData, setPointerData, setIsActive, setIsHover, setIsVertical } from '../../redux/works/works.action';
import {
    getIsPrevent,
    getIsDetailPage,
    getIsHover,
    getCurrentColor,
    getIsVertical,
    getIsTextReady,
    getIsPoster,
} from '../../redux/works/works.selector';
import { lightenHex } from '../../utils/common';
import style from '../WorksDetail/WorksDetail.module.scss';

export function Header () {
    const el = useRef();
    const dispatch = useDispatch();
    const { hasSmoothScrollbar } = useScrollRig();
    const isPrevent = useSelector(getIsPrevent);
    const isHover = useSelector(getIsHover);
    const isVertical = useSelector(getIsVertical);
    const isDetailPage = useSelector(getIsDetailPage);
    const isTextReady = useSelector(getIsTextReady);
    const isPoster = useSelector(getIsPoster);
    const currentColor = useSelector(getCurrentColor);

    return (
        <header
            ref={el}
            className={style.bg}
            onWheel={e => (!isDetailPage ? dispatch(setWheelData(e)) : null)}
            onPointerMove={e => (!isDetailPage ? dispatch(setPointerData(e)) : null)}
            onPointerDown={e => (!isDetailPage ? dispatch(setPointerData(e)) : null)}
            onPointerUp={e => (!isDetailPage ? dispatch(setPointerData(e)) : null)}
            onPointerLeave={e => (!isDetailPage ? dispatch(setPointerData(e)) : null)}
            onPointerCancel={e => (!isDetailPage ? dispatch(setPointerData(e)) : null)}
        >
            {hasSmoothScrollbar && (
                <UseCanvas debug={false}>
                    <ScrollScene track={el}>{props => <Carousel />}</ScrollScene>
                </UseCanvas>
            )}
            {!isPrevent && isTextReady && !isPoster && (
                <div
                    className={style.clickButton}
                    onPointerEnter={() => (!isHover ? dispatch(setIsHover(true)) : null)}
                    onPointerLeave={() => (isHover ? dispatch(setIsHover(false)) : null)}
                    onClick={() => {
                        dispatch(setIsActive(true));
                    }}
                />
            )}
            <div
                className={[style.switchButton, isVertical ? style.isVertical : null, isTextReady && !isPoster ? style.isShow : null].join(' ')}
                style={{ backgroundColor: `${currentColor}` }}
            >
                <div className={style.active} style={{ backgroundColor: `${lightenHex(currentColor, -15)}` }} />
                <div className={style.button} onClick={() => (!isVertical && !isPoster ? dispatch(setIsVertical(true)) : null)}>
                    ┆
                </div>
                <div className={style.button} onClick={() => (isVertical && !isPoster ? dispatch(setIsVertical(false)) : null)}>
                    ┄
                </div>
            </div>
        </header>
    );
}

Header.propTypes = {};
