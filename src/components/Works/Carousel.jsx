import { React, useEffect, useRef, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { usePrevious } from 'react-use';
import { useSelector, useDispatch } from 'react-redux';
import gsap from 'gsap';
import { CarouselItem } from './CarouselItem';
import { lerp, getPiramidalIndex } from '../../utils/common';
import images from './data';
import { TextGroup } from './TextGroup';
import { useMediaQueryCheck } from '../../hooks/useMediaQueryCheck';
import { getWheelData, getPointerData, getIsCarousel } from '../../redux/works/works.selector';
import { setCurrentColor, setIsCarousel } from '../../redux/works/works.action';
import { Model } from './Model';
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

export function Carousel ({ isPage, pageIndex }) {
    const [$root, setRoot] = useState();
    const $post = useRef();
    const state = useSelector(state => state);
    const dispatch = useDispatch();
    const index = isPage ? pageIndex : 0;
    const { isMobile } = useMediaQueryCheck(991);
    const [activePlane, setActivePlane] = useState(isPage ? pageIndex : null); 
    const [currentIndex, setCurrentIndex] = useState(isPage ? pageIndex : null);
    const [isTextReady, setTextReady] = useState(false);
    const [isPoster, setIsPoster] = useState(isPage || false);
    const [isScroll, setIsScroll] = useState(false);
    const [textShow, setTextShow] = useState(false);
    const prevActivePlane = usePrevious(index);
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
    const wheelData = useSelector(getWheelData);
    const pointerData = useSelector(getPointerData);
    const material = useRef({});
    const [currentTexture, setCurrentTexture] = useState('/models/down/Material_body.png');
    const isCarousel = useSelector(getIsCarousel);

    const displayItems = (item, index, active, isPoster, delta) => {
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
            duration: isPoster || isTextReady === false ? 0 : 2,
        });
    };

    useFrame((state, delta) => {
            progress.current = Math.max(0, Math.min(progress.current, 100));
            const active = Math.floor((progress.current / 100) * ($items.length - 1));
            $items.forEach((item, index) => displayItems(item, index, active, isPoster, delta));
            speed.current = lerp(speed.current, Math.abs(oldProgress.current - progress.current), 0.2);
            oldProgress.current = lerp(oldProgress.current, progress.current, 0.1);
            if (speed.current > 0.4 && !isScroll && !isPoster) {
                setIsScroll(true);
            }
            if (speed.current < 0.4 && isScroll) {
                setIsScroll(false);
            }
            if (active !== currentIndex) {
                handleChangeOrder(active);
                dispatch(setCurrentColor(images[active]?.bgColor));
                setCurrentTexture(images[active]?.texture);
            }
            if ($post.current && !isPoster) {
                $post.current.thickness = speed.current;
            }
    });

    const handleChangeOrder = i => {
        if (i === null || isPoster === true) return;
        setCurrentIndex(i);
    };

    useEffect(() => {
        if (!$items) return;
        if (activePlane !== null && prevActivePlane === null) {
            progress.current = (activePlane / ($items.length - 1)) * 100;
        }
    }, [activePlane, $items]);

    useEffect(() => {
        if (isCarousel) {
            setCurrentTexture(images[currentIndex]?.texture);
            setIsPoster(false);
            setActivePlane(null);
            dispatch(setIsCarousel(false));
        }
    }, [isCarousel]);

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
                        item={item}
                        index={i}
                        isPoster={isPoster}
                        setActivePlane={setActivePlane}
                        activePlane={activePlane}
                        activeIndex={currentIndex}
                        color={images[currentIndex]?.bgColor}
                        material={material}
                        setTextReady={setTextReady}
                        setTextShow={setTextShow}
                        apiUrl={images[currentIndex]?.dataUrl}
                        key={i}
                    />
                ))}
            </group>
        );
    };

    return (
        <group>
            {renderPlaneEvents()}
            {renderSlider()}
            {isTextReady && textShow && activePlane == null && <TextGroup currentIndex={currentIndex} />}
            {!isPoster && activePlane == null && <Model texturePath={currentTexture} />}
        </group>
    );
}

Carousel.propTypes = {
    isPage: PropTypes.bool,
    pageIndex: PropTypes.number,
};
