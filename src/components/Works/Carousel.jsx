import { React, useEffect, useRef, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { usePrevious } from 'react-use';
import { useSelector, useDispatch } from 'react-redux';
import gsap from 'gsap';
import { CarouselItem } from './CarouselItem';
import { lerp, getPiramidalIndex } from '../../utils/common';
import images from './data';
import { useMediaQueryCheck } from '../../hooks/useMediaQueryCheck';
import { getWorks } from '../../redux/works/works.selector';
import { addWorks, resetWorks } from '../../redux/works/works.action';
import { Text } from '@react-three/drei';
import GlitchText from '../Common/GlitchText';
import * as THREE from 'three';
import PropTypes from 'prop-types';

const planeSettings = {
    width: 3.75,
    height: 5,
    gap: 3.5,
};

const planeMobileSettings = {
    width: 3,
    height: 4,
    gap: 3.5,
};

gsap.defaults({
    duration: 2,
    ease: 'power3.out',
});

export function Carousel ({ setBgColor, setCurrentTexture, setPosterActive,  wheelData, pointerData, clickData, setClickData }) {
    const [$root, setRoot] = useState();
    const $post = useRef();
    const state = useSelector(state => state);
    const dispatch = useDispatch();
    const works = getWorks(state)[0];
    const index = works?.currentIndex || 0;
    const { isMobile } = useMediaQueryCheck(991);
    const [activePlane, setActivePlane] = useState(works?.isBack ? index : null); // null
    const [currentIndex, setCurrentIndex] = useState(index);
    const [isTextReady, setTextReady] = useState(false);
    const [isBack, setIsBack] = useState(works?.isBack);
    const [isScroll, setIsScroll] = useState(false);
    const [textShow, setTextShow] = useState(false);
    const prevActivePlane = usePrevious(works?.isBack ? index : null);
    const { viewport, size } = useThree();
    const progress = useRef(index ? Math.round((100 / 8) * (index + 1)) : 0);
    const startY = useRef(0);
    const isDown = useRef(false);
    const speedWheel = 0.009;
    const speedDrag = -0.01;
    const oldProgress = useRef(0);
    const speed = useRef(0);
    const $items = useMemo(() => {
        if ($root) return $root.children;
    }, [$root]);
    const material = useRef({});
    const numberRef = useRef();
    const numberBackgroundRef = useRef();
    const textRef = useRef({});
    const textBackgroundRef = useRef({});
    const texts = [];
    const [animatedTexts, setAnimatedTexts] = useState(Array(texts.length).fill(''));
    const [number, setNumber] = useState();

    const displayItems = (item, index, active, isBack, delta) => {
        const piramidalIndex = getPiramidalIndex($items, active)[index];
        const direction = oldProgress.current - progress.current > 0 ? -10 : 10;

        if (material.current[index]) {
            material.current[index].material.uniforms.time.value += delta * 0.5;
            material.current[index].material.uniforms.shift.value = lerp(
                material.current[index].material.uniforms.shift.value,
                isMobile ? speed.current / direction : speed.current / 100,
                0.1
            );
        }
        gsap.to(item.position, {
            x: $items.length * - 0.1 + piramidalIndex * 0.1,
            y: isMobile
                ? (index - active) * - (planeSettings.height + planeSettings.gap)
                : (index - active) * - (planeSettings.height + planeSettings.gap),
            duration: isBack || isTextReady === false ? 0 : 2,
        });
    };

    useFrame((state, delta) => {
        progress.current = Math.max(0, Math.min(progress.current, 100));
        // console.log(Math.max(0, Math.min(progress.current, 5)))
        const active = Math.floor((progress.current / 100) * ($items.length - 1));
        $items.forEach((item, index) => displayItems(item, index, active, isBack, delta));
        speed.current = lerp(speed.current, Math.abs(oldProgress.current - progress.current), 0.2);
        oldProgress.current = lerp(oldProgress.current, progress.current, 0.1);
        if (speed.current > 0.4 && !isScroll && !isBack) {
            setIsScroll(true);
        }
        if (speed.current < 0.4 && isScroll) {
            setIsScroll(false);
        }
        if (active !== currentIndex) {
            handleChangeOrder(active);
            setBgColor(images[active]?.bgColor);
            setCurrentTexture(images[active]?.texture);
        }
        if ($post.current && !isBack) {
            $post.current.thickness = speed.current;
        }
    });

    const handleChangeOrder = i => {
        if (i == null || isBack === true) return;
        setCurrentIndex(i);
    };

    useEffect(() => {
        if (!$items) return;
        if (activePlane !== null && prevActivePlane === null) {
            progress.current = (activePlane / ($items.length - 1)) * 100;
            dispatch(addWorks(currentIndex, images[currentIndex]?.bgColor, false));
            setPosterActive(true);
        }
    }, [activePlane, $items]);

    useEffect(() => {
        if (isBack) { setCurrentTexture(images[currentIndex]?.texture); }
        setTimeout(() => {
            if (works?.isBack) {
                setIsBack(false);
                setActivePlane(null);
                dispatch(resetWorks());
            }
        }, 1500);
    }, []);

    useEffect(() => {
        if (wheelData !== null) {
            if (activePlane !== null) return;
            const isVerticalScroll = Math.abs(wheelData.deltaY) > Math.abs(wheelData.deltaX);
            const wheelProgress = isVerticalScroll ? wheelData.deltaY : wheelData.deltaX;
            speed.current = isVerticalScroll ? wheelData.deltaY : wheelData.deltaX;
            progress.current = progress.current + wheelProgress * speedWheel;
        }
    }, [wheelData]);

    useEffect(() => {
        if (pointerData !== null) {
            switch (pointerData.type) {
                case "pointerdown":
                    if (activePlane !== null) return;
                    isDown.current = true;
                    startY.current = pointerData.clientY || (pointerData.touches && pointerData.touches[0].clientY) || 0;
                    break;
                case "pointermove":
                    if (activePlane !== null || !isDown.current) return;
                    const y = pointerData.clientY || (pointerData.touches && pointerData.touches[0].clientY) || 0;
                    const mouseProgress = (y - startY.current) * speedDrag;
                    progress.current = progress.current + mouseProgress;
                    break;
                case "pointerup":
                    isDown.current = false;
                    break;
                case "onPointerLeave":
                    isDown.current = false;
                    break;
                case "onPointerCancel":
                    isDown.current = false;
                    break;
                default:
                    isDown.current = false;
            }
        }
    }, [pointerData]);

    const renderPlaneEvents = () => {
        return (
            <mesh position={[0, 0, -0.01]}>
                <planeGeometry args={[viewport.width, viewport.height]} />
                <meshBasicMaterial opacity={0} transparent />
            </mesh>
        );
    };

    const renderSlider = () => {
        return (
            <group ref={setRoot}>
                {images.map((item, i) => (
                    <CarouselItem
                        width={isMobile ? planeMobileSettings.width : planeSettings.width}
                        height={isMobile ? planeMobileSettings.height : planeSettings.height}
                        setActivePlane={setActivePlane}
                        activePlane={activePlane}
                        activeIndex={currentIndex}
                        isBack={isBack}
                        item={item}
                        index={i}
                        color={images[currentIndex]?.bgColor}
                        material={material}
                        clickData={clickData}
                        setClickData={setClickData}
                        setTextReady={setTextReady}
                        setTextShow={setTextShow}
                        key={i}
                    />
                ))}
            </group>
        );
    };

    const updateText = (index, updatedText) => {
        setAnimatedTexts(prev => {
            const newTexts = [...prev];
            newTexts[index] = updatedText;
            return newTexts;
        });
    };

    const renderText = () => {
        const pixelToUnitWidth = isMobile ? (32 / size.width) * viewport.width : (30 / size.width) * viewport.width;
        return (
            activePlane == null && (
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
                                {textShow && <planeGeometry args={[1, 1]} />}
                                {textShow && <meshBasicMaterial color={images[currentIndex]?.bgColor} />}
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
                            {textShow && <planeGeometry args={[1, 1]} />}
                            {textShow && <meshBasicMaterial color={images[currentIndex]?.bgColor} />}
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
            )
        );
    };

    return (
        <group>
            {renderPlaneEvents()}
            {renderSlider()}
            {isTextReady && renderText()}
        </group>
    );
}

Carousel.propTypes = {
    urls: PropTypes.array,
    color: PropTypes.string,
    setBgColor: PropTypes.func,
    setCurrentTexture: PropTypes.func,
    setPosterActive: PropTypes.func,
    wheelData: PropTypes.array, 
    pointerData: PropTypes.array
};
