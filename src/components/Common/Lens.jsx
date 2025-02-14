import * as THREE from 'three';
import { React, useState } from 'react';
import { createPortal, useFrame, useThree } from '@react-three/fiber';
import { useFBO } from '@react-three/drei';
// import { easing } from 'maath';
import PropTypes from 'prop-types';

export function Lens ({ children, damping = 0.14, scale = 0.12, ...props }) {
    // const ref = useRef();
    // const { nodes } = useGLTF('/models/lens-transformed2.glb');
    const buffer = useFBO();
    const viewport = useThree(state => state.viewport);
    const [scene] = useState(() => new THREE.Scene());
    // const time = useRef(0);

    useFrame((state, delta) => {
        // const viewport = state.viewport.getCurrentViewport(state.camera, [0, 0, 1]);
        // time.current += delta;

        // easing.damp3(
        //     ref.current.position,
        //     [(state.pointer.x * viewport.width) / 2, (state.pointer.y * viewport.height) / 2, 1],
        //     damping,
        //     delta
        // );

        // ref.current.rotation.x = Math.sin(time.current * 0.7) * Math.PI * 0.3;
        // ref.current.rotation.y = Math.cos(time.current * 0.6) * Math.PI * 0.3;
        // ref.current.rotation.z = Math.sin(time.current * 0.5) * Math.PI * 0.3;
        // ref.current.position.z = Math.sin(time.current * 0.1) * 0.1;

        // const scaleVariation =
        //     Math.min(viewport.width, viewport.height) * scale * (1 + Math.sin(time.current * 0.5) * 0.1);
        // ref.current.scale.set(scaleVariation, scaleVariation, scaleVariation);

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
        </>
    );
}

Lens.propTypes = {
    children: PropTypes.any,
    damping: PropTypes.number,
    scale: PropTypes.string,
};

// useGLTF.preload('/models/lens-transformed2.glb');
