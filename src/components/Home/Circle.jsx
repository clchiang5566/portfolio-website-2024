import React, { useRef, useEffect, useState } from 'react';
import { useScrollbar, useTracker } from '@14islands/r3f-scroll-rig';
import { useFrame } from '@react-three/fiber';
import { Model } from './Model';
import gsap from 'gsap';
import * as THREE from 'three';
import PropTypes from 'prop-types';
import { useMediaQueryCheck, useMediaQueryLaptopCheck } from '../../hooks/useMediaQueryCheck';
import { selectIsFloating } from '../../redux/home/home.selector';
import { useSelector, useDispatch } from 'react-redux';
import { toggleModelActive } from '../../redux/home/home.action';
import { mix } from '@popmotion/popcorn';
import { easeQuadInOut } from 'd3-ease';
// import { easing } from 'maath'

export function Circle ({ setIsActive, headerEl, setIsScrollDown, ...props }) {
    const group = useRef();
    const { isMobile } = useMediaQueryCheck(991);
    const { isLaptop } = useMediaQueryLaptopCheck(1500);
    const radius = isMobile ? 0.4 : isLaptop ? 3 : 3.5;
    const scale = isMobile ? 0.004 : isLaptop ? 0.009 : 0.012;
    const { scrollState } = useTracker(headerEl);
    const isFloating = useSelector(selectIsFloating);
    const [isTwist, setIsTwist] = useState(false);
    const [twistAmount, setTwistAmount] = useState(36);
    const [twistTime, setTwistTime] = useState(0.1);
    const prevScroll = useRef(scrollState.progress);
    const dispatch = useDispatch();
    const rotationZ = useRef(0);

    const items = [
        {
            url: '/models/dance/scene1.gltf',
            text: '10th',
            position: [-2, isLaptop ? 0.5 : 0, 0],
            mobilePosition: [-1.5, 0.8, 0],
        },
        { url: '/models/dance/scene2.gltf', text: 'Anniversary', position: [-1.5, 0, 0], mobilePosition: [0, 1.2, 0] },
        {
            url: '/models/dance/scene3.gltf',
            text: '(2014 – 2024)',
            position: [-3, -0.5, 0],
            mobilePosition: [-1.5, 0, 0],
        },
        {
            url: '/models/dance/scene3.gltf',
            text: 'Edition',
            position: [isLaptop ? -1 : -1.5, -0.3, 0],
            mobilePosition: [0, 0.8, 0],
        },
        {
            url: '/models/dance/scene1.gltf',
            text: 'Portfolio',
            position: [isLaptop ? 0 : -0.5, isLaptop ? -0.5 : 0, 0],
            mobilePosition: [0, 0, 0],
        },
    ];

    const modelsPosition = {
        0: isMobile ? [-1.5, 0, 0] : isLaptop ? [-3, 0, 0] : [-4, 0, 0],
        1: isMobile ? [-1, 1, 0] : isLaptop ? [-0.5, 3, 0] : [-1, 3, 0],
        2: isMobile ? [-0.5, -1, 0] : isLaptop ? [0, -2, 0] : [0, -2, 0],
        3: isMobile ? [0.5, 1, 0] : isLaptop ? [2.5, 3, 0] : [3.5, 3, 0],
        4: isMobile ? [0.5, 0, 0] : isLaptop ? [3, 0, 0] : [4, 0, 0],
    };

    const timeOffsets = useRef(items.map(() => Math.random() * 1000));
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

            const currentScroll = scrollState.progress;
            const delta = currentScroll - prevScroll.current;

            if (delta > 0) {
                setIsScrollDown(true);
            } else if (delta < 0) {
                setIsScrollDown(false);
            }

            prevScroll.current = currentScroll;
        });
    }, [onScroll]);

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
                        x: modelsPosition[index][0],
                        y: modelsPosition[index][1],
                        z: modelsPosition[index][2],
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
        if (group.current) {
            rotationZ.current = THREE.MathUtils.damp(
                rotationZ.current,
                -scrollState.progress * (Math.PI * 2),
                4,
                delta
            );
            group.current.rotation.z = rotationZ.current;
            group.current.position.x = scrollState.progress * -0.1 + 1;

            if (isFloating) {
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
        }
    });

    return (
        <group ref={group} position={[0, 0, 0]}>
            {items.map((item, index) => (
                <Model
                    key={index}
                    index={index}
                    url={item.url}
                    position={modelsPosition[index]}
                    scale={scale}
                    isFloating={isFloating}
                    isTwist={isTwist}
                    twistAmount={twistAmount}
                    twistTime={twistTime}
                    scrollState={scrollState}
                    text={item.text}
                    htmlPosition={isMobile ? item.mobilePosition : item.position}
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
