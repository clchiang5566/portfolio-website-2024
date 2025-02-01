import { React, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Plane } from './Plane';
import { Text, MeshWobbleMaterial } from '@react-three/drei';
import { useMediaQueryCheck, useMediaQueryLaptopCheck } from '../../hooks/useMediaQueryCheck';
import { useDispatch, useSelector } from 'react-redux';
import {
    getIsActive,
    getIsLoading,
    getIsCarousel,
    getIsPoster,
    getIsVertical,
    getCurrentIndex,
} from '../../redux/works/works.selector';
import { setDataUrl, setIsLoading, setIsSuccess, setIsPrevent, setIsTextReady } from '../../redux/works/works.action';
import { EmergingImage } from './EmergingImage';
import images from './data';
import PropTypes from 'prop-types';

export function CarouselItem ({
    index,
    width,
    height,
    setActivePlane,
    activePlane,
    item,
    material,
    textReady,
    setTextReady,
}) {
    const $root = useRef();
    const textRef = useRef();
    const isPoster = useSelector(getIsPoster);
    const currentIndex = useSelector(getCurrentIndex);
    const [isAnimation, setIsAnimation] = useState(index === currentIndex && isPoster);
    const [isReady, setIsReady] = useState(false);
    const [isImageShow, setImageShow] = useState(!isPoster);
    const { isMobile } = useMediaQueryCheck(991);
    const { isLaptop } = useMediaQueryLaptopCheck(1500);
    const dispatch = useDispatch();
    const isActive = useSelector(getIsActive);
    const isLoading = useSelector(getIsLoading);
    const isCarousel = useSelector(getIsCarousel);
    const isVertical = useSelector(getIsVertical);

    useEffect(() => {
        if (activePlane === index) {
            setIsAnimation(activePlane === index);
            dispatch(setIsTextReady(false));
            $root.current.visible = true;
            if (!isPoster) {
                setActivePlane(currentIndex);
                gsap.to(textRef.current.material, {
                    opacity: 0,
                    duration: 1,
                });
            }
        } else if (activePlane !== null && activePlane !== index) {
            $root.current.visible = false;
        } else {
            setIsAnimation(false);
            $root.current.visible = true;
        }
    }, [activePlane]);

    useEffect(() => {
        if (isAnimation) {
            gsap.killTweensOf($root.current.position);
            gsap.to($root.current.position, {
                z: isAnimation ? 0 : -0.01,
                duration: 0.2,
                ease: 'power3.out',
                delay: isAnimation ? 0 : 2,
            });
        }
    }, [isAnimation]);

    useEffect(() => {
        if (textRef.current?.material) {
            gsap.to(textRef.current.material, {
                opacity: 0,
                duration: 0,
            });
        }
    }, []);

    useEffect(() => {
        if (textRef.current?.material && !isImageShow && !isPoster) {
            setTimeout(() => {
                gsap.to(textRef.current?.material, {
                    opacity: 1,
                    duration: 1,
                    ease: 'power2.inOut',
                    onComplete: () => {
                        setTimeout(() => {
                            setTextReady(true);
                            dispatch(setIsTextReady(true));
                            dispatch(setIsPrevent(false));
                        }, 200);
                    },
                });
            }, 300);
        }
    }, [isImageShow]);

    useEffect(() => {
        if (textRef.current?.material && isCarousel) {
            // console.log('title show');
            gsap.to(textRef.current?.material, {
                delay: 0.5,
                opacity: 1,
                duration: 1,
                ease: 'power2.inOut',
            });
        }
    }, [isCarousel]);

    useEffect(() => {
        if (isReady && !isLoading) {
            // console.log('isReady');
            dispatch(setIsSuccess(false));
            dispatch(setIsLoading(true));
            dispatch(setDataUrl(images[currentIndex]?.dataUrl));
            window.history.pushState(null, '', item.link);
            setTimeout(() => {
                setIsReady(false);
            }, 500);
        }
    }, [isReady]);

    useEffect(() => {
        if (isActive && currentIndex === index && textReady) {
            // console.log('isActive', 'isReady:', isReady, 'isLoading:', isLoading, 'isPoster:', isPoster);
            setActivePlane(currentIndex);
        }
    }, [isActive]);

    return (
        <group ref={$root} position={isMobile ? [width * (index * 2), 0, 0] : [width * (index * 2), 0, 0]}>
            {isImageShow ? (
                <EmergingImage
                    width={width}
                    height={height}
                    url={item.image}
                    setImageShow={setImageShow}
                    color={images[currentIndex]?.bgColor}
                    type={1}
                />
            ) : (
                <Plane
                    index={index}
                    material={material}
                    width={width}
                    height={height}
                    texture={item.image}
                    active={isAnimation}
                    currentIndex={currentIndex}
                    setIsReady={setIsReady}
                />
            )}
            <Text
                ref={textRef}
                position={[0, 0, 2]}
                fontSize={
                    isMobile && currentIndex === 0 ? 0.3 : isMobile ? 0.42 : isLaptop ? 0.8 : isVertical ? 1.2 : 1
                }
                color={images[currentIndex]?.bgColor}
                outlineWidth={0.01}
                outlineColor='#313131'
                maxWidth={isMobile ? 400 : isLaptop ? 800 : 1500}
                lineHeight={isMobile ? 2.2 : isLaptop ? 1.6 : 1.8}
                letterSpacing={
                    isMobile ? 0.2 : isLaptop && currentIndex === 0 ? 0.25 : isLaptop || currentIndex === 0 ? 0.4 : 0.5
                }
                textAlign={isMobile ? 'left' : 'left'}
                font='/fonts/Montserrat-Bold.woff'
            >
                {item.title}
                <MeshWobbleMaterial factor={0.5} speed={1} />
            </Text>
        </group>
    );
}

CarouselItem.propTypes = {
    index: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    setActivePlane: PropTypes.func,
    activePlane: PropTypes.number,
    item: PropTypes.object,
    material: PropTypes.object,
    apiUrl: PropTypes.string,
    textReady: PropTypes.bool,
    setTextReady: PropTypes.func,
};
