import React, { useRef } from 'react';
import { UseCanvas, useScrollRig, useScrollbar, ScrollScene } from '@14islands/r3f-scroll-rig';
import { useTexture } from '@react-three/drei';
import { useFrame, extend } from '@react-three/fiber';
// import { useMediaQueryCheck } from '../../hooks/useMediaQueryCheck';
import style from './About.module.scss';
import PropTypes from 'prop-types';
import { useMediaQueryCheck } from '../../hooks/useMediaQueryCheck';
import * as THREE from 'three';

class MeshSineMaterial extends THREE.MeshBasicMaterial {
    constructor (parameters = {}) {
        super(parameters);
        this.setValues(parameters);
        this.time = { value: 0 };
    }

    onBeforeCompile (shader) {
        shader.uniforms.time = this.time;
        shader.vertexShader = `
            uniform float time;
            ${shader.vertexShader}
        `;
        shader.vertexShader = shader.vertexShader.replace(
            '#include <begin_vertex>',
            'vec3 transformed = vec3(position.x, position.y + sin(time + uv.x * PI * 4.0) / 4.0, position.z);'
        );
    }
}

extend({ MeshSineMaterial });

function Banner ({ path, repeat, reverse, ...props }) {
    const ref = useRef();
    const texture = useTexture(path);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    const { scroll } = useScrollbar();
    const { isMobile } = useMediaQueryCheck(991);

    useFrame((state, delta) => {
        const speed = scroll.velocity * 0.5 * 0.01;
        const maxSpeed = scroll.velocity * 0.5 * 0.02;
        if (ref.current) {
            if (reverse) {
                ref.current.material.time.value -= Math.min(maxSpeed, Math.max(maxSpeed, speed));
                ref.current.material.map.offset.x -= delta / 4 + Math.min(maxSpeed, Math.max(maxSpeed, speed));
            } else {
                ref.current.material.time.value += Math.min(maxSpeed, Math.max(maxSpeed, speed));
                ref.current.material.map.offset.x += delta / 4 + Math.min(maxSpeed, Math.max(maxSpeed, speed));
            }
        }
    });
    return (
        <mesh ref={ref} {...props} scale={isMobile ? [3, 3, 3] : [4, 4, 4]}>
            <cylinderGeometry args={[1.6, 1.6, 0.15, 128, 16, true]} />
            <meshSineMaterial
                map={texture}
                map-anisotropy={16}
                map-repeat={[repeat, 1]}
                side={THREE.DoubleSide}
                toneMapped={false}
            />
        </mesh>
    );
}

Banner.propTypes = {
    path: PropTypes.string,
    repeat: PropTypes.string,
    reverse: PropTypes.bool,
};

export function Marquee (props) {
    const el = useRef();
    const { hasSmoothScrollbar } = useScrollRig();
    const { isMobile } = useMediaQueryCheck(991);

    return (
        <div className={style.marquee} ref={el} {...props}>
            {hasSmoothScrollbar && (
                <UseCanvas>
                    <ScrollScene track={el}>
                        {props => (
                            <>
                                <Banner
                                    path='/models/text2.png'
                                    repeat='18'
                                    position={[0, isMobile ? 2.5 : 3.5, 0]}
                                    {...props}
                                />
                                <Banner path='/models/text.png' repeat='13' position={[0, 0, 0]} {...props} reverse />
                                <Banner
                                    path='/models/text3.png'
                                    repeat='20'
                                    position={[0, isMobile ? -2.5 : -3.5, 0]}
                                    {...props}
                                />
                            </>
                        )}
                    </ScrollScene>
                </UseCanvas>
            )}
        </div>
    );
}
