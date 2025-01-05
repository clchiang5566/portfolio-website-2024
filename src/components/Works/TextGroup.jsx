import { React, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import PropTypes from 'prop-types';
import { Text } from '@react-three/drei';
import GlitchText from '../Common/GlitchText';
import images from './data';
import { useMediaQueryCheck } from '../../hooks/useMediaQueryCheck';
import * as THREE from 'three';

export function TextGroup ({ currentIndex }) {
    const numberRef = useRef();
    const numberBackgroundRef = useRef();
    const textRef = useRef({});
    const textBackgroundRef = useRef({});
    const texts = [];
    const [animatedTexts, setAnimatedTexts] = useState(Array(texts.length).fill(''));
    const [number, setNumber] = useState();
    const { viewport, size } = useThree();
    const { isMobile } = useMediaQueryCheck(991);

    const pixelToUnitWidth = isMobile ? (32 / size.width) * viewport.width : (30 / size.width) * viewport.width;

    const updateText = (index, updatedText) => {
        setAnimatedTexts(prev => {
            const newTexts = [...prev];
            newTexts[index] = updatedText;
            return newTexts;
        });
    };

    return (
        <>
            {images[currentIndex]?.subtitle.map((text, index) => (
                <group
                    key={index}
                    position={[
                        isMobile ? -viewport.width / 2 + pixelToUnitWidth : -viewport.width / 2 + pixelToUnitWidth * 1.2,
                        isMobile
                            ? -viewport.height / 2 + (index + 1) * pixelToUnitWidth 
                            : -viewport.height / 2 +
                                (index + 1) * pixelToUnitWidth +
                                index * pixelToUnitWidth * 1.2,
                        0,
                    ]}
                >
                    <mesh
                        ref={node => {
                            textBackgroundRef.current[index] = node;
                        }}
                    >
                        <planeGeometry args={[1, 1]} />
                        <meshBasicMaterial color={images[currentIndex]?.bgColor} />
                    </mesh>
                    <Text
                        ref={node => {
                            textRef.current[index] = node;
                        }}
                        fontSize={isMobile ? 0.12 : 0.18}
                        letterSpacing={isMobile ? 0.25 : 0.4}
                        color='#313131'
                        anchorX='left'
                        anchorY='bottom'
                        lineHeight={isMobile ? 1.2 : 1.8}
                        onSync={text => {
                            const size = text.geometry.boundingBox.getSize(new THREE.Vector3());
                            const position = text.geometry.boundingBox.getCenter(new THREE.Vector3());
                            if (textBackgroundRef.current[index]) {
                                textBackgroundRef.current[index].scale.set(size.x + 0.2, size.y + 0.2, 0);
                                textBackgroundRef.current[index].position.set(position.x, position.y, 0);
                            }
                        }}
                    >
                        {animatedTexts[index]}
                    </Text>
                    <GlitchText
                        text={images[currentIndex]?.subtitle[index]}
                        duration={1000}
                        onUpdate={updatedText => updateText(index, updatedText)}
                    />
                </group>
            ))}
            <group position={[isMobile ? viewport.width / 2 - pixelToUnitWidth : viewport.width / 2 - pixelToUnitWidth * 1.2, isMobile ? viewport.height / 2 - 1 : viewport.height / 2 - 1.7, 0]}>
                <mesh ref={numberBackgroundRef}>
                    <planeGeometry args={[1, 1]} />
                    <meshBasicMaterial color={images[currentIndex]?.bgColor} />
                </mesh>
                <Text
                    ref={numberRef}
                    fontSize={isMobile ? 0.12 : 0.18}
                    letterSpacing={isMobile ? 0.25 : 0.4}
                    color='#313131'
                    anchorX='right'
                    anchorY='top'
                    lineHeight={isMobile ? 1.6 : 1.6}
                    onSync={text => {
                        const size = text.geometry.boundingBox.getSize(new THREE.Vector3());
                        const position = text.geometry.boundingBox.getCenter(new THREE.Vector3());
                        if (numberBackgroundRef.current) {
                            numberBackgroundRef.current.scale.set(size.x + 0.2, size.y + 0.2, 0);
                            numberBackgroundRef.current.position.set(position.x, position.y, 0);
                        }
                    }}
                >
                    {number}
                </Text>
                <GlitchText
                    text={
                        isMobile
                            ? `${currentIndex + 1} / ${images.length}`
                            : `${currentIndex + 1}\n/\n${images.length}`
                    }
                    duration={1000}
                    onUpdate={updatedText => setNumber(updatedText)}
                />
            </group>
        </>
    );
}

TextGroup.propTypes = {
    currentIndex: PropTypes.number,
};
