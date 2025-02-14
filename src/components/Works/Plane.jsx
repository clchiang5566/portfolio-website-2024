import { React, useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { useTexture, Image as DreiImage } from '@react-three/drei';
import { useMediaQueryCheck } from '../../hooks/useMediaQueryCheck';
import PropTypes from 'prop-types';
import gsap from 'gsap';
import { useSelector } from 'react-redux';
import { getCurrentIndex, getIsPoster, getIsHover, getIsVertical } from '../../redux/works/works.selector';

export function Plane ({ index, material, texture, width, height, active, setIsReady, ...props }) {
    const { viewport } = useThree();
    const tex = useTexture(texture);
    const currentIndex = useSelector(getCurrentIndex);
    const isPoster = useSelector(getIsPoster);
    const isHover = useSelector(getIsHover);
    const isVertical = useSelector(getIsVertical);
    const { isMobile } = useMediaQueryCheck(991);

    useEffect(() => {
        if (material.current[index].material && index === currentIndex) {
            material.current[index].material.uniforms.uZoomScale.value.x = isMobile
                ? viewport.width / 1.08 / width
                : (viewport.width / 2 / width) * 1.12;
            material.current[index].material.uniforms.uZoomScale.value.y = isMobile
                ? viewport.height / 1.6 / height
                : (viewport.height / height) * 1.12;
            gsap.to(material.current[index].material.uniforms.uProgress, {
                value: active ? 1 : 0,
                duration: isPoster ? 0 : 2.5,
                onComplete: () => {
                    // console.log('isAnimation', 'active:', active, 'isPoster:', isPoster);
                    if (active && !isPoster) setIsReady(true);
                },
            });
            gsap.to(material.current[index].material.uniforms.uRes.value, {
                x:
                    active && isMobile
                        ? viewport.width / 1.1
                        : active && !isMobile
                        ? (viewport.width / 2) * 1.11
                        : width,
                y: active && isMobile ? viewport.height / 1.5 : active && !isMobile ? viewport.height * 1.11 : height,
                duration: isPoster ? 0 : 1,
            });
            gsap.to(material.current[currentIndex].material.uniforms.distort, {
                value: 1,
                duration: 0.4,
                overwrite: true,
            });
            // if (active || isPoster) {
            //     material.current[index].material.uniforms.isActive.value = 1;
            // } else {
            //     material.current[index].material.uniforms.isActive.value = 0;
            // }
        }
    }, [active]);

    useEffect(() => {
        if (isVertical) {
            material.current[index].material.uniforms.isVertical.value = 1;
        } else {
            material.current[index].material.uniforms.isVertical.value = 0;
        }
    }, [isVertical]);

    const shaderArgs = useMemo(
        () => ({
            uniforms: {
                uProgress: { value: 0 },
                uZoomScale: { value: { x: 1, y: 1 } },
                uTex: { value: tex },
                uRes: {
                    value: {
                        x: active && isMobile ? viewport.width / 1.1 : active && !isMobile ? viewport.width / 2 : width,
                        y: active && isMobile ? viewport.height / 1.5 : active && !isMobile ? viewport.height : height,
                    },
                },
                uImageRes: {
                    value: { x: tex.source.data.width, y: tex.source.data.height },
                },
                time: { value: 0 },
                distort: { value: 0.8 },
                shift: { value: 0 },
                isActive: { value: 0 },
                isVertical: { value: isVertical },
            },
            vertexShader: /* glsl */ `
                varying vec2 vUv;
                varying float vDistort;
                uniform float uProgress;
                uniform vec2 uZoomScale;
                uniform float shift;
                uniform float time;
                uniform float distort;
                uniform float isActive;
                uniform float isVertical;
            
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

                pos.y += (1.0 - isActive) * (sin(uv.x * 3.14159) * shift * 3.0) * 0.125;
                pos.x += (1.0 - isVertical) * (1.0 - isActive) * -(sin(uv.y * 3.14159) * shift * 3.0) * 0.125;

                pos.x *= mix(1., uZoomScale.x + wave * c, uProgress);
                pos.y *= mix(1., uZoomScale.y + wave * c, uProgress);
            
                gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
                }
            `,
            fragmentShader: /* glsl */ `
                uniform sampler2D uTex;
                uniform vec2 uRes;
                uniform vec2 uZoomScale;
                uniform vec2 uImageRes;

                /*------------------------------
                Background Cover UV
                --------------------------------
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
                    vec2 uv = CoverUV(vUv, uRes, uImageRes);
                    vec3 tex = texture2D(uTex, uv).rgb;
                    gl_FragColor = vec4( tex, 1.0 );
                }
            `,
        }),
        [tex]
    );

    useEffect(() => {
        if (material.current[currentIndex].material) {
            if (isHover) {
                gsap.to(material.current[currentIndex].material.uniforms.distort, {
                    value: isMobile ? 1.5 : 3.5,
                    duration: 0.4,
                    overwrite: true,
                });
            } else {
                gsap.to(material.current[currentIndex].material.uniforms.distort, {
                    value: 0.8,
                    duration: 0.4,
                    overwrite: true,
                });
            }
        }
    }, [isHover]);

    return (
        <DreiImage
            ref={node => {
                material.current[index] = node;
            }}
            texture={tex}
            renderOrder={-1}
            position={[0, 0, -1.5]}
            transparent
            {...props}
        >
            <planeGeometry args={[width, height, 30, 30]} transparent />
            <shaderMaterial args={[shaderArgs]} transparent />
        </DreiImage>
    );
}

Plane.propTypes = {
    texture: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    active: PropTypes.bool,
    index: PropTypes.number,
    material: PropTypes.object,
    setIsReady: PropTypes.func,
};
