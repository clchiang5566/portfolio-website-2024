import React, { useState, useRef, useEffect } from 'react';
import { useGLTF, Text } from '@react-three/drei';
import { UseCanvas, useScrollRig, ScrollScene } from '@14islands/r3f-scroll-rig';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { a, useSpring } from '@react-spring/three';
import style from './About.module.scss';
import { selectIsZoom } from '../../redux/home/home.selector';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTelevision } from '../../redux/home/home.action';
import { useMediaQueryCheck } from '../../hooks/useMediaQueryCheck';

function TVModel({ scrollState, ...props }) {
    const { nodes } = useGLTF('/models/tv.gltf');
    const group = useRef();
    const isClicked = useSelector(selectIsZoom);
    const { isMobile } = useMediaQueryCheck(991);

    const [video] = useState(() => {
        const vid = document.createElement('video');
        vid.src = '/video/test.mp4';
        vid.crossOrigin = 'Anonymous';
        vid.loop = true;
        vid.muted = true;
        vid.play();
        return vid;
    });

    const { rotationY, scaleSpring } = useSpring({
        // rotationY: isClicked ? Math.PI : scrollState.progress * Math.PI * 2,
        scaleSpring: isClicked ? isMobile ? 1.08 : 3.2 : isMobile ? 0.6 : 1.5,
        config: { mass: 0.5, tension: 300, friction: 30 },
    });

    useFrame(() => {
        group.current.rotation.y = scrollState.progress * Math.PI * 2;
    });

    return (
        <a.group
            ref={group}
            scale={scaleSpring}
            // rotation-z={0.1}
            rotation-y={rotationY}
        >

            <mesh geometry={nodes.TV.geometry} material-emissive={'white'}>
                <meshStandardMaterial color="#313131" />
            </mesh>
            <mesh rotation={[0, 0, 0]} position={[0, 0, 1.01]}>
                <planeGeometry args={[3.2, 1.9]} />
                <meshStandardMaterial emissive="#313131" side={THREE.DoubleSide}>
                    <videoTexture attach="map" args={[video]} />
                    <videoTexture attach="emissiveMap" args={[video]} />
                </meshStandardMaterial>
            </mesh>
            {isClicked && <Text
                position={[0, 0, 1]}
                fontSize={0.14}
                color='white'
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.006}
                outlineColor='#313131'
                font='/fonts/Montserrat-Bold.woff'
                rotation={[0, Math.PI, 0]} // Rotate the text 180 degrees on the Y-axis
            >
                SUPER COOL SHAWREEL STILL WIP.
            </Text>}
        </a.group>
    );
};

export function Television(props) {
    const el = useRef();
    const { hasSmoothScrollbar } = useScrollRig();
    const dispatch = useDispatch();
    const isClicked = useSelector(selectIsZoom);

    const handleClick = () => {
        dispatch(toggleTelevision(!isClicked));
    };

    return (
        <div
            className={[style.video, !isClicked ? style.videoMin : null].join(' ')}
            ref={el}
            {...props}
            onClick={() => handleClick()}
        >
            {hasSmoothScrollbar && (
                <UseCanvas>
                    <ScrollScene track={el}>
                        {(props) => (
                            <TVModel {...props} />
                        )}
                    </ScrollScene>
                </UseCanvas>
            )}
        </div>
    );
}