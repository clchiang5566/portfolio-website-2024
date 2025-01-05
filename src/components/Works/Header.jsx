import React, { useRef, useEffect, useState } from 'react';
import { UseCanvas, useScrollRig, useScrollbar, useTracker, ScrollScene } from '@14islands/r3f-scroll-rig';
import PropTypes from 'prop-types';
import { Carousel } from './Carousel';
import style from '../Works/Works.module.scss'

export function Header ({ pageIndex, isPage, ...props }) {
    const el = useRef();
    const { hasSmoothScrollbar } = useScrollRig();

    return (
        <header 
            ref={el} 
            className={style.bg}
            {...props}
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
        </header>
    );
}

Header.propTypes = {
    isDetail: PropTypes.bool,
};
