import React, { useState, useEffect, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import * as THREE from 'three';
import useScreenSize from './useScreenSize';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import PropTypes from 'prop-types';

const EmergeMaterial = shaderMaterial(
    {
        uEffectTime: 0,
        uFillColor: new THREE.Color('#f60'),
        uEffectProgress: 0,
        uType: 1,
        uTexture: null,
        uTextureSize: null,
        uElementSize: null,
    },
    // vertex shader
    `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    // fragment shader
    `
        uniform float uEffectTime;
        uniform vec3 uFillColor;
        uniform float uEffectProgress;
        uniform float uType;
        uniform vec2 uTextureSize;
        uniform vec2 uElementSize;
        uniform sampler2D uTexture;
        varying vec2 vUv;

        float hashwithoutsine12(vec2 p){
          vec3 p3  = fract(vec3(p.xyx) * .1031);
            p3 += dot(p3, p3.yzx + 33.33);
            return fract((p3.x + p3.y) * p3.z);
        }
  
        // Classic Perlin 2D Noise 
        vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}
        vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
        vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
        vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}
        float cnoise(vec2 P){
          vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
          vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
          Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
          vec4 ix = Pi.xzxz;
          vec4 iy = Pi.yyww;
          vec4 fx = Pf.xzxz;
          vec4 fy = Pf.yyww;
          vec4 i = permute(permute(ix) + iy);
          vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
          vec4 gy = abs(gx) - 0.5;
          vec4 tx = floor(gx + 0.5);
          gx = gx - tx;
          vec2 g00 = vec2(gx.x,gy.x);
          vec2 g10 = vec2(gx.y,gy.y);
          vec2 g01 = vec2(gx.z,gy.z);
          vec2 g11 = vec2(gx.w,gy.w);
          vec4 norm = 1.79284291400159 - 0.85373472095314 * 
            vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
          g00 *= norm.x;
          g01 *= norm.y;
          g10 *= norm.z;
          g11 *= norm.w;
          float n00 = dot(g00, vec2(fx.x, fy.x));
          float n10 = dot(g10, vec2(fx.y, fy.y));
          float n01 = dot(g01, vec2(fx.z, fy.z));
          float n11 = dot(g11, vec2(fx.w, fy.w));
          vec2 fade_xy = fade(Pf.xy);
          vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
          float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
          return 2.3 * n_xy;
        }

        float cubicOut(float t) {
          float f = t - 1.0;
          return f * f * f + 1.0;
        }
        float quadraticOut(float t) {
          return -t * (t - 2.0);
        }
        float cubicIn(float t) {
          return t * t * t;
        }
        float qinticIn(float t) {
          return pow(t, 4.0);
        }
        float map(float value, float min1, float max1, float min2, float max2) {
          float val = min2 + (value - min1) * (max2 - min2) / (max1 - min1);
          return clamp(val, min2, max2);
        }
        float cubicInOut(float t) {
          return t < 0.5
            ? 4.0 * t * t * t
            : 0.5 * pow(2.0 * t - 2.0, 3.0) + 1.0;
        }
        float quarticInOut(float t) {
          return t < 0.5
            ? +8.0 * pow(t, 4.0)
            : -8.0 * pow(t - 1.0, 4.0) + 1.0;
        }
        
        float quadraticInOut(float t) {
          float p = 2.0 * t * t;
          return t < 0.5 ? p : -p + (4.0 * t) - 1.0;
        }
        float parabola( float x, float k ) {
          return pow( 4. * x * ( 1. - x ), k );
        }
        void main() {
          //  texture cover
          vec2 uv = vUv - vec2(0.5);
          float aspect1 = uTextureSize.x/uTextureSize.y;
          float aspect2 = uElementSize.x/uElementSize.y;
          if(aspect1>aspect2){uv *= vec2( aspect2/aspect1,1.);} 
          else{uv *= vec2( 1.,aspect1/aspect2);}
          uv += vec2(0.5);
          float uAspect = uElementSize.x/uElementSize.y;
          float imageAspect = uTextureSize.x/uTextureSize.y;
  
          vec4 defaultColor = texture2D(uTexture, uv);
    
        if(uType==1.){
            float hash = hashwithoutsine12(vUv*1000. + floor(uEffectTime*3.)*0.1);
            vec3 fillColor = uFillColor;
  
            float n = (cnoise(vUv*vec2(12.,1.)) + 1.);
            
            float dt = parabola( cubicInOut(uEffectProgress),1.);
            vec2 distUV = uv;
            distUV.y = 1.-(1.-uv.y)*(1. -dt) ;
            defaultColor = texture2D(uTexture, distUV);
            float width = 1.;
            float w = width*dt;
  
            float maskvalue = smoothstep(1. - w,1.,vUv.y + mix(-w/2., 1. - w/2., cubicInOut(uEffectProgress)));
            float mask = maskvalue + maskvalue * n;
  
            float final = smoothstep(1.,1.+0.01,mask);
            float dist = -0.5;
            float final1 = smoothstep(1.,1.+0.01,mask-dist);
            if(final1==0.) discard;
  
            vec3 finalColor = mix(fillColor, defaultColor.rgb, final);
            gl_FragColor = vec4(finalColor,1.);
  
          } else if(uType==2.){
  
            float s = 80.;
  
            vec2 gridSize = vec2(
              s, 
              floor(s/uAspect)
            );
  
            vec2 newUV = floor(vUv * gridSize);
  
            float x = floor(vUv.x * 5.);
            float y = floor(vUv.y * 5.);
            float pattern = hashwithoutsine12(newUV);
  
            float w = 0.5;

            float p0 = (clamp( (uEffectProgress - 0.2*0.)/0.8,0.,1.));
  
            float p1 = (clamp( (uEffectProgress - 0.2*1.)/0.8,0.,1.));
  
            p0  = map(p0, 0., 1., -w,  1.);
            p0 = smoothstep(p0,p0+w,1.-vUv.y);
            float p0_ = clamp(1. - 2.*p0 +pattern,0.,1.);
  
            p1  = map(p1, 0., 1., -w,  1.);
            p1 = smoothstep(p1,p1+w,1.-vUv.y);
            float p1_ = clamp(1. - 2.*p1 +pattern,0.,1.);
  

            float dt = parabola( cubicInOut(uEffectProgress),1.);
            vec2 distUV = uv;
            distUV.y = 1.-(1.-uv.y)*(1. -dt) ;
            defaultColor = texture2D(uTexture, distUV); 

            vec3 finalColor = mix( uFillColor,defaultColor.rgb,p1_);
  
            // gl_FragColor = vec4(vec3(p0_,p1_,0.),p0_);
            gl_FragColor = vec4(finalColor,p0_);
          }  else if(uType==3.){
  
            float progress = quadraticInOut(1.-uEffectProgress);
            float s = 50.;
            vec2 gridSize = vec2(
              s, 
              floor(s/imageAspect)
            );
  
            // curtain
            float v = smoothstep(0.0, 1.0, vUv.y + sin(vUv.x*4.0+progress*6.0) * mix(0.3, 0.1, abs(0.5-vUv.x)) * 0.5 * smoothstep(0.0, 0.2, progress) + (1.0 - progress * 2.0));
  
            float mixnewUV =(vUv.x * 3. + (1.0-v) * 50.0)*progress;
              vec2 subUv = mix(uv, floor(uv * gridSize) / gridSize, mixnewUV);
  
            vec4 color = texture2D(uTexture, subUv);
            color.a =  mix(1.0, pow(v, 5.0) , step(0.0, progress));
            color.a = pow(v, 1.0);
            // mix some color
            color.rgb = mix(color.rgb, uFillColor, smoothstep(0.5, 0.0, abs(0.5-color.a)) * progress);
            gl_FragColor = color;  
          } 
        }
      `
);

extend({ EmergeMaterial });

export function EmergingImage ({ width, height, url, type, color, setImageShow, ...props }) {
    const [refMesh, setRefMesh] = useState(null);
    const [texture, setTexture] = useState(null);
    const [textureSize, setTextureSize] = useState([0, 0]);
    const [elementSize, setElementSize] = useState([0, 0]);
    const screenSize = useScreenSize();
    const [isIntersecting, setIsIntersecting] = useState(false);

    useEffect(() => {
        new THREE.TextureLoader().loadAsync(url).then(data => {
            setTextureSize([data.source.data.width, data.source.data.height]);
            setTexture(data);
            setIsIntersecting(true);
        });
    }, []);

    useEffect(() => {
        if (refMesh) {
            refMesh.material.uEffectProgress = 0;
            refMesh.material.uType = type;
        }
    }, [type]);

    useGSAP(() => {
        if (refMesh?.material) {
            gsap.to(refMesh.material, {
                uEffectProgress: isIntersecting ? 1 : 0,
                duration: 2,
                ease: 'none',
                onComplete: () => {
                    setImageShow(false);
                },
            });
        }
    }, [isIntersecting, type]);

    useLayoutEffect(() => {
        if (refMesh) {
            setElementSize([width, height]);
            refMesh?.scale.set(width, height, 1);
            setIsIntersecting(true);
        }
    }, [refMesh]);

    useEffect(() => {
        setElementSize([width, height]);
        refMesh?.scale.set(width, height, 1);
    }, [screenSize]);

    return (
        <mesh ref={setRefMesh} {...props}>
            <planeGeometry args={[1, 1]} />
            <emergeMaterial
                uFillColor={new THREE.Color(color)}
                uTexture={texture}
                uTextureSize={new THREE.Vector2(textureSize[0], textureSize[1])}
                uElementSize={new THREE.Vector2(elementSize[0], elementSize[1])}
            />
        </mesh>
    );
}

EmergingImage.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    url: PropTypes.string,
    color: PropTypes.string,
    type: PropTypes.number,
    setImageShow: PropTypes.func,
};
