import React, { useRef, useEffect } from 'react';
import { ScrollScene, UseCanvas, useScrollRig } from '@14islands/r3f-scroll-rig';
import { MeshDistortMaterial } from '@react-three/drei';
import { WebGLText } from '@14islands/r3f-scroll-rig/powerups';
import PropTypes from 'prop-types';

export const Headline = ({ children, ...props }) => (
    <Text font='/fonts/Montserrat-Bold.woff' {...props}>
        {children}
    </Text>
);

Headline.propTypes = {
    children: PropTypes.any,
};

export const Subtitle = ({ children, ...props }) => (
    <Text font='/fonts/Montserrat-ExtraBold.woff' {...props}>
        {children}
    </Text>
);

Subtitle.propTypes = {
    children: PropTypes.any,
};

export const BodyCopy = Text;

export function Text ({
    children,
    wobble,
    className,
    font = '/fonts/Montserrat-Medium.woff',
    as: Tag = 'span',
    isHidden,
    outlineWidth,
    color,
    ...props
}) {
    const el = useRef();
    const ref = useRef();
    const { hasSmoothScrollbar } = useScrollRig();

    useEffect(() => {
        console.log(ref)
        if (ref.current) {
            ref.current.position.z = 1;
        }
    }, []);

    return (
        <>
            <Tag ref={el} className='transparentColor' style={{ display: 'block' }} {...props}>
                {children}
            </Tag>

            {hasSmoothScrollbar && isHidden !== true && (
                <UseCanvas debug={false}>
                    <ScrollScene track={el}>
                        {props => (
                            <WebGLText
                                ref={ref}
                                el={el}
                                font={font}
                                glyphGeometryDetail={16}
                                renderOrder={-1}
                                outlineWidth={outlineWidth ? 0.01 : 0}
                                outlineColor={outlineWidth ? '#313131' : ''}
                                color={color}
                                {...props}
                            >
                                {wobble && <MeshDistortMaterial speed={1.5} distort={0.18} />}
                                {children}
                            </WebGLText>
                        )}
                    </ScrollScene>
                </UseCanvas>
            )}
        </>
    );
}

Text.propTypes = {
    children: PropTypes.any,
    wobble: PropTypes.bool,
    className: PropTypes.string,
    font: PropTypes.string,
    as: PropTypes.any,
    isHidden: PropTypes.bool,
    outlineWidth: PropTypes.any,
    color: PropTypes.string,
};
