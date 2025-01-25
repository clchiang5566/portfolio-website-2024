import React, { useRef } from 'react';
import { UseCanvas, useScrollRig, ScrollScene } from '@14islands/r3f-scroll-rig';
import PropTypes from 'prop-types';
import { Carousel } from './Carousel';
import { useSelector, useDispatch } from 'react-redux';
import { setWheelData, setPointerData, setIsActive } from '../../redux/works/works.action';
import { getIsPrevent, getIsDetailPage } from '../../redux/works/works.selector';
import style from '../WorksDetail/WorksDetail.module.scss';

export function Header () {
    const el = useRef();
    const dispatch = useDispatch();
    const { hasSmoothScrollbar } = useScrollRig();
    const isPrevent = useSelector(getIsPrevent);
    const isDetailPage = useSelector(getIsDetailPage);

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
            {!isPrevent && !isDetailPage && (
                <div
                    className={style.clickButton}
                    onClick={() => {
                        dispatch(setIsActive(true));
                    }}
                />
            )}
        </header>
    );
}

Header.propTypes = {};
