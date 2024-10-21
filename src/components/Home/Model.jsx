import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Float, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';
import PropTypes from 'prop-types';
import gsap from 'gsap';

export function Model ({ url, position, index, scale, isFloating, isTwist, twistAmount, twistTime }) {
    const group = useRef();
    const [scene, setScene] = useState();
    const [defindMaterial, setDefindMaterial] = useState();
    const [mixer, setMixer] = useState();
    const [rotationIntensity, setRotationIntensity] = useState(1.5);

    useEffect(() => {
        const loader = new GLTFLoader();
        loader.load(url, gltf => {
            const loadedScene = gltf.scene;
            const animations = gltf.animations;

            const newMixer = new THREE.AnimationMixer(loadedScene);
            if (animations.length > 0) {
                const action = newMixer.clipAction(animations[0]);
                action.setLoop(THREE.LoopRepeat);
                action.play();
                action.timeScale = 0.6;
                action.time = 0;
                newMixer.addEventListener('loop', () => {
                    action.time = 0;
                });
            }

            loadedScene.traverse(child => {
                if (child.isMesh) {
                    const originalMaterial = child.material;
                    setDefindMaterial(originalMaterial);
                    child.material = isTwist ? buildTwistMaterial : originalMaterial;
                }
            });

            setScene(loadedScene);
            setMixer(newMixer);

            loadedScene.traverse(child => {
                if (child.isMesh) {
                    child.material.transparent = true;
                    child.material.opacity = 0;
                }
            });

            gsap.to(loadedScene.children, {
                opacity: 1,
                duration: 1.2,
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
        if (scene && isTwist) {
            scene.traverse(child => {
                if (child.isMesh) {
                    child.material = buildTwistMaterial();
                }
            });
        } else if (scene && isTwist === false) {
            scene.traverse(child => {
                if (child.isMesh) {
                    child.material = defindMaterial;
                }
            });
        }
    }, [isTwist]);

    useEffect(() => {
        if (isFloating) {
            gsap.to(
                {},
                {
                    duration: 2,
                    onUpdate: () => {
                        setRotationIntensity(prev => Math.min(prev + 0.1, 10));
                    },
                    ease: 'power2.inOut',
                }
            );
        } else {
            gsap.to(
                {},
                {
                    duration: 2,
                    onUpdate: () => {
                        setRotationIntensity(prev => Math.max(prev - 0.1, 2));
                    },
                    ease: 'power2.inOut',
                }
            );
        }
    }, [isFloating]);

    useFrame((state, delta) => {
        if (mixer) {
            mixer.update(delta);
        }

        if (scene && isTwist) {
            scene.traverse(child => {
                if (child.isMesh && child.material && child.material.userData.shader) {
                    child.material.userData.shader.uniforms.time.value += delta * twistTime;
                    child.material.userData.shader.uniforms.amount.value = twistAmount;
                }
            });
        }
    });

    if (!scene) return null;

    return (
        <group ref={group} position={position}>
            <PresentationControls
                config={{ mass: 5, tension: 1500 }}
                snap={{ mass: 5, tension: 1500 }}
                polar={[-Math.PI / 2, Math.PI / 2]}
                azimuth={[-Infinity, Infinity]}
            >
                <Float speed={3} floatIntensity={10} rotationIntensity={rotationIntensity}>
                    <primitive object={scene} scale={[scale, scale, scale]} />
                </Float>
            </PresentationControls>
        </group>
    );
}

Model.propTypes = {
    url: PropTypes.string.isRequired,
    position: PropTypes.arrayOf(PropTypes.number),
    index: PropTypes.number,
    scale: PropTypes.number,
    isFloating: PropTypes.bool,
    isTwist: PropTypes.bool,
    twistAmount: PropTypes.number,
    twistTime: PropTypes.number,
};

function buildTwistMaterial () {
    const material = new THREE.MeshNormalMaterial();
    material.onBeforeCompile = function (shader) {
        shader.uniforms.time = { value: 0 };
        shader.uniforms.amount = { value: 0 };

        shader.vertexShader = 'uniform float time;\nuniform float amount;\n' + shader.vertexShader;
        shader.vertexShader = shader.vertexShader.replace(
            '#include <begin_vertex>',
            [
                'float theta = sin( time + position.y ) / amount;',
                'float c = cos( theta );',
                'float s = sin( theta );',
                'mat3 m = mat3( c, 0, s, 0, 1, 0, -s, 0, c );',
                'vec3 transformed = vec3( position ) * m;',
                'vNormal = vNormal * m;',
            ].join('\n')
        );

        material.userData.shader = shader;
    };

    // Make sure WebGLRenderer doesn't reuse a single program
    // material.customProgramCacheKey = function () {
    //     return amount.toFixed(1);
    // };

    return material;
}
