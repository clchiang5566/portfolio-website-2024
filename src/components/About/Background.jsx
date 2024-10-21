import React, { useRef } from 'react';
import { useFrame, useThree, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import glsl from 'babel-plugin-glsl/macro';
import { lightenHex } from '../../utils/common';

const WaveMaterial = shaderMaterial(
    {
        time: 0,
        colorStart: new THREE.Color('blue'),
        colorEnd: new THREE.Color('blue'),
    },
    glsl`
      varying vec2 vUv;
      void main() {
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectionPosition = projectionMatrix * viewPosition;
        gl_Position = projectionPosition;
        vUv = uv;
      }`,
    glsl`
      #pragma glslify: cnoise3 = require(glsl-noise/classic/3d.glsl) 
      uniform float time;
      uniform vec3 colorStart;
      uniform vec3 colorEnd;
      varying vec2 vUv;
      void main() {
        vec2 displacedUv = vUv + cnoise3(vec3(vUv * 1.0, time * 0.05));
        float strength = cnoise3(vec3(displacedUv * 20.0, time * 0.2));
        float outerGlow = distance(vUv, vec2(0.5)) * 2.0 - 0.5;
        strength += outerGlow;
        strength += step(-0.2, strength) * 0.6;
        strength = clamp(strength, 0.0, 1.0);
        vec3 color = mix(colorStart, colorEnd, strength);
        gl_FragColor = vec4(color, 1.0);
        #include <tonemapping_fragment>
        #include <encodings_fragment>
      }`
);

extend({ WaveMaterial });

export function Background () {
    const ref = useRef();
    const group = useRef();
    const { width, height } = useThree(state => state.viewport);

    useFrame((state, delta) => {
        ref.current.time += delta;
    });

    return (
        <group ref={group}>
            <mesh position={[0, 0, -10]}>
                <planeGeometry args={[width * 1.5, height * 6]} renderOrder={-3} />
                <waveMaterial ref={ref} colorStart='white' colorEnd={lightenHex('#ffff4f', 30)} />
            </mesh>
        </group>
    );
}
