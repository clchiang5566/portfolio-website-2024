import React, { useRef, useEffect, useState } from 'react';
import { useScrollbar, useTracker } from '@14islands/r3f-scroll-rig';
import { useFrame } from '@react-three/fiber';
import { Model } from './Model';
import gsap from 'gsap';
import * as THREE from 'three';
import PropTypes from 'prop-types';
import { useMediaQueryCheck } from '../../hooks/useMediaQueryCheck';
import { selectIsFloating } from '../../redux/home/home.selector';
import { useSelector, useDispatch } from 'react-redux';
import { toggleModelActive } from '../../redux/home/home.action';
import { mix } from '@popmotion/popcorn';
import { easeQuadInOut } from 'd3-ease';

export function Circle ({ setIsActive, headerEl, ...props }) {
    const group = useRef();
    const { isMobile } = useMediaQueryCheck(991);
    const radius = isMobile ? 1.2 : 3;
    const scale = isMobile ? 0.005 : 0.01;
    const { scrollState } = useTracker(headerEl);
    const isFloating = useSelector(selectIsFloating);
    const [isTwist, setIsTwist] = useState(false);
    const [twistAmount, setTwistAmount] = useState(36);
    const [twistTime, setTwistTime] = useState(0.1);
    const dispatch = useDispatch();

    const urls = [
        '/models/down/scene.gltf',
    ];
    const timeOffsets = useRef(urls.map(() => Math.random() * 1000));
    const { onScroll } = useScrollbar();

    const getTwistAmount = scrollVisibility => {
        const clampedVisibility = Math.max(0.1, Math.min(1, scrollVisibility));
        const easedVisibility = easeQuadInOut((clampedVisibility - 0.1) / (1 - 0.1));
        const twistAmount = mix(36, 1, easedVisibility);
        return twistAmount;
    };

    const getTwistTime = scrollVisibility => {
        const clampedVisibility = Math.max(0.1, Math.min(18, scrollVisibility));
        const easedVisibility = easeQuadInOut((clampedVisibility - 0.1) / (1 - 0.1));
        const twistTime = mix(18, 1, easedVisibility);
        return twistTime;
    };

    useEffect(() => {
        onScroll(() => {
            setTwistAmount(getTwistAmount(scrollState.visibility));
            setTwistTime(getTwistTime(scrollState.visibility));
            if (scrollState.progress > 0.25) {
                setIsTwist(true);
            } else {
                setIsTwist(false);
            }
        });
    }, [onScroll, scrollState]);

    useEffect(() => {
        if (group.current) {
            if (isFloating) {
                group.current.children.forEach((child, index) => {
                    const theta = Math.random() * 2 * Math.PI;
                    const phi = Math.acos(2 * Math.random() - 1);
                    const x = radius * Math.sin(phi) * Math.cos(theta);
                    const y = radius * Math.sin(phi) * Math.sin(theta);
                    const z = radius * Math.cos(phi);

                    gsap.to(child.position, {
                        x: x,
                        y: y,
                        z: z,
                        duration: 3,
                        ease: 'power2.inOut',
                        onComplete: () => {
                            dispatch(toggleModelActive(false));
                        },
                    });
                });
            } else {
                group.current.children.forEach((child, index) => {
                    gsap.to(child.position, {
                        x: isMobile ? index * 0.7 - 0.5 : index * 2.5 - 3.5,
                        y:
                            isMobile && index === 2
                                ? 3
                                : isMobile && (index === 0 || index === 4)
                                ? 1
                                : isMobile && (index === 1 || index === 3)
                                ? -2
                                : index === 2
                                ? 2.5
                                : index === 0 || index === 4
                                ? 1
                                : -1,
                        z: isMobile ? index - 4 : 0,
                        duration: 3 + index * 0.2,
                        ease: 'power2.inOut',
                    });
                    gsap.to(child.rotation, {
                        z: 0,
                        duration: 3 + index * 0.2,
                        ease: 'power2.inOut',
                    });
                });
                gsap.to(group.current.rotation, {
                    x: 0,
                    y: 0,
                    duration: 3,
                    ease: 'power2.inOut',
                    onComplete: () => {
                        dispatch(toggleModelActive(false));
                    },
                });
            }
        }
    }, [isFloating]);

    useFrame((state, delta) => {
        if (group.current && isFloating) {
            const randomRotationX = THREE.MathUtils.lerp(
                group.current.rotation.x,
                THREE.MathUtils.randFloatSpread(0.5),
                0.1
            );
            const randomRotationY = THREE.MathUtils.lerp(
                group.current.rotation.y,
                THREE.MathUtils.randFloatSpread(0.5),
                0.1
            );
            group.current.rotation.x = randomRotationX * delta;
            group.current.rotation.y = randomRotationY * delta;

            group.current.children.forEach((child, index) => {
                const time = state.clock.getElapsedTime() + timeOffsets.current[index];
                child.position.x += Math.sin(time * 0.5) * 0.01;
                child.position.y += Math.cos(time * 0.3) * 0.01;
                child.rotation.z += Math.sin(time * 0.2) * 0.02;
            });
        }
    });

    return (
        <group ref={group} position={[0, 0, 2]}>
            {urls.map((url, index) => (
                <Model
                    key={index}
                    index={index}
                    url={url}
                    position={[0,0,0]}
                    scale={scale}
                    isFloating={isFloating}
                    isTwist={isTwist}
                    twistAmount={twistAmount}
                    twistTime={twistTime}
                />
            ))}
        </group>
    );
}

Circle.propTypes = {
    isFloating: PropTypes.bool,
    setIsActive: PropTypes.func,
    headerEl: PropTypes.any,
};
