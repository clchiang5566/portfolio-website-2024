import React, { useRef, useEffect, useState } from 'react';
import { UseCanvas, useScrollRig, useScrollbar, useTracker } from '@14islands/r3f-scroll-rig';
import { useFrame, useThree } from '@react-three/fiber';
import { useMediaQueryCheck } from '../../hooks/useMediaQueryCheck';
import { interpolate, mix } from '@popmotion/popcorn';
import { easeQuadInOut } from 'd3-ease';
import PropTypes from 'prop-types';
import { Model } from './Model';

function GroupModel ({ headerEl, marqueeEl }) {
    const group = useRef();
    const parallax = useRef();
    const groupLeftRef = useRef();
    const groupCenterRef = useRef();
    const groupRightRef = useRef();
    const { isMobile } = useMediaQueryCheck(991);
    const { scroll, onScroll } = useScrollbar();
    const size = useThree(s => s.size);
    const { scrollState: containerScrollState } = useTracker(headerEl);
    const { scale, position, scrollState } = useTracker(marqueeEl);
    const [isWireframe, setIsWireframe] = useState(false);

    const parallaxPosMapper = interpolate([0, 1], [size.height * 0.0005, 0]);
    const parallaxRotMapper = interpolate([0, 1], [Math.PI * -0.5, Math.PI * 0.25]);
    const rotationMapper = interpolate([0, 1], [0, Math.PI * 1.5], {
        ease: [easeQuadInOut],
    });

    const scaleMapper = interpolate(
        [0, 1],
        [Math.min(size.width, size.height) * 0.002, scale?.x * isMobile ? 0.5 : 1],
        { ease: [easeQuadInOut] }
    );
    const positionMapper = interpolate([0, 1], [0, 1], { ease: [easeQuadInOut] });

    useEffect(() => {
        onScroll(() => {
            if (scrollState.progress > 0.16) {
                setIsWireframe(true);
            } else {
                setIsWireframe(false);
            }
        });
    }, [onScroll, scrollState]);

    useFrame(({ clock }, delta) => {
        if (groupLeftRef && groupRightRef) {
            const speed = scroll.velocity * 0.2 * 0.005;
            const maxSpeed = scroll.velocity * 0.2 * 0.01;

            groupLeftRef.current.rotation.y += Math.min(maxSpeed, Math.max(maxSpeed, speed));
            groupCenterRef.current.rotation.y -= Math.min(maxSpeed, Math.max(maxSpeed, speed));
            groupRightRef.current.rotation.y += Math.min(maxSpeed, Math.max(maxSpeed, speed));

            groupLeftRef.current.position.y += Math.min(maxSpeed, Math.max(maxSpeed, speed)) * 0.05;
            groupRightRef.current.position.y -= Math.min(maxSpeed, Math.max(maxSpeed, speed)) * 0.08;

            parallax.current.position.y = parallaxPosMapper(containerScrollState.visibility);
            parallax.current.rotation.y = parallaxRotMapper(containerScrollState.visibility);

            group.current.rotation.y = rotationMapper(scrollState.viewport);
            group.current.position.y = mix(0, position.y, positionMapper(scrollState.viewport));
            group.current.scale.setScalar(scaleMapper(scrollState.viewport));
        }
    });

    return (
        <>
            <group ref={group}>
                <group ref={parallax} position-x='-1'>
                    <group ref={groupLeftRef} position={isMobile ? [-1, 1, 0] : [-3, 0.5, 0]}>
                        <Model url='/models/air/scene1.gltf' index={0} isWireframe={isWireframe} color='#ee6055' />
                    </group>
                    <group ref={groupCenterRef} position={isMobile ? [1, 1, 0] : [1, 0.5, 0]}>
                        <Model url='/models/air/scene2.gltf' index={1} isWireframe={isWireframe} color='#57f6b4' />
                    </group>
                    <group ref={groupRightRef} position={isMobile ? [3, 1, 0] : [5, 0.5, 0]}>
                        <Model url='/models/air/scene3.gltf' index={2} isWireframe={isWireframe} color='#cce1f3' />
                    </group>
                </group>
            </group>
        </>
    );
}

GroupModel.propTypes = {
    headerEl: PropTypes.any,
    marqueeEl: PropTypes.any,
};

export function Header ({ headerEl, marqueeEl, ...props }) {
    const el = useRef();
    const { hasSmoothScrollbar } = useScrollRig();

    return (
        <header ref={el} {...props}>
            {hasSmoothScrollbar && (
                <UseCanvas debug={false}>
                    <GroupModel {...props} marqueeEl={marqueeEl} headerEl={headerEl} />
                </UseCanvas>
            )}
        </header>
    );
}

Header.propTypes = {
    headerEl: PropTypes.any,
    marqueeEl: PropTypes.any,
};
