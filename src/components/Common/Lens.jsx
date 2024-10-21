import * as THREE from 'three';
import { React, useRef, useState } from 'react';
import { createPortal, useFrame, useThree } from '@react-three/fiber';
import { useFBO, useGLTF, MeshTransmissionMaterial } from '@react-three/drei';
import { easing } from 'maath';
import PropTypes from 'prop-types';

export function Lens ({ children, damping = 0.14, scale = 0.12, ...props }) {
    const ref = useRef();
    const { nodes } = useGLTF('/glb/lens-transformed2.glb');
    const buffer = useFBO();
    const viewport = useThree(state => state.viewport);
    const [scene] = useState(() => new THREE.Scene());
    const time = useRef(0);

    useFrame((state, delta) => {
        const viewport = state.viewport.getCurrentViewport(state.camera, [0, 0, 1]);
        time.current += delta;

        easing.damp3(
            ref.current.position,
            [(state.pointer.x * viewport.width) / 2, (state.pointer.y * viewport.height) / 2, 1],
            damping,
            delta
        );

        ref.current.rotation.x = Math.sin(time.current * 0.7) * Math.PI * 0.3;
        ref.current.rotation.y = Math.cos(time.current * 0.6) * Math.PI * 0.3;
        ref.current.rotation.z = Math.sin(time.current * 0.5) * Math.PI * 0.3;
        ref.current.position.z = Math.sin(time.current * 0.1) * 0.1;
        const scaleVariation =
            Math.min(viewport.width, viewport.height) * scale * (1 + Math.sin(time.current * 0.5) * 0.1);
        ref.current.scale.set(scaleVariation, scaleVariation, scaleVariation);

        state.gl.setRenderTarget(buffer);
        state.gl.setClearColor('#ecedef');
        state.gl.render(scene, state.camera);
        state.gl.setRenderTarget(null);
    });

    return (
        <>
            {createPortal(children, scene)}
            <mesh scale={[viewport.width, viewport.height, 1]}>
                <planeGeometry />
                <meshBasicMaterial map={buffer.texture} />
            </mesh>
            <mesh
                scale={Math.min(viewport.width, viewport.height) * scale}
                ref={ref}
                geometry={nodes.Cylinder.geometry}
                {...props}
            >
                <MeshTransmissionMaterial
                    buffer={buffer.texture}
                    ior={1.14}
                    thickness={1}
                    anisotropy={0.14}
                    chromaticAberration={0.14}
                    distortion={0.14}
                    distortionScale={1.4}
                    temporalDistortion={0.14}
                />
            </mesh>
        </>
    );
}

Lens.propTypes = {
    children: PropTypes.any,
    damping: PropTypes.number,
    scale: PropTypes.string,
};

useGLTF.preload('/glb/lens-transformed2.glb');
