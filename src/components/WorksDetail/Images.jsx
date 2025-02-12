/* eslint-env browser */
import React, { useRef, useState, useMemo, useEffect, Suspense } from 'react';
import { UseCanvas, useScrollRig, useImageAsTexture, ScrollScene } from '@14islands/r3f-scroll-rig';
import { Image as DreiImage } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { lerp } from '../../utils/common';
import gsap from 'gsap';
import PropTypes from 'prop-types';
// import Image from 'next/image';
import { EffectImage } from './EffectImage';
import { useMediaQueryCheck } from '../../hooks/useMediaQueryCheck';

export function Images ({ src, color }) {
    const el = useRef();
    const img = useRef();
    const { hasSmoothScrollbar } = useScrollRig();

    return (
        <>
            <div ref={el}>
                <img className='imageHidden' ref={img} src={src} alt='image' />
            </div>

            {hasSmoothScrollbar && (
                <UseCanvas debug={false}>
                    <ScrollScene track={el}>
                        {props => (
                            <Suspense fallback=''>
                                <WebglImage el={el} img={img} src={src} color={color} {...props} />
                            </Suspense>
                        )}
                    </ScrollScene>
                </UseCanvas>
            )}
        </>
    );
}

Images.propTypes = {
    src: PropTypes.string,
    color: PropTypes.string,
};

function WebglImage ({ el, img, src, color, scrollState, ...props }) {
    const [imageShow, setImageShow] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [elementSize, setElementSize] = useState([0, 0]);
    const { viewport, size } = useThree();
    const pxToUnits = px => (px / size.width) * viewport.width;

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    setIsVisible(entry.isIntersecting);
                });
            },
            { threshold: 0.1 }
        );

        if (el.current) {
            observer.observe(el.current);
        }

        return () => {
            if (el.current) {
                observer.unobserve(el.current);
            }
        };
    }, []);

    useEffect(() => {
        if (img.current) {
            const width = pxToUnits(img.current?.offsetWidth);
            const height = pxToUnits(img.current?.offsetHeight);
            setElementSize([width, height]);
        }
    }, [viewport]);

    return (
        <>
            {isVisible && imageShow && (
                <EffectImage
                    width={elementSize[0]}
                    height={elementSize[1]}
                    url={src}
                    setImageShow={setImageShow}
                    color={color}
                    type={1}
                    {...props}
                />
            )}
            {imageShow === false && <CustomImage imgRef={img} url={src} scrollState={scrollState} {...props} />}
        </>
    );
}

WebglImage.propTypes = {
    el: PropTypes.any,
    img: PropTypes.any,
    src: PropTypes.string,
    scrollState: PropTypes.object,
    color: PropTypes.string,
};

function CustomImage ({ imgRef, url, scrollState, ...props }) {
    const ref = useRef();
    const $mesh = useRef();
    const tex = useImageAsTexture(imgRef);
    const { viewport } = useThree();
    const [scrollSpeed, setScrollSpeed] = useState(0);
    const { isMobile } = useMediaQueryCheck(991);
    const distort = 0.5;

    const gcd = (a, b) => {
        return b === 0 ? a : gcd(b, a % b);
    };

    const getAspectRatio = (width, height) => {
        const divisor = gcd(width, height);
        return {
            widthRatio: width / divisor,
            heightRatio: height / divisor,
        };
    };

    useEffect(() => {
        let lastScrollY = window.scrollY;
        let lastTimestamp = performance.now();

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const currentTimestamp = performance.now();

            const deltaY = currentScrollY - lastScrollY;
            const deltaTime = currentTimestamp - lastTimestamp;

            if (deltaTime > 0) {
                const speed = deltaY / deltaTime;
                setScrollSpeed(speed);
            }

            lastScrollY = currentScrollY;
            lastTimestamp = currentTimestamp;
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const aspectRatio = getAspectRatio(tex.source.data.width, tex.source.data.height);
        if ($mesh.current) {
            $mesh.current.uniforms.uZoomScale.value.x = 1;
            $mesh.current.uniforms.uZoomScale.value.y = 1;
            gsap.to($mesh.current.uniforms.uRes.value, {
                x: aspectRatio.widthRatio,
                y: aspectRatio.heightRatio,
                duration: 0,
            });
        }
    }, [viewport]);

    useFrame((state, delta) => {
        if ($mesh.current) {
            $mesh.current.uniforms.time.value += delta * 0.5;
            $mesh.current.uniforms.shift.value = lerp(
                $mesh.current.uniforms.shift.value,
                scrollSpeed,
                isMobile ? 0.015 : 0.01
            );
        }
    });

    const shaderArgs = useMemo(
        () => ({
            uniforms: {
                uProgress: { value: 0 },
                uZoomScale: { value: { x: 1, y: 1 } },
                uTex: { value: tex },
                uRes: { value: { x: 1, y: 1 } },
                uImageRes: {
                    value: { x: tex.source.data.width, y: tex.source.data.height },
                },
                time: { value: 0 },
                distort: { value: distort },
                scale: { value: 0.1 },
                shift: { value: 0 },
                uPixelSize: { value: 30 },
                zoom: { value: 1 },
            },
            vertexShader: /* glsl */ `
        varying vec2 vUv;
        varying float vDistort;
        uniform float uProgress;
        uniform vec2 uZoomScale;
        uniform float scale;
        uniform float shift;
        uniform float time;
        uniform float distort;
    
        // Perlin noise function
        float rand(vec2 co){
            return fract(sin(dot(co.xy,vec2(12.9898,78.233))) * 43758.5453);
        }

        float noise(vec2 p){
            vec2 ip = floor(p);
            vec2 u = fract(p);
            u = u*u*(3.0-2.0*u);

            float res = mix(
                mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
                mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
            return res*res;
        }

        void main() {
          vUv = uv;
          // vDistort = (position.y * 10.0 + time) * distort;
          vDistort = noise(position.xy * 0.5 + vec2(time)) * distort;
          
          vec3 pos = position + normal * vDistort;
          // vec3 transformed = position + normal * vDistort;

          float angle = uProgress * 3.14159265 / 2.;
          float wave = cos(angle);
          float c = sin(length(uv - .5) * 15. + uProgress * 12.) * .5 + .5;
          pos.y = pos.y + ((sin(uv.x * 3.1415926535897932384626433832795) * shift * 1.0) * 0.125);
          pos.x *= mix(1., uZoomScale.x + wave * c, uProgress);
          pos.y *= mix(1., uZoomScale.y + wave * c, uProgress);
    
          gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
        }
      `,
            fragmentShader: /* glsl */ `
        uniform sampler2D uTex;
        uniform vec2 uRes;
        uniform vec2 uImageRes;
        uniform float uPixelSize;
        uniform float zoom;

        /*------------------------------
        u = basic UV
        s = screensize
        i = image size
        ------------------------------*/
        vec2 CoverUV(vec2 u, vec2 s, vec2 i) {
        float rs = s.x / s.y; // Aspect screen size
        float ri = i.x / i.y; // Aspect image size
        vec2 st = rs < ri ? vec2(i.x * s.y / i.y, s.y) : vec2(s.x, i.y * s.x / i.x); // New st
        vec2 o = (rs < ri ? vec2((st.x - s.x) / 2.0, 0.0) : vec2(0.0, (st.y - s.y) / 2.0)) / st; // Offset
        return u * s / st + o;
        }

        varying vec2 vUv;
        void main() {
          vec2 centeredUv = (vUv - 0.5) / zoom + 0.5;
          // vec2 pixelatedUv = round(centeredUv * uPixelSize) / uPixelSize;
          vec2 uv = CoverUV(centeredUv, uRes, uImageRes);
          vec3 tex = texture2D(uTex, uv).rgb;
          gl_FragColor = vec4( tex, 1.0 );
        }
      `,
        }),
        [tex]
    );

    return (
        <DreiImage ref={ref} texture={tex} {...props} renderOrder={-1} position={[0, 0, 0]} transparent>
            <planeGeometry args={[1, 1, 128, 128]} />
            <shaderMaterial ref={$mesh} attach='material' transparent args={[shaderArgs]} />
        </DreiImage>
    );
}

CustomImage.propTypes = {
    imgRef: PropTypes.any,
    url: PropTypes.string,
    scrollState: PropTypes.object,
};
