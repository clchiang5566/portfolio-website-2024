import React, { useEffect, useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import PropTypes from 'prop-types';
import gsap from 'gsap';
import { useMediaQueryCheck } from '../../hooks/useMediaQueryCheck';

export function Model ({ url, texturePath }) {
    const [scene, setScene] = useState();
    const clonedScene = useRef(null);
    const time = useRef(0);
    const group = useRef();
    const { isMobile } = useMediaQueryCheck(991);
    const scale = isMobile ? 0.004 : 0.005;

    useEffect(() => {
        const loader = new GLTFLoader();
        loader.load(url, gltf => {
            const loadedScene = gltf.scene;
            clonedScene.current = loadedScene.clone();
            setScene(loadedScene);
            loadedScene.traverse(child => {
                if (child.isMesh) {
                    child.material.transparent = true;
                    child.material.opacity = 0;
                }
            });
            if (loadedScene.children) {
                gsap.to(loadedScene.children, {
                    opacity: 1,
                    duration: 2,
                    delay: 0.5,
                    onUpdate: function () {
                        loadedScene.traverse(child => {
                            if (child.isMesh) {
                                child.material.opacity = this.targets()[0].opacity;
                            }
                        });
                    },
                });
            }
        });
    }, [url]);

    useEffect(() => {
        const loader = new THREE.TextureLoader();
        loader.load(texturePath, texture => {
            if (texture && scene) {
                scene.traverse(child => {
                    if (child.isMesh) {
                        const oldTexture = child.material.map;
                        if (oldTexture) {
                            oldTexture.image = texture.image;
                            oldTexture.needsUpdate = true;
                        } else {
                            child.material.map = texture;
                            child.material.needsUpdate = true;
                        }
                    }
                });
            }
        });
    }, [texturePath, scene]);

    useFrame((state, delta) => {
        if (group.current) {
            group.current.rotation.y += isMobile ? 0.02 : 0.05;
            time.current += delta;
            group.current.rotation.z = Math.sin(time.current * 2) * 0.15;
        }
    });

    if (!scene) return null;

    return (
        <group ref={group} position={[0, isMobile ? 2 : 2.2, 4]}>
            <primitive
                object={scene}
                scale={[scale, scale, scale]}
                position={[isMobile ? -0.55 : -0.7, 0, isMobile ? -0.7 : -0.9]}
                rotation={[0, Math.PI / 2, 0]}
            />
            <primitive
                object={clonedScene.current}
                scale={[scale, scale, scale]}
                position={[isMobile ? 0.55 : 0.7, 0, isMobile ? 0.7 : 0.9]}
                rotation={[0, -Math.PI / 2, 0]}
            />
        </group>
    );
}

Model.propTypes = {
    url: PropTypes.string.isRequired,
    texturePath: PropTypes.string.isRequired,
};
