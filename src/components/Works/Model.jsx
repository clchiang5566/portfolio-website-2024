import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Float, Html } from '@react-three/drei';
import PropTypes from 'prop-types';
import gsap from 'gsap';
import * as THREE from 'three';
import { useMediaQueryCheck } from '../../hooks/useMediaQueryCheck';

export function Model ({ texturePath, color }) {
    const group = useRef();
    const { scene, animations } = useGLTF('/models/down/scene.gltf');
    const { viewport, gl } = useThree();
    const htmlPortal = useRef(gl.domElement.parentNode);
    const mixer = useRef();
    const htmlRef = useRef();
    const [isShow, setIsShow] = useState(false);
    const [newTexture, setNewTexture] = useState(null);
    const { isMobile } = useMediaQueryCheck(991);

    useEffect(() => {
        if (texturePath) {
            const loader = new THREE.TextureLoader();
            loader.load(texturePath, texture => {
                setNewTexture(texture);
            });
        }
    }, [texturePath]);

    useEffect(() => {
        const box = new THREE.Box3().setFromObject(scene);
        const center = new THREE.Vector3();
        const materials = [];
        box.getCenter(center);
        scene.position.sub(center);

        if (animations && animations.length > 0) {
            mixer.current = new THREE.AnimationMixer(scene);
            animations.forEach(clip => {
                const action = mixer.current.clipAction(clip);
                action.play();
                action.timeScale = 0.5;
            });
        }

        if (isShow === false) {
            setIsShow(true);
            scene.traverse(child => {
                if (child.isMesh && child.material) {
                    child.material.transparent = true;
                    child.material.opacity = 0;
                    materials.push(child.material);
                    gsap.to(child.material, {
                        delay: 2.5,
                        opacity: 1,
                        duration: 1,
                        onComplete: () => {
                            scene.traverse(child => {
                                if (child.isMesh && child.material) {
                                    child.material.transparent = false;
                                }
                            });
                            gsap.to(htmlRef.current, {
                                opacity: 1,
                                duration: 1,
                            });
                        },
                    });
                }
            });
        }

        if (group.current) {
            const box = new THREE.Box3().setFromObject(group.current);
            const center = box.getCenter(new THREE.Vector3());
            group.current.position.sub(center);
        }
    }, [scene, animations]);

    useEffect(() => {
        if (newTexture) {
            scene.traverse(child => {
                if (child.isMesh && child.material.map.name === 'Material_body') {
                    const oldTexture = child.material.map;
                    if (oldTexture) {
                        oldTexture.image = newTexture.image;
                        oldTexture.needsUpdate = true;
                    } else {
                        child.material.map = newTexture;
                        child.material.needsUpdate = true;
                    }
                }
            });
        }
    }, [newTexture, scene]);

    useEffect(() => {
        if (group.current) {
            const scale = isMobile ? viewport.height * 0.18 : viewport.height * 0.4;
            group.current.scale.set(scale, scale, scale);

            const position = isMobile
                ? [viewport.width / 2 - scale - scale / 10, -viewport.height / 2 + scale, 0]
                : [viewport.width / 2 - scale - scale / 10, -viewport.height / 2 + scale / 2, 0];
            group.current.position.set(...position);
        }
    }, [isMobile, viewport.width, viewport.height]);

    useFrame((state, delta) => {
        if (mixer.current) {
            mixer.current.update(delta);
        }
        if (group.current) {
            group.current.rotation.y += 0.01;
        }
    });

    return (
        <group ref={group}>
            <Float speed={6}>
                <primitive object={scene} scale={0.004} />
                <Html
                    portal={htmlPortal}
                    transform
                    position={[0, isMobile ? 0.5 : 0.3, 0]}
                    rotation={[0, 0, 0]}
                    scale={isMobile ? 0.2 : 0.15}
                    occlude
                >
                    <div
                        ref={htmlRef}
                        className='dialog'
                        style={{
                            background: color,
                            fontSize: '13px',
                            opacity: '0',
                        }}
                    >
                        ZZZzz..
                        <span
                            style={{
                                borderColor: color,
                            }}
                        />
                    </div>
                </Html>
            </Float>
        </group>
    );
}

Model.propTypes = {
    color: PropTypes.string,
    texturePath: PropTypes.string,
};
