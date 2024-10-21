import React, { useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import PropTypes from 'prop-types';
import gsap from 'gsap';
import { useMediaQueryCheck } from '../../hooks/useMediaQueryCheck';

export function Model ({ url, index, isWireframe, color }) {
    const [scene, setScene] = useState();
    const [mixer, setMixer] = useState();
    const { isMobile } = useMediaQueryCheck(991);
    const scale = isMobile ? 0.015 : 0.011;
    const [originalMaterial, setOriginalMaterial] = useState();

    useEffect(() => {
        const loader = new GLTFLoader();
        loader.load(url, gltf => {
            const loadedScene = gltf.scene;
            const animations = gltf.animations;
            const newMixer = new THREE.AnimationMixer(loadedScene);

            if (animations.length > 0) {
                const action = newMixer.clipAction(animations[0]);
                action.setLoop(THREE.LoopPingPong);
                action.play();
                action.timeScale = 0.6;
            }

            loadedScene.traverse(child => {
                if (child.isMesh) {
                    const material = child.material;
                    setOriginalMaterial(material);
                    const wireframeMaterial = new THREE.MeshBasicMaterial({
                        color: new THREE.Color(color),
                        wireframe: true,
                    });
                    child.material = isWireframe ? wireframeMaterial : material;
                }
            });

            loadedScene.traverse(child => {
                if (child.isMesh) {
                    child.material.transparent = true;
                    child.material.opacity = 0;
                }
            });

            setScene(loadedScene);
            setMixer(newMixer);

            gsap.to(loadedScene.children, {
                opacity: 1,
                duration: 2,
                delay: 0.2 + index * 0.3,
                onUpdate: function () {
                    loadedScene.traverse(child => {
                        if (child.isMesh) {
                            child.material.opacity = this.targets()[0].opacity;
                        }
                    });
                },
            });
        });
    }, [url]);

    useEffect(() => {
        if (isWireframe && scene) {
            scene.traverse(child => {
                if (child.isMesh) {
                    const wireframeMaterial = new THREE.MeshBasicMaterial({
                        color: new THREE.Color(color),
                        wireframe: true,
                    });
                    child.material = wireframeMaterial;
                }
            });
        } else if (isWireframe === false && scene) {
            scene.traverse(child => {
                if (child.isMesh) {
                    child.material = originalMaterial;
                }
            });
        }
    }, [isWireframe]);

    useFrame((state, delta) => {
        if (mixer) {
            mixer.update(delta);
        }
    });

    if (!scene) return null;

    return <primitive object={scene} scale={[scale, scale, scale]} />;
}

Model.propTypes = {
    url: PropTypes.string.isRequired,
    index: PropTypes.number,
    isWireframe: PropTypes.bool,
    color: PropTypes.string,
};
