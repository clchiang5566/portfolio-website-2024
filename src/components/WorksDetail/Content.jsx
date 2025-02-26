import React, { useState, useEffect, useRef } from 'react';
import style from './WorksDetail.module.scss';
import { Headline, Subtitle } from '../Common/Text';
import { useDispatch } from 'react-redux';
import { setIsCarousel, setIsTextReady } from '../../redux/works/works.action';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import Arrow from '../Common/Arrow';

const Footer = dynamic(() => import('../Footer').then(mod => mod.Footer), { ssr: false });
const Block = dynamic(() => import('./Block').then(mod => mod.Block), { ssr: false });

export function Content ({ contents }) {
    const { title, subtitle, content, color, footerTexture } = contents;
    const [show, setShow] = useState(false);
    const svgRef = useRef(null);
    const dispatch = useDispatch();

    const handBackClick = () => {
        setShow(false);
        dispatch(setIsCarousel(true));
        dispatch(setIsTextReady(true));
    };

    useEffect(() => {
        setTimeout(() => {
            setShow(true);
            const animateElement = svgRef.current?.querySelector('animate');
            if (animateElement) {
                animateElement.beginElement();
            }
        }, 500);

        const handlePopState = event => {
            handBackClick();
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    return (
        <div className={[style.container, 'container'].join(' ')}>
            <header className={[style.header, show ? style.show : null].join(' ')}>
                <Arrow />
                <div className={style.back} onClick={() => handBackClick()}>
                    <div>
                        <svg ref={svgRef} xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' viewBox='0 0 288 288'>
                            <path id='wavepath' fillOpacity='0%'>
                                <animate
                                    repeatCount='indefinite'
                                    attributeName='d'
                                    dur='6s'
                                    values='M37.5,186c-12.1-10.5-11.8-32.3-7.2-46.7c4.8-15,13.1-17.8,30.1-36.7C91,68.8,83.5,56.7,103.4,45 c22.2-13.1,51.1-9.5,69.6-1.6c18.1,7.8,15.7,15.3,43.3,33.2c28.8,18.8,37.2,14.3,46.7,27.9c15.6,22.3,6.4,53.3,4.4,60.2 c-3.3,11.2-7.1,23.9-18.5,32c-16.3,11.5-29.5,0.7-48.6,11c-16.2,8.7-12.6,19.7-28.2,33.2c-22.7,19.7-63.8,25.7-79.9,9.7 c-15.2-15.1,0.3-41.7-16.6-54.9C63,186,49.7,196.7,37.5,186z; M51,171.3c-6.1-17.7-15.3-17.2-20.7-32c-8-21.9,0.7-54.6,20.7-67.1c19.5-12.3,32.8,5.5,67.7-3.4C145.2,62,145,49.9,173,43.4 c12-2.8,41.4-9.6,60.2,6.6c19,16.4,16.7,47.5,16,57.7c-1.7,22.8-10.3,25.5-9.4,46.4c1,22.5,11.2,25.8,9.1,42.6 c-2.2,17.6-16.3,37.5-33.5,40.8c-22,4.1-29.4-22.4-54.9-22.6c-31-0.2-40.8,39-68.3,35.7c-17.3-2-32.2-19.8-37.3-34.8 C48.9,198.6,57.8,191,51,171.3z; M37.5,186c-12.1-10.5-11.8-32.3-7.2-46.7c4.8-15,13.1-17.8,30.1-36.7C91,68.8,83.5,56.7,103.4,45 c22.2-13.1,51.1-9.5,69.6-1.6c18.1,7.8,15.7,15.3,43.3,33.2c28.8,18.8,37.2,14.3,46.7,27.9c15.6,22.3,6.4,53.3,4.4,60.2 c-3.3,11.2-7.1,23.9-18.5,32c-16.3,11.5-29.5,0.7-48.6,11c-16.2,8.7-12.6,19.7-28.2,33.2c-22.7,19.7-63.8,25.7-79.9,9.7 c-15.2-15.1,0.3-41.7-16.6-54.9C63,186,49.7,196.7,37.5,186z '
                                />
                            </path>
                            <text textAnchor='middle'>
                                <textPath href='#wavepath' startOffset='0%'>
                                    <animate
                                        attributeName='startOffset'
                                        from='0%'
                                        to='200%'
                                        begin='0s'
                                        dur='12s'
                                        repeatCount='indefinite'
                                    />
                                    Prev - Prev - Prev - Prev - Prev - Prev - Prev - Prev - Prev - Prev - Prev - Prev -
                                    Prev - Prev - Prev - Prev - Prev - Prev - Prev - Prev - Prev - Prev - Prev - Prev -
                                    Prev - Prev - Prev - Prev -
                                </textPath>
                            </text>
                        </svg>
                        <div className={style.icon} />
                    </div>
                </div>
                <div className={style.head}>
                    <h1>
                        <Headline outlineWidth={0.01} wobble>
                            {title}
                        </Headline>
                    </h1>
                </div>
            </header>
            <div className={style.subtitle}>
                <h3>
                    <Subtitle color={color} outlineWidth={0.01} wobble>
                        {subtitle}
                    </Subtitle>
                </h3>
            </div>
            <div className={style.content}>
                {content.map((item, i) => (
                    <Block {...item} color={color} key={i} />
                ))}
            </div>
            <Footer color={color} texturePath={footerTexture}>
                Let&apos;s Create Together !
            </Footer>
        </div>
    );
}

Content.propTypes = {
    contents: PropTypes.any,
};
