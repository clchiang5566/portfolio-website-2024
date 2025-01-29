import React, { useMemo } from 'react';
import { MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import PropTypes from 'prop-types';
import { useMediaQueryCheck, useMediaQueryLaptopCheck } from '../../hooks/useMediaQueryCheck';

function createStarGeometry (points = 5, outerRadius = 1, innerRadius = 0.5, width = 1, height = 1) {
    const shape = new THREE.Shape();

    const angleStep = (Math.PI * 2) / points;
    const halfAngleStep = angleStep / 2;

    for (let i = 0; i < points; i++) {
        const outerX = Math.cos(i * angleStep) * outerRadius * width;
        const outerY = Math.sin(i * angleStep) * outerRadius * height;
        const innerX = Math.cos(i * angleStep + halfAngleStep) * innerRadius * width;
        const innerY = Math.sin(i * angleStep + halfAngleStep) * innerRadius * height;

        if (i === 0) {
            shape.moveTo(outerX, outerY);
        } else {
            shape.lineTo(outerX, outerY);
        }
        shape.lineTo(innerX, innerY);
    }

    shape.closePath();

    const geometry = new THREE.ShapeGeometry(shape);
    return geometry;
}

export function Star ({ outerRadius = 1, innerRadius = 0.5, color = '#ffff4f' }) {
    const { isMobile } = useMediaQueryCheck(991);
    const { isLaptop } = useMediaQueryLaptopCheck(1500);
    const width = isMobile ? 1.3 : isLaptop ? 3.6 : 5;
    const height = isMobile ? 1.1 : isLaptop ? 1.8 : 2.6;
    const points = isMobile ? 10 : 18;

    const geometry = useMemo(() => createStarGeometry(points, outerRadius, innerRadius, width, height), [
        points,
        outerRadius,
        innerRadius,
        width,
        height,
    ]);

    return (
        <mesh geometry={geometry}>
            <meshBasicMaterial />
            <MeshDistortMaterial color={color} speed={2.5} distort={0.4} />
        </mesh>
    );
}

Star.propTypes = {
    points: PropTypes.number,
    outerRadius: PropTypes.number,
    innerRadius: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    color: PropTypes.string,
};
