import React, { useRef } from 'react';
import { UseCanvas, useScrollRig } from '@14islands/r3f-scroll-rig';
import PropTypes from 'prop-types';
import { Circle } from './Circle';
import style from './Home.module.scss';

export function Header ({ headerEl, ...props }) {
    const el = useRef();
    const { hasSmoothScrollbar } = useScrollRig();

    return (
        <header ref={el} {...props}>
            <div className={style.item} />
            <div className={style.item} />
            <div className={style.item} />
            <div className={style.item} />
            <div className={style.item} />
            <div className={style.item} />
            {hasSmoothScrollbar && (
                <UseCanvas debug={false}>
                    <Circle {...props} headerEl={headerEl} />
                </UseCanvas>
            )}
        </header>
    );
}

Header.propTypes = {
    isFloating: PropTypes.bool,
    setIsActive: PropTypes.func,
    headerEl: PropTypes.any,
};
