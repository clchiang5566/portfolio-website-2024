import React, { useRef } from 'react';
import { ScrollScene, UseCanvas, useScrollRig } from '@14islands/r3f-scroll-rig';
import { MeshDistortMaterial } from '@react-three/drei';
import { WebGLText } from '@14islands/r3f-scroll-rig/powerups';
import PropTypes from 'prop-types';
import style from './Footer.module.scss';
import { Star } from './Star';
import { Model } from './Model';

export function Footer ({
    children,
    wobble,
    font = '/fonts/Montserrat-Bold.woff',
    as: Tag = 'span',
    color,
    texturePath,
    ...props
}) {
    const el = useRef();
    const { hasSmoothScrollbar } = useScrollRig();

    return (
        <footer className={style.el}>
            <Tag
                ref={el}
                className={['transparentColor', style.headline].join(' ')}
                style={{ display: 'block' }}
                {...props}
            >
                {children}
            </Tag>

            <div className={style.links}>
                <b>Contact :</b>
                <div className='button'>
                    <a target='_blank' rel='noopener noreferrer' href='mailto: dragon6yzi@gmail.com'>
                        <span>Email</span>
                        <svg
                            className='button__graphic button__graphic--slide'
                            width='300%'
                            height='100%'
                            viewBox='0 0 1200 60'
                            preserveAspectRatio='none'
                        >
                            <path d='M0,56.5c0,0,298.666,0,399.333,0C448.336,56.5,513.994,46,597,46c77.327,0,135,10.5,200.999,10.5c95.996,0,402.001,0,402.001,0' />
                        </svg>
                    </a>
                </div>
                <b> • </b>
                <div className='button'>
                    <a target='_blank' rel='noopener noreferrer' href='https://instagram.com/clchiang_/'>
                        <span>Instagram</span>
                        <svg
                            className='button__graphic button__graphic--slide'
                            width='300%'
                            height='100%'
                            viewBox='0 0 1200 60'
                            preserveAspectRatio='none'
                        >
                            <path d='M0,56.5c0,0,298.666,0,399.333,0C448.336,56.5,513.994,46,597,46c77.327,0,135,10.5,200.999,10.5c95.996,0,402.001,0,402.001,0' />
                        </svg>
                    </a>
                </div>
                <b> • </b>
                <div className='button'>
                    <a target='_blank' rel='noopener noreferrer' href='https://www.linkedin.com/in/clchaing5566/'>
                        <span>Linkedin</span>
                        <svg
                            className='button__graphic button__graphic--slide'
                            width='300%'
                            height='100%'
                            viewBox='0 0 1200 60'
                            preserveAspectRatio='none'
                        >
                            <path d='M0,56.5c0,0,298.666,0,399.333,0C448.336,56.5,513.994,46,597,46c77.327,0,135,10.5,200.999,10.5c95.996,0,402.001,0,402.001,0' />
                        </svg>
                    </a>
                </div>
            </div>

            {hasSmoothScrollbar && (
                <UseCanvas debug={false}>
                    <ScrollScene track={el}>
                        {props => (
                            <group>
                                <Star outerRadius={2} innerRadius={1.3} color={color} />
                                <Model url='/models/circle/scene.gltf' texturePath={texturePath} />
                                <WebGLText el={el} font={font} glyphGeometryDetail={16} renderOrder={-1} {...props}>
                                    <MeshDistortMaterial speed={1.5} distort={0.18} />
                                    {children}
                                </WebGLText>
                            </group>
                        )}
                    </ScrollScene>
                </UseCanvas>
            )}
        </footer>
    );
}

Footer.propTypes = {
    children: PropTypes.any,
    wobble: PropTypes.bool,
    font: PropTypes.string,
    as: PropTypes.any,
    color: PropTypes.string,
    texturePath: PropTypes.string,
};
