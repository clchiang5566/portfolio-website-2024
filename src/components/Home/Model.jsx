import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Float, Html } from '@react-three/drei';
import { useMediaQueryCheck } from '../../hooks/useMediaQueryCheck';
import * as THREE from 'three';
import PropTypes from 'prop-types';
import gsap from 'gsap';

export function Model ({
    url,
    position,
    index,
    scale,
    isFloating,
    isTwist,
    twistAmount,
    twistTime,
    scrollState,
    text,
    htmlPosition,
}) {
    const group = useRef();
    const [scene, setScene] = useState();
    const [defindMaterial, setDefindMaterial] = useState();
    const [mixer, setMixer] = useState();
    const [rotationIntensity, setRotationIntensity] = useState(1.5);
    const { gl } = useThree();
    const htmlPortal = useRef(gl.domElement.parentNode);
    const htmlRef = useRef();
    const { isMobile } = useMediaQueryCheck(991);

    useEffect(() => {
        const loader = new GLTFLoader();
        let isMounted = true;

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

            if (isMounted) {
                setScene(loadedScene);
                setMixer(newMixer);
            }

            loadedScene.traverse(child => {
                if (child.isMesh) {
                    const originalMaterial = child.material;
                    setDefindMaterial(originalMaterial);
                    child.material = isTwist ? buildTwistMaterial : originalMaterial;
                    child.material.transparent = true;
                    child.material.opacity = 0;
                    gsap.to(child.material, {
                        opacity: 1,
                        duration: 0.5,
                        delay: 1 + index * 0.2,
                        ease: 'power2.inOut',
                        onComplete: () => {
                            gsap.to(htmlRef.current, {
                                opacity: 1,
                                duration: 1,
                            });
                        },
                    });
                }
            });
        });
        return () => {
            isMounted = false;
            loader.manager.itemEnd(url);
        };
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
        if (group.current) group.current.rotation.z = scrollState.progress * (Math.PI * 2);
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
            <Float speed={5} floatIntensity={6} rotationIntensity={rotationIntensity}>
                <primitive object={scene} scale={scale} />
                <Html portal={htmlPortal} transform position={htmlPosition} rotation={[0, 0, 0]} scale={0.5} occlude>
                    <div
                        className={index === 0 || index === 2 ? 'dialog-right' : 'dialog-left'}
                        ref={htmlRef}
                        style={{
                            fontSize: isMobile ? '10px' : '13px',
                            opacity: '0',
                        }}
                    >
                        {text}
                    </div>
                </Html>
            </Float>
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
    text: PropTypes.string,
    htmlPosition: PropTypes.array,
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
