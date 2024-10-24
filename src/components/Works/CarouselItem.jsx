import { React, useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { Plane } from './Plane';
import { Text, MeshWobbleMaterial } from '@react-three/drei';
import { useMediaQueryCheck } from '../../hooks/useMediaQueryCheck';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { addWorks } from '../../redux/works/works.action';
import { EmergingImage } from './EmergingImage';
import PropTypes from 'prop-types';

export function CarouselItem ({
    index,
    width,
    height,
    setActivePlane,
    activePlane,
    activeIndex,
    item,
    isBack,
    material,
    color,
    setTextReady,
    setTextShow
}) {
    const $root = useRef();
    const textRef = useRef();
    const [isActive, setIsActive] = useState(index === activeIndex && isBack);
    const [isReady, setIsReady] = useState(false);
    const [isImageShow, setImageShow] = useState(!isBack);
    const dispatch = useDispatch();
    const { isMobile } = useMediaQueryCheck(991);
    const router = useRouter();
    const materialRef = useRef();

    useEffect(() => {
        if (activePlane === index) {
            setIsActive(activePlane === index);
            $root.current.visible = true;
            if (!isBack) {
                setActivePlane(activeIndex);
                dispatch(addWorks(activeIndex, false));
                gsap.to(textRef.current.material, {
                    opacity: 0,
                    duration: 1,
                });
            }
        } else if (activePlane !== null && activePlane !== index) {
            $root.current.visible = false;
        } else {
            setIsActive(null);
            $root.current.visible = true;
        }
    }, [activePlane]);

    useEffect(() => {
        gsap.killTweensOf($root.current.position);
        gsap.to($root.current.position, {
            z: isActive ? 0 : -0.01,
            duration: 0.2,
            ease: 'power3.out',
            delay: isActive ? 0 : 2,
        });
    }, [isActive]);

    useEffect(() => {
        gsap.to(textRef.current.material, {
            opacity: 0,
            duration: 0,
        });
        setTimeout(
            () => {
                if (textRef.current) {
                    gsap.to(textRef.current.material, {
                        opacity: 1,
                        duration: 1,
                        ease: 'power2.inOut',
                        onComplete: () => {
                            setTextReady(true)
                            setTimeout(() => {
                                setTextShow(true)
                            }, 300);
                        }
                    });
                }
            },
            1500
        );
    }, []);

    useEffect(() => {
        if (isReady) {
            router.push(item.link);
        }
    }, [isReady]);

    useFrame((state, delta) => {
        if (materialRef.current) {
            materialRef.current.time += delta * 0.5;
        }
    });

    return (
        <group
            ref={$root}
            onClick={() => {
                setActivePlane(index);
            }}
            position={isMobile ? [width * (index * 1.5), 0.5, 0] : [width * (index * 2), 0, 0]}
        >
            {isImageShow ? (
                <EmergingImage
                    width={width}
                    height={height}
                    url={item.image}
                    setImageShow={setImageShow}
                    color={color}
                    type={1}
                />
            ) : (
                <Plane
                    index={index}
                    material={material}
                    width={width}
                    height={height}
                    texture={item.image}
                    active={isActive}
                    activeIndex={activeIndex}
                    isBack={isBack}
                    setIsReady={setIsReady}
                />
            )}
            <Text
                position={[0, 0, 1]}
                fontSize={isMobile && activeIndex === 1 ? 0.04 : isMobile ? 0.06 : 0.13}
                color={color}
                outlineWidth={0.001}
                outlineColor='#313131'
                maxWidth={isMobile ? 400 : 800}
                lineHeight={isMobile ? 2.6 : 1.6}
                letterSpacing={0.22}
                textAlign={isMobile ? 'left' : 'left'}
                font='/fonts/Montserrat-Bold.woff'
                ref={textRef}
            >
                {item.title}
                <MeshWobbleMaterial factor={0.8} speed={1} />
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
    activeIndex: PropTypes.number,
    item: PropTypes.object,
    isBack: PropTypes.bool,
    material: PropTypes.object,
    color: PropTypes.string,
    setTextReady: PropTypes.number,
    setTextShow: PropTypes.number
};
