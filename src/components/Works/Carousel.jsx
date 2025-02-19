import { React, useEffect, useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSelector, useDispatch } from 'react-redux';
import gsap from 'gsap';
import { CarouselItem } from './CarouselItem';
import { getPiramidalIndex } from '../../utils/common';
import images from './data';
import { TextGroup } from './TextGroup';
import { useMediaQueryCheck, useMediaQueryLaptopCheck } from '../../hooks/useMediaQueryCheck';
import {
    getWheelData,
    getPointerData,
    getIsCarousel,
    getIsPrevent,
    getCurrentIndex,
    getIsPoster,
    getDataUrl,
    getIsLoading,
    getIsSuccess,
    getIsVertical,
} from '../../redux/works/works.selector';
import {
    setCurrentColor,
    setCurrentIndex,
    setIsPrevent,
    setIsHover,
    updateDetail,
    updateCarousel,
} from '../../redux/works/works.action';
import { Model } from './Model';
import RouteWatcher from './RouteWatcher';
import * as THREE from 'three';

const planeSettings = {
    desktop: { width: 5.25, height: 7, gap: 5.5 },
    laptop: { width: 3.75, height: 5, gap: 4.5 },
    mobile: { width: 2.625, height: 3.5, gap: 0.5, verticalGap: 1.5 },
};

gsap.defaults({
    duration: 2,
    ease: 'power3.out',
});

export function Carousel () {
    const [$root, setRoot] = useState();
    const dispatch = useDispatch();
    const currentIndex = useSelector(getCurrentIndex);
    const isPoster = useSelector(getIsPoster);
    const index = isPoster ? currentIndex : 0;
    const [activePlane, setActivePlane] = useState(isPoster ? currentIndex : null);
    const currentIndexRef = useRef(isPoster ? currentIndex : null);
    const [textReady, setTextReady] = useState(isPoster);
    const { isMobile } = useMediaQueryCheck(991);
    const { isLaptop } = useMediaQueryLaptopCheck(1500);

    const progress = useRef(index ? Math.round((100 / 8) * (index + 1)) : 0);
    const startY = useRef(0);
    const startX = useRef(0);
    const isDown = useRef(false);
    const scrollSpeed = useRef(0);
    const speedWheel = 0.009;
    const speedDrag = 0.02;
    const oldProgress = useRef(0);
    const speed = useRef(0);
    const $items = useMemo(() => {
        if ($root) return $root.children;
    }, [$root]);
    const wheelData = useSelector(getWheelData);
    const pointerData = useSelector(getPointerData);

    const material = useRef({});
    const isCarousel = useSelector(getIsCarousel);
    const isPrevent = useSelector(getIsPrevent);
    const isVertical = useSelector(getIsVertical);

    const isSuccess = useSelector(getIsSuccess);
    const isLoading = useSelector(getIsLoading);
    const dataUrl = useSelector(getDataUrl);

    const displayItems = (item, index, active, isPoster, delta) => {
        const piramidalIndex = getPiramidalIndex($items, active)[index];
        const direction = oldProgress.current - progress.current > 0 ? -10 : 10;

        if (material.current[index]) {
            material.current[index].material.uniforms.time.value += delta * 0.5;
            material.current[index].material.uniforms.shift.value = isPoster
                ? THREE.MathUtils.lerp(
                      material.current[index].material.uniforms.shift.value,
                      scrollSpeed.current,
                      isMobile ? 0.02 : 0.01
                  )
                : THREE.MathUtils.lerp(
                      material.current[index].material.uniforms.shift.value,
                      isMobile ? speed.current / direction : speed.current / 100,
                      isMobile ? 0.2 : 0.1
                  );
        }

        gsap.to(item.position, {
            x: isVertical
                ? $items.length * -0.1 + piramidalIndex * 0.1
                : (index - active) *
                  ((isMobile
                      ? planeSettings.mobile.width
                      : isLaptop
                      ? planeSettings.laptop.width
                      : planeSettings.desktop.width) +
                      (isMobile
                          ? planeSettings.mobile.gap
                          : isMobile && isVertical
                          ? planeSettings.mobile.verticalGap
                          : isLaptop
                          ? planeSettings.laptop.gap
                          : planeSettings.desktop.gap)),
            y: isVertical
                ? (index - active) *
                  -(
                      (isMobile
                          ? planeSettings.mobile.height
                          : isLaptop
                          ? planeSettings.laptop.height
                          : planeSettings.desktop.height) +
                      (isMobile && !isVertical
                          ? planeSettings.mobile.gap
                          : isMobile && isVertical
                          ? planeSettings.mobile.verticalGap
                          : isLaptop
                          ? planeSettings.laptop.gap
                          : planeSettings.desktop.gap)
                  )
                : active > index
                ? $items.length * 2.5 + piramidalIndex * -2.5
                : $items.length * -2.5 + piramidalIndex * 2.5,
            duration: isPoster || textReady === false ? 0 : 2,
        });
    };

    const handleChangeOrder = i => {
        if (i === null || isPoster === true) return;
        dispatch(setCurrentIndex(i));
        dispatch(setCurrentColor(images[i]?.bgColor));
    };

    useEffect(() => {
        if (wheelData !== null && textReady) {
            if (activePlane !== null) return;
            const isVerticalScroll = Math.abs(wheelData.deltaY) > Math.abs(wheelData.deltaX);
            const wheelProgress = isVerticalScroll ? wheelData.deltaY : wheelData.deltaX;
            speed.current = isVerticalScroll ? wheelData.deltaY : wheelData.deltaX;
            progress.current = progress.current + wheelProgress * speedWheel;
        }

        if (pointerData !== null && textReady) {
            switch (pointerData.type) {
                case 'pointerdown':
                    if (activePlane !== null) return;
                    isDown.current = true;
                    if (isVertical) {
                        startY.current =
                            pointerData.clientY || (pointerData.touches && pointerData.touches[0].clientY) || 0;
                    } else {
                        startX.current =
                            pointerData.clientX || (pointerData.touches && pointerData.touches[0].clientX) || 0;
                    }
                    break;
                case 'pointermove': {
                    if (activePlane !== null || !isDown.current) return;
                    let mouseProgress;
                    if (isVertical) {
                        const y = pointerData.clientY || (pointerData.touches && pointerData.touches[0].clientY) || 0;
                        mouseProgress = (y - startY.current) * speedDrag;
                    } else {
                        const x = pointerData.clientX || (pointerData.touches && pointerData.touches[0].clientX) || 0;
                        mouseProgress = (x - startX.current) * speedDrag;
                    }
                    progress.current = progress.current - mouseProgress;
                    break;
                }
                case 'pointerup':
                    isDown.current = false;
                    break;
                case 'onPointerLeave':
                    isDown.current = false;
                    break;
                case 'onPointerCancel':
                    isDown.current = false;
                    break;
                default:
            }
        }
    }, [pointerData, wheelData]);

    useEffect(() => {
        if (Math.abs(speed.current) > 10 && !isPrevent && !isPoster && textReady) {
            dispatch(setIsPrevent(true));
            dispatch(setIsHover(false));
        }
        if (Math.abs(speed.current) < 10 && isPrevent && !isPoster && textReady) {
            dispatch(setIsPrevent(false));
        }
    }, [speed.current]);

    useEffect(() => {
        if (!isSuccess && isLoading && dataUrl) {
            const modules = {
                tata: () => import('../../pages/api/data/tata'),
                delonghi: () => import('../../pages/api/data/delonghi'),
                kitkat: () => import('../../pages/api/data/kitkat'),
                maxis: () => import('../../pages/api/data/maxis'),
                tomorrow: () => import('../../pages/api/data/tomorrow'),
                nio: () => import('../../pages/api/data/nio'),
                hbl: () => import('../../pages/api/data/hbl'),
                timberland: () => import('../../pages/api/data/timberland'),
            };
            const loadData = async () => {
                try {
                    // console.log('isDetail');
                    const module = await modules[dataUrl]();
                    dispatch(
                        updateDetail({
                            isPoster: true,
                            isActive: false,
                            isSuccess: false,
                            isLoading: false,
                            isDetailPage: true,
                            pageContent: module.default,
                        })
                    );
                } catch (error) {
                    // console.error('Failed to load module:', error);
                }
            };
            loadData();
        }

        if (isCarousel) {
            // console.log('remove deatil page');
            setActivePlane(null);
            dispatch(
                updateCarousel({
                    isPoster: false,
                    isCarousel: false,
                    isLoading: false,
                    isDetailPage: false,
                })
            );
            window.history.pushState(null, '', '/works');
        }
    }, [isLoading, isCarousel]);

    useEffect(() => {
        if (isPoster) {
            let lastScrollY = window.scrollY;
            let lastTimestamp = performance.now();

            const handleScroll = () => {
                const currentScrollY = window.scrollY;
                const currentTimestamp = performance.now();

                const deltaY = currentScrollY - lastScrollY;
                const deltaTime = currentTimestamp - lastTimestamp;

                if (deltaTime > 0) {
                    const speed = deltaY / deltaTime;
                    scrollSpeed.current = speed;
                }

                lastScrollY = currentScrollY;
                lastTimestamp = currentTimestamp;
            };

            window.addEventListener('scroll', handleScroll);
            return () => {
                window.removeEventListener('scroll', handleScroll);
            };
        }
    }, [isPoster]);

    useFrame((state, delta) => {
        progress.current = Math.max(0, Math.min(progress.current, 100));
        const active = Math.floor((progress.current / 100) * ($items.length - 1));
        $items.forEach((item, index) => displayItems(item, index, active, isPoster, delta));
        speed.current = THREE.MathUtils.lerp(speed.current, Math.abs(oldProgress.current - progress.current), 0.2);
        oldProgress.current = THREE.MathUtils.lerp(oldProgress.current, progress.current, 0.1);
        if (active !== currentIndexRef.current) {
            handleChangeOrder(active);
            currentIndexRef.current = active;
        }
        const speedRate = speed.current < 0 ? speed.current * -1 : speed.current;
        $root.position.z = THREE.MathUtils.damp($root.position.z, Math.max(0, speedRate * 0.03), 4, delta);
    });

    const renderSlider = () => {
        return (
            <group ref={setRoot}>
                {images.map((item, i) => (
                    <CarouselItem
                        width={
                            isMobile
                                ? planeSettings.mobile.width
                                : isLaptop
                                ? planeSettings.laptop.width
                                : planeSettings.desktop.width
                        }
                        height={
                            isMobile
                                ? planeSettings.mobile.height
                                : isLaptop
                                ? planeSettings.laptop.height
                                : planeSettings.desktop.height
                        }
                        item={item}
                        index={i}
                        setActivePlane={setActivePlane}
                        activePlane={activePlane}
                        material={material}
                        textReady={textReady}
                        setTextReady={setTextReady}
                        key={i}
                    />
                ))}
            </group>
        );
    };

    return (
        <group>
            {renderSlider()}
            {textReady && activePlane == null && <TextGroup currentIndex={currentIndexRef.current} />}
            {!isPoster && activePlane == null && (
                <Model texturePath={images[currentIndexRef.current]?.texture} color={images[currentIndex]?.bgColor} />
            )}
            <RouteWatcher />
        </group>
    );
}

Carousel.propTypes = {};
