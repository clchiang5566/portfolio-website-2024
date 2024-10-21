import React, { useEffect, useRef, Suspense } from 'react';
import { useThree, extend, useFrame } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import { Color } from 'three';
import PropTypes from 'prop-types';
import * as THREE from 'three';
import { lightenHex } from '../../utils/common';

const CustomShaderMaterial = shaderMaterial(
    {
        time: 0,
        speed: 0.1,
        direction: 1.0,
        grainIntensity: 0.5,
        octaves: 3.0,
        lacunarity: 2.0,
        minGain: 0.1,
        maxGain: 1.0,
        bgColor: new THREE.Color('#313131'),
        textureColor: new THREE.Color('#ffffff'),
    },
    // Vertex Shader
    `
    varying vec2 v_texcoord;
    void main() {
    v_texcoord = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    // Fragment Shader
    `
    varying vec2 v_texcoord;
    uniform float time;
    uniform float speed;
    uniform float direction;
    uniform float grainIntensity;
    uniform float octaves;
    uniform float lacunarity;
    uniform float minGain;
    uniform float maxGain;
    uniform vec3 bgColor;
    uniform vec3 textureColor;

    float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(random(i + vec2(0.0, 0.0)),
                    random(i + vec2(1.0, 0.0)), u.x),
                mix(random(i + vec2(0.0, 1.0)),
                    random(i + vec2(1.0, 1.0)), u.x), u.y);
    }

    float fbm(vec2 st, float time) {
        float amplitude = 0.5;
        int octavesValue = int(octaves + (sin(time * speed) * 0.5));
        float lacunarityValue = lacunarity + (sin(time * speed + 1.0) * 0.5);
        float gain = minGain + (sin(time * speed + 2.0) * 0.5 + 0.5) * (maxGain - minGain);

        float value = 0.0;
        for (int i = 0; i < octavesValue; i++) {
            value += amplitude * noise(st);
            st *= lacunarityValue;
            amplitude *= gain;
        }
        return value;
    }

    void main() {
    vec2 uv = v_texcoord;

    float n = fbm(uv * 5.0 + vec2(0.0, time * direction * speed), time);
    vec3 color = (n > 0.5) ? textureColor : bgColor;

    gl_FragColor = vec4(color, 1.0);
    }
  `
);

extend({ CustomShaderMaterial });

function ShaderPlane ({ color, isHome }) {
    const materialRef = useRef();
    const { viewport } = useThree();

    useFrame((state, delta) => {
        materialRef.current.time += delta * 0.5;
    });

    useEffect(() => {
        const resetTimeOnPageChange = () => {
            materialRef.current.time = 0;
        };

        window.addEventListener('focus', resetTimeOnPageChange);

        return () => {
            window.removeEventListener('focus', resetTimeOnPageChange);
        };
    }, []);

    return (
        <mesh position={[0, 0, -3]}>
            <planeGeometry args={[viewport.width * 2, viewport.height * 2]} renderOrder={-3} />
            <customShaderMaterial
                ref={materialRef}
                speed={0.2}
                direction={-1}
                grainIntensity={0}
                octaves={2}
                lacunarity={1}
                minGain={0.9} // 0.1
                maxGain={1} // 1
                bgColor={isHome ? 'blue' : lightenHex(color, 40)} // #103dad
                textureColor={isHome ? '#57f6b4' : lightenHex(color, 20)}
            />
        </mesh>
    );
}
// octaves={3.5}
// lacunarity={4}
// octaves={2}
// lacunarity={1}

ShaderPlane.propTypes = {
    color: PropTypes.string,
    isHome: PropTypes.bool,
};

export function WebGLBackground ({ color, isStop, isHome }) {
    const { scene } = useThree();

    useEffect(() => {
        scene.background = new Color(color);
    }, [scene, color]);

    return <Suspense>{isStop !== true && <ShaderPlane color={color} isHome={isHome} />}</Suspense>;
}

WebGLBackground.propTypes = {
    color: PropTypes.string,
    isStop: PropTypes.bool,
    isHome: PropTypes.bool,
};
